import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ExpoContacts from "expo-contacts";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStack } from "../navigation/RootStackNavigation";

interface Contact {
  id: string;
  name: string;
  phoneNumbers?: { label: string; number: string }[];
  emails?: { label: string; email: string }[];
  imageAvailable?: boolean;
  image?: { uri: string };
}

interface ContactsState {
  contacts: Contact[];
  loading: boolean;
  permissionStatus: "granted" | "denied" | "checking" | "requesting";
  error: string | null;
}

interface SelectedContact {
  id: string;
  name: string;
  phoneNumber: string;
}

const ContactHome: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();
  const [contactsState, setContactsState] = useState<ContactsState>({
    contacts: [],
    loading: false,
    permissionStatus: "checking",
    error: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const loadContacts = useCallback(async () => {
    setContactsState(prev => ({ ...prev, permissionStatus: "requesting" }));
    try {
      const { status } = await ExpoContacts.requestPermissionsAsync();
      if (status !== "granted") {
        return setContactsState({ contacts: [], loading: false, permissionStatus: "denied", error: "Contacts permission is required." });
      }
      setContactsState(prev => ({ ...prev, loading: true }));

      const { data } = await ExpoContacts.getContactsAsync({ fields: [ExpoContacts.Fields.PhoneNumbers, ExpoContacts.Fields.Emails] });
      const contacts = data
        .filter(c => c.id)
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        .map(c => ({
          id: c.id as string,
          name: c.name ?? "",
          phoneNumbers: c.phoneNumbers,
          emails: c.emails,
          imageAvailable: c.imageAvailable,
          image: c.image,
        }));

      setContactsState({ contacts, loading: false, permissionStatus: "granted", error: null });
    } catch {
      setContactsState(prev => ({ ...prev, loading: false, permissionStatus: "denied", error: "Failed to load contacts" }));
    }
  }, []);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  const filteredContacts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return q
      ? contactsState.contacts.filter(c =>
          (c.name?.toLowerCase().includes(q) || c.phoneNumbers?.some(p => p.number.replace(/\D/g, "").includes(q.replace(/\D/g, ""))))
        )
      : contactsState.contacts;
  }, [searchQuery, contactsState.contacts]);

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode(prev => !prev);
    if (isSelectionMode) setSelectedContacts(new Set());
  }, [isSelectionMode]);

  const toggleContactSelection = useCallback((id: string) => {
    setSelectedContacts(prev => {
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
        `Phone: ${contact.phoneNumbers?.[0]?.number || "No phone"}\nEmail: ${contact.emails?.[0]?.email || "No email"}`,
        [{ text: "Close", style: "cancel" }]
      );
    },
    [isSelectionMode, toggleContactSelection]
  );

  const handleInvite = useCallback(() => {
    const selected: SelectedContact[] = Array.from(selectedContacts)
      .map(id => {
        const c = contactsState.contacts.find(c => c.id === id);
        return c?.phoneNumbers?.[0]?.number ? { id: c.id, name: c.name || "Unknown", phoneNumber: c.phoneNumbers[0].number } : null;
      })
      .filter(Boolean) as SelectedContact[];

    if (!selected.length) return Alert.alert("Error", "Please select contacts with phone numbers");
    navigation.navigate("InviteContacts", { selectedContacts: selected });
    setSelectedContacts(new Set());
    setIsSelectionMode(false);
  }, [selectedContacts, contactsState.contacts, navigation]);

  const renderContactItem = ({ item }: { item: Contact }) => {
    const isSelected = selectedContacts.has(item.id);
    return (
      <TouchableOpacity style={[styles.contactItem, isSelected && styles.selectedContactItem]} onPress={() => handleContactPress(item)}>
        {isSelectionMode && (
          <View style={styles.selectionIndicator}>
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
        )}
        {item.imageAvailable && item.image?.uri ? (
          <Image source={{ uri: item.image.uri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{(item.name[0] || "?").toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name || "Unknown"}</Text>
          {item.phoneNumbers?.[0]?.number && <Text style={styles.contactPhone}>{item.phoneNumbers[0].number}</Text>}
          {item.emails?.[0]?.email && <Text style={styles.contactEmail}>{item.emails[0].email}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  if (contactsState.loading || contactsState.permissionStatus === "requesting") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading contacts...</Text>
      </View>
    );
  }

  if (contactsState.permissionStatus === "denied") {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16, marginBottom: 12 }}>{contactsState.error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadContacts}>
          <Text style={styles.retryText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>My Contacts</Text>
        <TouchableOpacity style={styles.selectButton} onPress={toggleSelectionMode}>
          <Text style={styles.selectButtonText}>{isSelectionMode ? "Cancel" : "Select"}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or phone number..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {isSelectionMode && selectedContacts.size > 0 && (
        <View style={styles.selectionSummary}>
          <Text style={styles.selectionText}>{selectedContacts.size} contact(s) selected</Text>
        </View>
      )}

      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No contacts found</Text>}
      />

      {isSelectionMode && selectedContacts.size > 0 && (
        <View style={styles.inviteButtonContainer}>
          <TouchableOpacity style={styles.inviteButton} onPress={handleInvite}>
            <Text style={styles.inviteButtonText}>Invite {selectedContacts.size} Contact(s)</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  header: { fontSize: 24, fontWeight: "700", color: "#000" },
  selectButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: "#000" },
  selectButtonText: { fontSize: 14, color: "#000", fontWeight: "600" },
  searchInput: { marginHorizontal: 16, marginBottom: 12, borderRadius: 8, backgroundColor: "#f2f2f2", paddingHorizontal: 12, paddingVertical: 8, fontSize: 16 },
  selectionSummary: { backgroundColor: "#e3f2fd", marginHorizontal: 16, marginBottom: 8, padding: 8, borderRadius: 6 },
  selectionText: { fontSize: 14, color: "#1976d2", fontWeight: "600" },
  contactItem: { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  selectedContactItem: { backgroundColor: "#f3e5f5" },
  selectionIndicator: { marginRight: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#ddd", justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  checkboxSelected: { backgroundColor: "#4caf50", borderColor: "#4caf50" },
  checkmark: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#ddd", justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: "600", color: "#555" },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: "600", color: "#000" },
  contactPhone: { fontSize: 14, color: "#555" },
  contactEmail: { fontSize: 14, color: "#777" },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#666" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  retryButton: { backgroundColor: "#000", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: "#fff", fontSize: 16 },
  inviteButtonContainer: { padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#eee" },
  inviteButton: { backgroundColor: "#4caf50", paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, alignItems: "center" },
  inviteButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default ContactHome;
