import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { COLORS, FONT, INPUT } from "../styles/theme";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../navigation/RootStackNavigation";

const InviteUsers: React.FC = () => {
  const [options, setOptions] = useState([
    { id: 1, label: "E-Mail", checked: false },
    { id: 2, label: "SMS", checked: false },
    { id: 3, label: "What's app", checked: false },
    { id: 4, label: "Invite through chat (Platform Users)", checked: false },
  ]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();
  const toggleCheckbox = (id: number) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, checked: !opt.checked } : opt))
    );
  };

  const handleSubmit = () => {
    const selected = options.filter((opt) => opt.checked).map((opt) => opt.label);
    console.log("Selected Options:", selected);
    navigation.navigate('MobileScreen')
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.checkboxContainer}
            onPress={() => toggleCheckbox(option.id)}
          >
            <View style={[styles.checkbox, option.checked && styles.checkedBox]}>
              {option.checked && <View style={styles.innerCheck} />}
            </View>
            <Text style={styles.label}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InviteUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#add0f752',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    backgroundColor: COLORS.primary,
  },
  innerCheck: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.onPrimary,
    borderRadius: 2,
  },
  label: {
    fontSize: FONT.size.input,
    color: COLORS.onSurface,
    flexShrink: 1, // ensures long text wraps
  },
  button: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    width: "90%",
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.onPrimary,
    fontSize: FONT.size.button,
    fontWeight: FONT.weight.medium,
  },
});
