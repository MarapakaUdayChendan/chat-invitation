import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../navigation/RootStackNavigation";

const logo = require("../../../assets/logo/logo1.png");

type EmailScreenNavigationProp = NativeStackNavigationProp<
  RootStack,
  "EmailScreen"
>;

export default function EmailScreen() {
  const [email, setEmail] = useState("");
  const navigation = useNavigation<EmailScreenNavigationProp>();

  const handleVerifyOTP = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    navigation.navigate("EmailOtp", { email: email });
  };

  const handleTermsPress = () => console.log("Terms of Service pressed");
  const handlePrivacyPress = () => console.log("Privacy Policy pressed");
  const handleGoBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter Your E-Mail</Text>
        <Text style={styles.subtitle}>
          We will Send you a OTP in the below E-Mail
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.textInput}
            placeholder="name@example.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
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

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
          <Text style={styles.verifyButtonText}>Verify OTP</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    marginRight: 35,
  },
  logo: {
    borderRadius: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
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
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  bottomSection: {
    paddingBottom: 30,
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
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
