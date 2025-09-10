import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { OtpGeneration } from "../components/OtpGeneration";
import { COLORS, FONT, INPUT } from "../styles/theme";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../navigation/RootStackNavigation";

const MAX_OTP_SENDS = 3;
const RETRY_TIMEOUT_HOURS = 12;
const OTP_TIMER = 30;

const ForgotPasswordConfirmation: React.FC = () => {
  const [email, setEmail] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [sendCount, setSendCount] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState<number | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();
  useEffect(() => {
    let timer: any;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    let block: any;
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
    console.log("OTP Sent", `Your OTP is ${otp}`);
  };

  const handleVerifyOtp = () => {
    if (timeLeft === 0) {
      setOtpError("OTP expired! Please resend a new one.");
      return;
    }
    if (enteredOtp === generatedOtp) {
      setOtpError("");
      Alert.alert(" Success", "OTP Verified! You can now reset your password.");
      navigation.navigate("ForgotPasswordScreen");
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  let blockMessage = "";
  if (blocked && blockTimer) {
    const msLeft = blockTimer - Date.now();
    if (msLeft > 0) {
      const hours = Math.floor(msLeft / (60 * 60 * 1000));
      const mins = Math.floor((msLeft % (60 * 60 * 1000)) / (60 * 1000));
      blockMessage = `You have reached the limit. Try again after ${hours}h ${mins}m.`;
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
      }}
    >
      <View>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Recover your account</Text>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor={COLORS.placeholder}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError("");
          }}
          editable={!blocked}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        {!blocked && timeLeft === 0 && sendCount < MAX_OTP_SENDS && (
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={handleSendOtp}
          >
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        )}

        {generatedOtp && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor={COLORS.placeholder}
              value={enteredOtp}
              onChangeText={(text) => {
                setEnteredOtp(text);
                setOtpError("");
              }}
              keyboardType="number-pad"
            />
            {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
          </>
        )}

        {timeLeft > 0 && (
          <Text style={styles.timerText}>OTP expires in {timeLeft}s</Text>
        )}

        {!blocked &&
          generatedOtp &&
          timeLeft === 0 &&
          sendCount < MAX_OTP_SENDS && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: COLORS.accent }]}
              activeOpacity={0.85}
              onPress={handleSendOtp}
            >
              <Text style={styles.buttonText}>
                {sendCount < MAX_OTP_SENDS - 1
                  ? "Resend OTP"
                  : "Resend OTP (last attempt)"}
              </Text>
            </TouchableOpacity>
          )}

        {generatedOtp && (
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={handleVerifyOtp}
          >
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        )}

        {blocked && (
          <Text style={styles.errorText}>
            {blockMessage ||
              "You have reached the OTP limit. Try after 12 hours."}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ForgotPasswordConfirmation;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  title: {
    fontSize: FONT.size.heading,
    fontWeight: FONT.weight.bold,
    marginBottom: 6,
    color: COLORS.primary,
    textAlign: "center",
    fontFamily: FONT.family,
  },
  subtitle: {
    fontSize: FONT.size.subheading,
    color: COLORS.accent,
    marginBottom: 20,
    fontWeight: FONT.weight.medium,
    textAlign: "center",
    fontFamily: FONT.family,
  },

  input: {
    ...INPUT,
    marginBottom: 12,
  },

  errorText: {
    color: COLORS.error,
    fontSize: FONT.size.label,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: FONT.family,
  },

  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: COLORS.onPrimary,
    fontSize: FONT.size.button,
    fontWeight: FONT.weight.bold,
    fontFamily: FONT.family,
  },

  timerText: {
    color: COLORS.secondaryText,
    marginBottom: 8,
    fontSize: FONT.size.label,
    textAlign: "center",
    fontFamily: FONT.family,
  },
});
