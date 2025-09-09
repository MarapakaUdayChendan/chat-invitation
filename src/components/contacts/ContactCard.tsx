import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONT } from "../../styles/theme";

interface Props {
  id: string;
  name: string;
  phone?: string;
  imageUri?: string;
  isSelected?: boolean;
  isSelectionMode: boolean;
  onPress: () => void;
}

const ContactCard: React.FC<Props> = ({
  name,
  phone,
  imageUri,
  isSelected = false,
  isSelectionMode,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selected]}
      onPress={onPress}
    >
      {isSelectionMode && (
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      )}

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {(name[0] || "?").toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{name || "Unknown"}</Text>
        {phone && <Text style={styles.phone}>{phone}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default ContactCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  selected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: COLORS.onPrimary, fontSize: 18, fontWeight: "700" },
  info: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT.family,
    color: COLORS.onSurface,
  },
  phone: { fontSize: 14, color: COLORS.secondaryText, fontFamily: FONT.family },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxSelected: { backgroundColor: COLORS.primary },
  checkmark: { color: COLORS.onPrimary, fontWeight: "bold", fontSize: 14 },
});
