import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { OtpGeneration } from "./OtpGeneration";

const Mobile: React.FC = () => {
  const [mobile, setMobile] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleSendOtp = () => {
    if (mobile.length !== 10) {
      setMobileError("Enter a valid 10-digit mobile number");
      return;
    }
    const otp = OtpGeneration();
    setGeneratedOtp(otp);
    setMobileError("");
    setOtpError("");
    console.log("Generated OTP:", otp);
    Alert.alert("OTP Sent", `Your OTP is ${otp}`);
  };

  const handleSubmit = () => {
    if (!generatedOtp) {
      setOtpError("Please generate OTP first.");
      return;
    }
    if (enteredOtp === generatedOtp) {
      setOtpError("");
      Alert.alert("Success", "Logged in successfully!");
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.heading}>Login with Mobile</Text>

          <TextInput
            style={[styles.input, mobileError ? styles.inputError : null]}
            placeholder="Enter Mobile Number"
            keyboardType="numeric"
            maxLength={10}
            value={mobile}
            onChangeText={(text) => {
              setMobile(text);
              setMobileError("");
            }}
          />
          {mobileError ? <Text style={styles.error}>{mobileError}</Text> : null}

          <TouchableOpacity style={styles.sendButton} onPress={handleSendOtp}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>

          <TextInput
            style={[styles.input, otpError ? styles.inputError : null]}
            placeholder="Enter OTP"
            keyboardType="numeric"
            maxLength={4}
            value={enteredOtp}
            onChangeText={(text) => {
              setEnteredOtp(text);
              setOtpError("");
            }}
          />
          {otpError ? <Text style={styles.error}>{otpError}</Text> : null}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    padding: 15,
    paddingBottom: 50,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
    color: "#222",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 5,
    fontSize: 16,
    backgroundColor: "#fafafa",
    textAlign: "center",
  },
  inputError: {
    borderColor: "red",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  sendButton: {
    backgroundColor: "#4e8cff",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Mobile;