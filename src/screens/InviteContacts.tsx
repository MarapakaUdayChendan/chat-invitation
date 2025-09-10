import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, FONT } from "../styles/theme";

interface SelectedContact {
  id: string;
  name: string;
  phoneNumber: string;
}

export default function InviteContacts() {
  const navigation = useNavigation<any>();
  const [selectedContacts, setSelectedContacts] = useState<SelectedContact[]>([]);

  // Load contacts from AsyncStorage every time screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadContacts = async () => {
        try {
          const json = await AsyncStorage.getItem("INVITED_CONTACTS");
          if (json) {
            setSelectedContacts(JSON.parse(json));
          } else {
            setSelectedContacts([]);
          }
        } catch (e) {
          console.error("Error loading contacts", e);
        }
      };
      loadContacts();
    }, [])
  );

  const handleSendIndividualInvite = (contact: SelectedContact) => {
    Alert.alert("Send Invite", `Send invitation to ${contact.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Send",
        onPress: () => {
          console.log(
            `Sending invite to ${contact.name} at ${contact.phoneNumber}`
          );
          Alert.alert("Success", `Invitation sent to ${contact.name}!`);
        },
      },
    ]);
  };

  const handleSendBulkInvite = () => {
    Alert.alert(
      "Send Invites",
      `Send invitation to all ${selectedContacts.length} contacts?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send All",
          onPress: () => {
            selectedContacts.forEach((contact) => {
              console.log(
                `Sending invite to ${contact.name} at ${contact.phoneNumber}`
              );
            });
            Alert.alert(
              "Success",
              `Invitations sent to ${selectedContacts.length} contacts!`,
              [{ text: "OK", onPress: () => navigation.goBack() }]
            );
          },
        },
      ]
    );
  };

  const renderContactItem = ({ item }: { item: SelectedContact }) => (
    <View style={styles.contactItem}>
      <View style={styles.contactInfo}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {(item.name[0] || "?").toUpperCase()}
          </Text>
        </View>
        <View style={styles.contactDetails}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.inviteButton}
        activeOpacity={0.8}
        onPress={() => handleSendIndividualInvite(item)}
      >
        <Text style={styles.inviteButtonText}>Invite</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Invites</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Selected Contacts</Text>
        <Text style={styles.summaryCount}>
          {selectedContacts?.length || 0} contact(s) selected
        </Text>
      </View>

      <FlatList
        data={selectedContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        style={styles.contactsList}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={styles.emptyText}>No contacts selected</Text>
          </View>
        }
      />

      {selectedContacts && selectedContacts.length > 0 && (
        <TouchableOpacity
          style={styles.sendAllButton}
          activeOpacity={0.85}
          onPress={handleSendBulkInvite}
        >
          <Text style={styles.sendAllButtonText}>
            Send Invite to All ({selectedContacts.length})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    backgroundColor: COLORS.background,
    marginTop: 40,
  },
  backButton: { padding: 8 },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: FONT.weight.bold,
    fontFamily: FONT.family,
  },
  headerTitle: {
    fontSize: FONT.size.subheading,
    fontWeight: FONT.weight.bold,
    color: COLORS.primary,
    fontFamily: FONT.family,
  },

  summaryCard: {
    backgroundColor: COLORS.surface,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.borderAccent,
  },
  summaryTitle: {
    fontSize: FONT.size.label,
    fontWeight: FONT.weight.bold,
    color: COLORS.primary,
    marginBottom: 4,
    fontFamily: FONT.family,
  },
  summaryCount: {
    fontSize: FONT.size.label,
    color: COLORS.onSurface,
    fontWeight: FONT.weight.medium,
    fontFamily: FONT.family,
  },

  contactsList: { flex: 1, paddingHorizontal: 10 },

  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  contactInfo: { flexDirection: "row", alignItems: "center", flex: 1 },

  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: FONT.weight.bold,
    color: COLORS.onPrimary,
    fontFamily: FONT.family,
  },

  contactDetails: { flex: 1 },
  contactName: {
    fontSize: FONT.size.input,
    fontWeight: FONT.weight.bold,
    color: COLORS.onSurface,
    marginBottom: 2,
    fontFamily: FONT.family,
  },
  contactPhone: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: FONT.family,
  },

  inviteButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  inviteButtonText: {
    color: COLORS.onPrimary,
    fontWeight: FONT.weight.bold,
    fontSize: FONT.size.button,
    fontFamily: FONT.family,
  },

  emptyText: {
    fontSize: FONT.size.input,
    color: COLORS.hint,
    fontFamily: FONT.family,
  },

  sendAllButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  sendAllButtonText: {
    color: COLORS.onPrimary,
    fontSize: FONT.size.button,
    fontWeight: FONT.weight.bold,
    fontFamily: FONT.family,
  },
});
