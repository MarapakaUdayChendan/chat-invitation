import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStack } from "../../navigation/RootStackNavigation";
import { OtpGenerationSix } from "../../components/OtpGenerationSix";

type EmailOtpScreenProps = NativeStackScreenProps<RootStack, "EmailOtp">;
type EmailOtpNavigationProp = NativeStackNavigationProp<RootStack, "EmailOtp">;

const logo = require("../../../assets/logo/logo.jpg");

const EmailOtp: React.FC<EmailOtpScreenProps> = ({ route }) => {
  const navigation = useNavigation<EmailOtpNavigationProp>();
  const { email } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    const generated = OtpGenerationSix();
    setGeneratedOtp(generated);
    console.log("Generated OTP:", generated);
  }, []);
  
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setStatusMessage("Please enter complete OTP");
      return;
    }
    if (timer === 0) {
      setStatusMessage("OTP expired, please resend");
      return;
    }
    if (otpValue === generatedOtp) {
      setStatusMessage("OTP Matched");
      console.log("OTP Matched");
      navigation.navigate("PasswordScreen",{email});
    } else {
      setStatusMessage("Invalid OTP");
      console.log("Invalid OTP");
    }
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      const newOtp = OtpGenerationSix();
      console.log("Resent OTP:", newOtp);
      setGeneratedOtp(newOtp);
      setTimer(30);
      setOtp(["", "", "", "", "", ""]);
      setStatusMessage("");
      inputRefs.current[0]?.focus();
    }
  };

  const handleEditEmail = () => {
    navigation.goBack();
  };
  const handleTermsPress = () => console.log("Terms of Service pressed");
  const handlePrivacyPress = () => console.log("Privacy Policy pressed");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.content}>
        <Text style={styles.title}>Verify E-Mail</Text>
        <View style={styles.emailContainer}>
          <Text style={styles.subtitle}>
            We have sent a 6 digit verification code on{" "}
          </Text>
          <View style={styles.emailRow}>
            <Text style={styles.emailText}>{email}</Text>
            <TouchableOpacity onPress={handleEditEmail}>
              <Ionicons name="pencil" size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref as TextInput; }}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>
        {statusMessage ? (
          <Text
            style={{
              color: statusMessage.includes("Matched") ? "green" : "red",
              textAlign: "center",
              marginTop: 8,
              fontWeight: "600",
            }}
          >
            {statusMessage}
          </Text>
        ) : null}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive code? </Text>
          <TouchableOpacity onPress={handleResendOtp} disabled={timer > 0}>
            <Text style={[styles.resendLink, timer > 0 && styles.disabledLink]}>
              Resend
            </Text>
          </TouchableOpacity>
          <Text style={styles.resendText}> - {formatTime(timer)}</Text>
        </View>
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>By clicking continue, you agree to our </Text>
          <TouchableOpacity onPress={handleTermsPress}>
            <Text style={styles.linkText}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}> and </Text>
          <TouchableOpacity onPress={handlePrivacyPress}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  logo: { width: 80, height: 80, resizeMode: "contain" },
  content: { flex: 1, alignItems: "center", justifyContent: "center"},
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  emailContainer: { alignItems: "center", marginBottom: 16 },
  subtitle: { fontSize: 14, color: "#555" },
  emailRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  emailText: { fontSize: 14, fontWeight: "600", marginRight: 6 },
  otpContainer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: 40,
    height: 48,
    marginHorizontal: 6,
    fontSize: 18,
    fontWeight: "600",
  },
  resendContainer: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  resendText: { fontSize: 14, color: "#555" },
  resendLink: { fontSize: 14, color: "#007AFF", fontWeight: "600" },
  disabledLink: { color: "#aaa" },
  bottomSection: {alignItems: "center", marginTop: "auto"},
  termsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 12 },
  termsText: { fontSize: 12, color: "#555" },
  linkText: { fontSize: 12, color: "#007AFF", fontWeight: "600" },
  submitButton: {
    backgroundColor: "#007AFF",
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {    color: "#fff",
    fontSize: 16,
    fontWeight: "600",},
});
export default EmailOtp;
