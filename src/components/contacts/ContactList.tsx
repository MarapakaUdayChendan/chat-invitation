import React from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import ContactCard from "./ContactCard";
import { COLORS, FONT } from "../../styles/theme";

interface Contact {
  id: string;
  name: string;
  phoneNumbers?: { label: string; number: string }[];
  image?: { uri: string };
  imageAvailable?: boolean;
}

interface Props {
  contacts: Contact[];
  selectedContacts: Set<string>;
  isSelectionMode: boolean;
  onContactPress: (contact: Contact) => void;
  onContactLongPress: (contact: Contact) => void;
}

const ContactList: React.FC<Props> = ({
  contacts,
  selectedContacts,
  isSelectionMode,
  onContactPress,
  onContactLongPress,
}) => {
  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ContactCard
          id={item.id}
          name={item.name || "Unknown"}
          phone={item.phoneNumbers?.[0]?.number}
          imageUri={item.imageAvailable ? item.image?.uri : undefined}
          isSelected={selectedContacts.has(item.id)}
          isSelectionMode={isSelectionMode}
          onPress={() => onContactPress(item)}
          onLongPress={() => onContactLongPress(item)}
        />
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No contacts found</Text>
      }
      contentContainerStyle={{ paddingBottom: 80 }}
    />
  );
};

export default ContactList;

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: COLORS.hint,
    fontFamily: FONT.family,
  },
});
