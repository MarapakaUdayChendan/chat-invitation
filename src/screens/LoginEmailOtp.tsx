import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStack } from ".././navigation/RootStackNavigation";
import { OtpGeneration } from ".././components/OtpGeneration";
import { COLORS } from "../styles/theme";

type LoginEmailOtpScreenProps = NativeStackScreenProps<
  RootStack,
  "LoginEmailOtp"
>;

const LoginEmailOtp: React.FC<LoginEmailOtpScreenProps> = ({ route }) => {
  const navigation = useNavigation<any>();
  const { email } = route.params;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const inputRefs = useRef<TextInput[]>([]);

  const themeColor = "#4A90E2";

  useEffect(() => {
    const generated = OtpGeneration();
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
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (statusType === "error") {
        setStatusMessage("");
        setStatusType("");
      }

      if (value && index < 3) {
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
    if (otpValue.length !== 4) {
      setStatusMessage("Please enter complete OTP");
      setStatusType("error");
      return false;
    }

    if (timer === 0) {
      setStatusMessage("OTP expired, please resend");
      setStatusType("error");
      return false;
    }

    if (otpValue === generatedOtp) {
      setStatusMessage("OTP Matched");
      setStatusType("success");
      console.log("OTP Matched");
      navigation.navigate("ContactHome");
      return true;
    } else {
      setStatusMessage("Invalid OTP");
      setStatusType("error");
      console.log("Invalid OTP");
      return false;
    }
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      const newOtp = OtpGeneration();
      console.log("Resent OTP:", newOtp);
      setGeneratedOtp(newOtp);
      setTimer(60);
      setOtp(["", "", "", ""]);
      setStatusMessage("New OTP sent to your email");
      setStatusType("success");
      inputRefs.current[0]?.focus();

      setTimeout(() => {
        setStatusMessage("");
        setStatusType("");
      }, 3000);
    }
  };

  const handleEditEmail = () => {
    navigation.goBack();
  };

  const handleTermsPress = () =>
    Alert.alert(
      "Terms of Service",
      "Terms of service content would appear here."
    );
  const handlePrivacyPress = () =>
    Alert.alert("Privacy Policy", "Privacy policy content would appear here.");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Verify Email</Text>
          <View style={styles.emailContainer}>
            <Text style={styles.subtitle}>
              We have sent a 4 digit verification code to{" "}
            </Text>
            <View style={styles.emailRow}>
              <Text style={styles.emailText}>{email}</Text>
              <TouchableOpacity onPress={handleEditEmail}>
                <Ionicons name="pencil" size={16} color={themeColor} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  digit && styles.otpInputFilled,
                  statusType === "error" && styles.otpInputError,
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </View>

          {statusMessage ? (
            <Text
              style={[
                styles.statusMessage,
                {
                  color: statusType === "success" ? "#4CAF50" : "#FF3B30",
                },
              ]}
            >
              {statusMessage}
            </Text>
          ) : null}

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive code? </Text>
            <TouchableOpacity onPress={handleResendOtp} disabled={timer > 0}>
              <Text
                style={[
                  styles.resendLink,
                  { color: themeColor },
                  timer > 0 && styles.disabledLink,
                ]}
              >
                Resend
              </Text>
            </TouchableOpacity>
            <Text style={styles.resendText}> - {formatTime(timer)}</Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By clicking continue, you agree to our{" "}
            </Text>
            <TouchableOpacity onPress={handleTermsPress}>
              <Text style={[styles.linkText, { color: themeColor }]}>
                Terms of Service
              </Text>
            </TouchableOpacity>
            <Text style={styles.termsText}> and </Text>
            <TouchableOpacity onPress={handlePrivacyPress}>
              <Text style={[styles.linkText, { color: themeColor }]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>.</Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: themeColor }]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000000",
    textAlign: "center",
  },
  emailContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
    color: "#000000",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    width: 52,
    height: 60,
    marginHorizontal: 8,
    fontSize: 20,
    fontWeight: "600",
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  otpInputFilled: {
    borderColor: "#4A90E2",
    backgroundColor: "#FFFFFF",
  },
  otpInputError: {
    borderColor: "#FF3B30",
  },
  statusMessage: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
    fontWeight: "600",
    fontSize: 14,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  resendText: {
    fontSize: 14,
    color: "#666666",
  },
  resendLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  disabledLink: {
    color: "#999999",
  },
  bottomSection: {
    width: "100%",
    marginTop: "auto",
    paddingBottom: 20,
  },
  termsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 12,
    color: "#666666",
    lineHeight: 18,
  },
  linkText: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  submitButton: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginEmailOtp;
