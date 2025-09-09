import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { COLORS, FONT, INPUT } from "../../styles/theme";

interface Props {
  query: string;
  onChange: (text: string) => void;
}

const ContactSearch: React.FC<Props> = ({ query, onChange }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder="Search by name or phone..."
      placeholderTextColor={COLORS.placeholder}
      value={query}
      onChangeText={onChange}
    />
  );
};

export default ContactSearch;

const styles = StyleSheet.create({
  input: {
    ...INPUT,
    marginHorizontal: 16,
    marginBottom: 12,
    height: 48,
    fontSize: FONT.size.input,
  },
});
