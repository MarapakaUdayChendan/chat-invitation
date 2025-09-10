import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStack } from "../../navigation/RootStackNavigation";
import { OtpGenerationSix } from "../../components/OtpGenerationSix";

type MobileOtpScreenProps = NativeStackScreenProps<RootStack, "MobileOtp">;
type MobileOtpNavigationProp = NativeStackNavigationProp<
  RootStack,
  "MobileOtp"
>;

const logo = require("../../../assets/logo/logo1.png");

const MobileOtp: React.FC<MobileOtpScreenProps> = ({ route }) => {
  const navigation = useNavigation<MobileOtpNavigationProp>();
  const { mobileNumber } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(56);
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
      navigation.navigate("EmailScreen");
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
      setTimer(56);
      setOtp(["", "", "", "", "", ""]);
      setStatusMessage("");
      inputRefs.current[0]?.focus();
    }
  };

  const handleEditMobile = () => {
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logoImage} resizeMode="contain" />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Verify Mobile Number</Text>
          <View style={styles.mobileContainer}>
            <Text style={styles.subtitle}>
              We have sent a 6 digit verification code to{" "}
            </Text>
            <View style={styles.mobileRow}>
              <Text style={styles.mobileText}>{mobileNumber}</Text>
              <TouchableOpacity onPress={handleEditMobile}>
                <Ionicons name="pencil" size={16} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref as TextInput;
                }}
                style={[styles.otpInput, digit && styles.otpInputFilled]}
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
              style={[
                styles.statusMessage,
                { color: statusMessage.includes("Matched") ? "green" : "red" },
              ]}
            >
              {statusMessage}
            </Text>
          ) : null}

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive code? </Text>
            <TouchableOpacity onPress={handleResendOtp} disabled={timer > 0}>
              <Text
                style={[styles.resendLink, timer > 0 && styles.disabledLink]}
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
              <Text style={styles.linkText}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}> and </Text>
            <TouchableOpacity onPress={handlePrivacyPress}>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>.</Text>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  logoImage: {
    width: 180,
    height: 180,
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
    color: "#000",
    textAlign: "center",
  },
  mobileContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  mobileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  mobileText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
    color: "#000",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    width: 44,
    height: 52,
    marginHorizontal: 6,
    fontSize: 18,
    fontWeight: "600",
    backgroundColor: "#FAFAFA",
  },
  otpInputFilled: {
    borderColor: "#007AFF",
    backgroundColor: "#fff",
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
    color: "#666",
  },
  resendLink: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  disabledLink: {
    color: "#aaa",
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
    color: "#666",
    lineHeight: 18,
  },
  linkText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600",
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: "#007AFF",
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

export default MobileOtp;
