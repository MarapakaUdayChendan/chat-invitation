import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { OtpGeneration } from "../components/OtpGeneration";
import { COLORS, FONT, INPUT } from "../styles/theme";

const SignUpConfirmation: React.FC = () => {
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    generateOtp();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateOtp = () => {
    const otp = OtpGeneration();
    setGeneratedOtp(otp);
    setTimeLeft(30);
    console.log("Generated OTP:", otp);
  };

  const handleSubmit = () => {
    if (timeLeft === 0) {
      setError("OTP expired, Please resend a new one.");
      return;
    }

    if (enteredOtp === generatedOtp) {
      setError("");
      Alert.alert("Success", "OTP Verified Successfully!");
    } else {
      setError("Invalid OTP, please try again");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Enter OTP</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter 4-digit OTP"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="number-pad"
          maxLength={4}
          value={enteredOtp}
          onChangeText={(text) => {
            setEnteredOtp(text);
            setError("");
          }}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.timer}>
          {timeLeft > 0 ? `OTP expires in ${timeLeft}s` : "OTP expired"}
        </Text>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        {timeLeft === 0 && (
          <TouchableOpacity
            style={[styles.submitButton, styles.resendButton]}
            onPress={generateOtp}
          >
            <Text style={styles.buttonText}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SignUpConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 370,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    alignItems: "center",
  },
  heading: {
    fontSize: FONT.size.heading,
    fontWeight: FONT.weight.bold,
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: FONT.family,
  },
  input: {
    ...INPUT,
    width: "100%",
    textAlign: "center",
    fontSize: FONT.size.input,
  },
  error: {
    color: COLORS.error,
    fontSize: FONT.size.label,
    marginBottom: 12,
    textAlign: "center",
    fontFamily: FONT.family,
    fontWeight: FONT.weight.medium,
  },
  timer: {
    fontSize: FONT.size.subheading,
    marginBottom: 20,
    color: COLORS.secondaryText,
    fontFamily: FONT.family,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  resendButton: {
    backgroundColor: COLORS.accent,
    marginTop: 12,
  },
  buttonText: {
    color: COLORS.onPrimary,
    fontSize: FONT.size.button,
    fontWeight: FONT.weight.bold,
    fontFamily: FONT.family,
  },
});
