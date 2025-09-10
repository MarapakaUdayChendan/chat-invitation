import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { COLORS, FONT, INPUT } from "../styles/theme"; 
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../navigation/RootStackNavigation";

const OrganizationSelection: React.FC = () => {
  const [myOrg, setMyOrg] = useState("My Organization");
  const [externalOrg, setExternalOrg] = useState("My Organization");
  const [entryPoint, setEntryPoint] = useState("Customer");
  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();
  
  const handleSubmit = () => {
      navigation.navigate('InviteUsers')
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Organization Selection</Text>

        <Text style={styles.label}>My Org</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={myOrg}
            dropdownIconColor={COLORS.primary}
            style={styles.picker}
            onValueChange={(itemValue) => setMyOrg(itemValue)}
          >
            <Picker.Item label="My Organization" value="My Organization" />
            <Picker.Item label="Org A" value="Org A" />
            <Picker.Item label="Org B" value="Org B" />
          </Picker>
        </View>

        <Text style={styles.label}>External Org</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={externalOrg}
            dropdownIconColor={COLORS.primary}
            style={styles.picker}
            onValueChange={(itemValue) => setExternalOrg(itemValue)}
          >
            <Picker.Item label="My Organization" value="My Organization" />
            <Picker.Item label="External Org A" value="External Org A" />
            <Picker.Item label="External Org B" value="External Org B" />
          </Picker>
        </View>

        <Text style={styles.heading}>Entry Point Selection</Text>

        <Text style={styles.label}>Entry Point</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={entryPoint}
            dropdownIconColor={COLORS.primary}
            style={styles.picker}
            onValueChange={(itemValue) => setEntryPoint(itemValue)}
          >
            <Picker.Item label="Customer" value="Customer" />
            <Picker.Item label="Admin" value="Admin" />
            <Picker.Item label="Partner" value="Partner" />
          </Picker>
        </View>
      </ScrollView>

     
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrganizationSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, 
  },
  heading: {
    fontSize: FONT.size.subheading,
    fontWeight: FONT.weight.bold,
    color: COLORS.onSurface,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: FONT.size.label,
    color: COLORS.secondaryText,
    marginBottom: 4,
    marginTop: 8,
  },
  pickerWrapper: {
    ...INPUT,
    padding: 0,
    justifyContent: "center",
    marginBottom: 12,
  },
  picker: {
    color: COLORS.onSurface,
    fontSize: FONT.size.input,
  },
  button: {
    position: "absolute",
    bottom: 16,          
    alignSelf: "center", 
    width: '90%',        
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.onPrimary,
    fontSize: FONT.size.button,
    fontWeight: FONT.weight.medium,
  },
});
