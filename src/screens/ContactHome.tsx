import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as ExpoContacts from "expo-contacts";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStack } from "../navigation/RootStackNavigation";
import { COLORS, FONT } from "../styles/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ContactList from "../components/contacts/ContactList";
import ContactSearch from "../components/contacts/ContactSearch";
import ContactPermission from "../components/contacts/ContactPermission";

interface Contact {
  id: string;
  name: string;
  phoneNumbers?: { label: string; number: string }[];
  emails?: { label: string; email: string }[];
  imageAvailable?: boolean;
  image?: { uri: string };
}

interface SelectedContact {
  id: string;
  name: string;
  phoneNumber: string;
}

const ContactHome: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "checking" | "requesting"
  >("checking");
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
    new Set()
  );
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const loadContacts = useCallback(async () => {
    setPermissionStatus("requesting");
    try {
      const { status } = await ExpoContacts.requestPermissionsAsync();
      if (status !== "granted") {
        setPermissionStatus("denied");
        setError("Contacts permission is required.");
        return;
      }
      setLoading(true);
      const { data } = await ExpoContacts.getContactsAsync({
        fields: [ExpoContacts.Fields.PhoneNumbers, ExpoContacts.Fields.Emails],
      });
      const sorted = data
        .filter((c) => c.id)
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setContacts(sorted as Contact[]);
      setPermissionStatus("granted");
      setLoading(false);
    } catch {
      setPermissionStatus("denied");
      setError("Failed to load contacts");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const filteredContacts = useMemo(() => {
    const raw = searchQuery.trim();
    if (!raw) return contacts;

    const q = raw.toLowerCase();
    const qDigits = raw.replace(/\D/g, "");
    const hasDigits = qDigits.length > 0;

    return contacts.filter((c) => {
      const nameMatch = (c.name || "").toLowerCase().includes(q);
      let phoneMatch = false;
      if (hasDigits && c.phoneNumbers?.length) {
        phoneMatch = c.phoneNumbers.some((p) =>
          (p.number || "").replace(/\D/g, "").includes(qDigits)
        );
      }
      return nameMatch || phoneMatch;
    });
  }, [searchQuery, contacts]);

  const toggleContactSelection = useCallback((id: string) => {
    setSelectedContacts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleContactPress = useCallback(
    (contact: Contact) => {
      if (isSelectionMode) return toggleContactSelection(contact.id);
      Alert.alert(
        contact.name || "Unknown",
        `Phone: ${contact.phoneNumbers?.[0]?.number || "No phone"}\nEmail: ${
          contact.emails?.[0]?.email || "No email"
        }`,
        [{ text: "Close", style: "cancel" }]
      );
    },
    [isSelectionMode, toggleContactSelection]
  );

  const handleContactLongPress = useCallback(
    (contact: Contact) => {
      if (!isSelectionMode) setIsSelectionMode(true);
      toggleContactSelection(contact.id);
    },
    [isSelectionMode, toggleContactSelection]
  );

  const handleInvite = useCallback(async () => {
    const selected: SelectedContact[] = Array.from(selectedContacts)
      .map((id) => {
        const c = contacts.find((c) => c.id === id);
        return c?.phoneNumbers?.[0]?.number
          ? {
              id: c.id,
              name: c.name || "Unknown",
              phoneNumber: c.phoneNumbers[0].number,
            }
          : null;
      })
      .filter(Boolean) as SelectedContact[];

    if (!selected.length)
      return Alert.alert("Error", "Please select contacts with phone numbers");

    try {
      await AsyncStorage.setItem("INVITED_CONTACTS", JSON.stringify(selected));
      console.log("Contacts saved:", selected);
    } catch (e) {
      console.error("Failed to save contacts", e);
    }

    navigation.navigate('OrganizationSelection');
    setSelectedContacts(new Set());
    setIsSelectionMode(false);
  }, [selectedContacts, contacts, navigation]);

  if (loading || permissionStatus === "requesting") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading contacts...</Text>
      </View>
    );
  }

  if (permissionStatus === "denied") {
    return <ContactPermission error={error} onRetry={loadContacts} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>My Contacts</Text>
        {isSelectionMode && (
          <TouchableOpacity
            style={styles.accentButton}
            onPress={() => {
              setIsSelectionMode(false);
              setSelectedContacts(new Set());
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <ContactSearch query={searchQuery} onChange={setSearchQuery} />

      {isSelectionMode && selectedContacts.size > 0 && (
        <Text style={styles.selectionText}>
          {selectedContacts.size} contact(s) selected
        </Text>
      )}

      <ContactList
        contacts={filteredContacts}
        selectedContacts={selectedContacts}
        isSelectionMode={isSelectionMode}
        onContactPress={handleContactPress}
        onContactLongPress={handleContactLongPress}
      />

      {isSelectionMode && selectedContacts.size > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleInvite}>
            <Text style={styles.buttonText}>
              Invite {selectedContacts.size} Contact(s)
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ContactHome;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  header: {
    fontSize: FONT.size.heading,
    fontWeight: FONT.weight.bold,
    color: COLORS.primary,
    fontFamily: FONT.family,
  },
  selectionText: {
    color: COLORS.onPrimary,
    textAlign: "center",
    marginBottom: 8,
    fontFamily: FONT.family,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    backgroundColor: COLORS.background,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  accentButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.onPrimary,
    fontSize: FONT.size.button,
    fontWeight: FONT.weight.bold,
    fontFamily: FONT.family,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.onPrimary,
    fontFamily: FONT.family,
  },
});
