import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
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
  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleVerifyOTP = () => {
    if (!mobileNumber) {
      Alert.alert("Error", "Please enter your mobile number");
      return;
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobileNumber)) {
      Alert.alert("Error", "Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const otp = generateOTP();
      const fullNumber = countryCode + mobileNumber;

      console.log("OTP generated:", otp);
      console.log("Sending to:", fullNumber);

      setIsLoading(false);

      Alert.alert(
        "OTP Generated",
        `your OTP is: ${otp}\n\nYou can pass this to your MobileOTP screen.`,
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("MobileOtp");
              /*
             {
                otp: otp,
                mobileNumber: fullNumber,
              }
             */
            },
          },
        ]
      );
    }, 1500);
  };

  const handleTermsPress = () => {
    console.log("Terms of Service pressed");
  };

  const handlePrivacyPress = () => {
    console.log("Privacy Policy pressed");
  };

  const handleGoBack = () => {
    console.log("Go back pressed");
  };

  const handleCountryCodeChange = () => {
    Alert.alert("Info", "Country code selector would open here");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/logo/logo.jpg")}
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
              style={styles.countryCodeButton}
              onPress={handleCountryCodeChange}
            >
              <Text style={styles.countryCodeText}>{countryCode}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
            <TextInput
              style={styles.phoneInput}
              placeholder="1234567890"
              placeholderTextColor="#999"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={10}
            />
          </View>
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
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            isLoading && styles.verifyButtonDisabled,
          ]}
          onPress={handleVerifyOTP}
          disabled={isLoading}
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
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
