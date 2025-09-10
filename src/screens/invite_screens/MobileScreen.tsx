import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../navigation/RootStackNavigation";

export default function MobileScreen() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();

  const handleVerifyOTP = () => {
    setError("");

    const cleanedNumber = mobileNumber.replace(/\D/g, "");

    if (!cleanedNumber) {
      setError("Please enter your mobile number");
      return;
    }

    if (cleanedNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(cleanedNumber)) {
      setError("Please enter a valid mobile number starting with 6-9");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const fullNumber = countryCode + cleanedNumber;
      console.log("Navigating to OTP screen with:", fullNumber);

      setIsLoading(false);
      navigation.navigate("MobileOtp", { mobileNumber: fullNumber });
    }, 1000);
  };

  const handleMobileNumberChange = (text: string) => {
    const cleanedText = text.replace(/\D/g, "");
    setMobileNumber(cleanedText);

    if (error) {
      setError("");
    }
  };

  const handleTermsPress = () => {
    console.log("Terms of Service pressed");
  };

  const handlePrivacyPress = () => {
    console.log("Privacy Policy pressed");
  };

  const handleCountryCodeChange = () => {
    console.log("Country code selector would open here");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/logo/logo1.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter Your Mobile Number</Text>
        <Text style={styles.subtitle}>
          We will send you an OTP to the below mobile number
        </Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <View style={styles.phoneInputContainer}>
            <TouchableOpacity
              style={[
                styles.countryCodeButton,
                error ? styles.countryCodeError : null,
              ]}
              onPress={handleCountryCodeChange}
            >
              <Text style={styles.countryCodeText}>{countryCode}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
            <TextInput
              style={[styles.phoneInput, error ? styles.inputError : null]}
              placeholder="1234567890"
              placeholderTextColor="#999"
              value={mobileNumber}
              onChangeText={handleMobileNumberChange}
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={10}
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
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

        <TouchableOpacity
          style={[
            styles.verifyButton,
            (isLoading || !mobileNumber) && styles.verifyButtonDisabled,
          ]}
          onPress={handleVerifyOTP}
          disabled={isLoading || !mobileNumber}
        >
          {isLoading ? (
            <Text style={styles.verifyButtonText}>Sending OTP...</Text>
          ) : (
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  logoImage: {
    width: 180,
    height: 180,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  countryCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#FAFAFA",
  },
  countryCodeError: {
    borderColor: "#FF3B30",
  },
  countryCodeText: {
    fontSize: 16,
    color: "#000",
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 8,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  bottomSection: {
    paddingBottom: 30,
    width: "100%",
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
    lineHeight: 18,
  },
  verifyButton: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  verifyButtonDisabled: {
    backgroundColor: "#66A3FF",
    opacity: 0.7,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
