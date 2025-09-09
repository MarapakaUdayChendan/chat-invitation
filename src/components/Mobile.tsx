import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { OtpGeneration } from "./OtpGeneration";
import { COLORS, FONT, INPUT } from "../styles/theme";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../navigation/RootStackNavigation";

const Mobile: React.FC = () => {
  const [mobile, setMobile] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();

  const handleSendOtp = () => {
    if (mobile.length !== 10) {
      setMobileError("Enter a valid 10-digit mobile number");
      return;
    }
    const otp = OtpGeneration();
    setGeneratedOtp(otp);
    setMobileError("");
    setOtpError("");
    setOtpVisible(true);
    console.log("OTP Sent", `Your OTP is ${otp}`);
  };

  const handleSubmit = () => {
    if (!generatedOtp) {
      setOtpError("Please generate OTP first.");
      return;
    }
    if (enteredOtp === generatedOtp) {
      setOtpError("");
      navigation.navigate("ContactHome");
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Login with Mobile</Text>

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={(text) => {
            setMobile(text);
            setMobileError("");
          }}
          maxLength={10}
        />
        {mobileError ? <Text style={styles.error}>{mobileError}</Text> : null}

        <TouchableOpacity style={styles.primaryButton} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>

        {otpVisible && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="number-pad"
              value={enteredOtp}
              onChangeText={(text) => {
                setEnteredOtp(text);
                setOtpError("");
              }}
            />
            {otpError ? <Text style={styles.error}>{otpError}</Text> : null}

            <TouchableOpacity
              style={styles.accentButton}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default Mobile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    paddingBottom: 50,
  },
  card: {
    width: "100%",
    maxWidth: 370,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    shadowColor: COLORS.background,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  heading: {
    fontSize: FONT.size.heading,
    fontWeight: FONT.weight.bold,
    textAlign: "center",
    marginBottom: 24,
    color: COLORS.primary,
    fontFamily: FONT.family,
  },
  input: {
    ...INPUT,
    width: "100%",
    textAlign: "center",
  },
  error: {
    color: COLORS.error,
    fontSize: FONT.size.label,
    marginBottom: 8,
    textAlign: "center",
    fontFamily: FONT.family,
    fontWeight: FONT.weight.medium,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  accentButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.onPrimary,
    fontSize: FONT.size.button,
    fontWeight: FONT.weight.bold,
    textAlign: "center",
    fontFamily: FONT.family,
    letterSpacing: 0.5,
  },
});
