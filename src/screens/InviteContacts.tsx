import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'

interface SelectedContact {
  id: string;
  name: string;
  phoneNumber: string;
}

export default function InviteContacts() {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Get selectedContacts from route params
  const { selectedContacts } = route.params as { selectedContacts: SelectedContact[] };

  // Handle sending invite to individual contact
  const handleSendIndividualInvite = (contact: SelectedContact) => {
    Alert.alert(
      "Send Invite",
      `Send invitation to ${contact.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Send", 
          onPress: () => {
            // Add your invite logic here (SMS, WhatsApp, etc.)
            console.log(`Sending invite to ${contact.name} at ${contact.phoneNumber}`);
            Alert.alert("Success", `Invitation sent to ${contact.name}!`);
          }
        }
      ]
    );
  };

  // Handle sending invite to all contacts
  const handleSendBulkInvite = () => {
    Alert.alert(
      "Send Invites",
      `Send invitation to all ${selectedContacts.length} contacts?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Send All", 
          onPress: () => {
            // Add your bulk invite logic here
            selectedContacts.forEach(contact => {
              console.log(`Sending invite to ${contact.name} at ${contact.phoneNumber}`);
            });
            Alert.alert(
              "Success", 
              `Invitations sent to ${selectedContacts.length} contacts!`,
              [
                {
                  text: "OK",
                  onPress: () => navigation.goBack()
                }
              ]
            );
          }
        }
      ]
    );
  };

  // Render individual contact item
  const renderContactItem = ({ item }: { item: SelectedContact }) => {
    const avatarLetter = (item.name[0] || "?").toUpperCase();

    return (
      <View style={styles.contactItem}>
        <View style={styles.contactInfo}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          
          <View style={styles.contactDetails}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => handleSendIndividualInvite(item)}
        >
          <Text style={styles.inviteButtonText}>Invite</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Invites</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Selected contacts count */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Selected Contacts</Text>
        <Text style={styles.summaryCount}>{selectedContacts?.length || 0} contact(s) selected</Text>
      </View>

      {/* Contacts list */}
      <FlatList
        data={selectedContacts || []}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id}
        style={styles.contactsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No contacts selected</Text>
          </View>
        }
      />

      {/* Send all button */}
      {selectedContacts && selectedContacts.length > 0 && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.sendAllButton}
            onPress={handleSendBulkInvite}
          >
            <Text style={styles.sendAllButtonText}>
              Send Invite to All ({selectedContacts.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 40,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  placeholder: {
    width: 50,
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  summaryCount: {
    fontSize: 14,
    color: '#6c757d',
  },
  contactsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#6c757d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: '#6c757d',
  },
  inviteButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  sendAllButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sendAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
