import React, { useState, useEffect } from "react";
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
import { OtpGeneration } from "../components/OtpGeneration";

const MAX_OTP_SENDS = 3;
const RETRY_TIMEOUT_HOURS = 12;
const OTP_TIMER = 30;

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [sendCount, setSendCount] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState<number | null>(null); // tracks block when 3 attempts done

  // Timer for OTP countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Block timer for 12 hours if needed
  useEffect(() => {
    let block: ReturnType<typeof setTimeout> | undefined;
    if (blocked && blockTimer === null) {
      const delay = RETRY_TIMEOUT_HOURS * 60 * 60 * 1000;
      setBlockTimer(Date.now() + delay);
      block = setTimeout(() => {
        setSendCount(0);
        setBlocked(false);
        setBlockTimer(null);
      }, delay);
    }
    return () => block && clearTimeout(block);
  }, [blocked, blockTimer]);

  const handleSendOtp = () => {
    if (!email.includes("@")) {
      setEmailError("Enter a valid email address");
      return;
    }
    if (sendCount >= MAX_OTP_SENDS) {
      setBlocked(true);
      return;
    }
    const otp = OtpGeneration();
    setGeneratedOtp(otp);
    setTimeLeft(OTP_TIMER);
    setSendCount((count) => count + 1);
    setEmailError("");
    setOtpError("");
    setEnteredOtp("");
    Alert.alert("OTP Sent", Your OTP is ${otp});
  };

  const handleVerifyOtp = () => {
    if (timeLeft === 0) {
      setOtpError("OTP expired! Please resend a new one.");
      return;
    }
    if (enteredOtp === generatedOtp) {
      setOtpError("");
      Alert.alert("✅ Success", "OTP Verified! You can now reset your password.");
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = () => handleSendOtp();

  // Blocked message and unlock timer
  let blockMessage = "";
  if (blocked && blockTimer) {
    const msLeft = blockTimer - Date.now();
    if (msLeft > 0) {
      const hours = Math.floor(msLeft / (60 * 60 * 1000));
      const mins = Math.floor((msLeft % (60 * 60 * 1000)) / (60 * 1000));
      blockMessage = You have reached the limit. Try again after ${hours}h ${mins}m.;
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Recover your account</Text>
        </View>

        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              editable={!blocked}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          {/* Send OTP */}
          {!blocked && timeLeft === 0 && sendCount < MAX_OTP_SENDS && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSendOtp}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Send OTP</Text>
            </TouchableOpacity>
          )}

          {/* OTP Input */}
          {generatedOtp && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>OTP</Text>
              <TextInput
                style={[styles.input, otpError && styles.inputError]}
                placeholder="Enter 4-digit OTP"
                keyboardType="numeric"
                maxLength={4}
                value={enteredOtp}
                onChangeText={(text) => {
                  setEnteredOtp(text);
                  setOtpError("");
                }}
              />
              {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
            </View>
          )}

          {/* Timer */}
          {timeLeft > 0 && (
            <Text style={styles.timerText}>OTP expires in {timeLeft}s</Text>
          )}

          {/* Resend OTP */}
          {!blocked && generatedOtp && timeLeft === 0 && sendCount < MAX_OTP_SENDS && (
            <TouchableOpacity
              onPress={handleResendOtp}
              style={styles.resendWrapper}
              activeOpacity={0.7}
            >
              <Text style={styles.resendText}>
                {sendCount < MAX_OTP_SENDS - 1
                  ? "Resend OTP"
                  : "Resend OTP (last attempt)"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, styles.successButton]}
            onPress={handleVerifyOtp}
            activeOpacity={0.8}
            disabled={blocked || !generatedOtp}
          >
            <Text style={styles.primaryButtonText}>Verify OTP</Text>
          </TouchableOpacity>

          {/* Block message */}
          {blocked && (
            <Text
              style={[
                styles.errorText,
                { textAlign: "center", marginTop: 18, fontWeight: "700" },
              ]}
            >
              {blockMessage || "You have reached the OTP limit. Try after 12 hours."}
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    minHeight: "100%",
  },
  header: { alignItems: "center", marginBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
  },
  subtitle: { fontSize: 16, color: "#666", fontWeight: "400" },
  form: { width: "100%" },
  inputContainer: { marginBottom: 24 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    color: "#000",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
    }),
  },
  inputError: { borderColor: "#dc3545", backgroundColor: "#fff5f5" },
  errorText: { fontSize: 12, color: "#dc3545", marginTop: 6, fontWeight: "500" },
  timerText: {
    textAlign: "center",
    color: "#555",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },
  successButton: {
    backgroundColor: "#28a745",
    marginTop: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  resendWrapper: { alignItems: "center", paddingVertical: 8 },
  resendText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});

export default ForgotPasswordScreen;