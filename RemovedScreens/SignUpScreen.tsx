import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONT, INPUT } from "../styles/theme";

interface User {
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
}

const SignUpScreen: React.FC = () => {
  const [user, setUser] = useState<User>({
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    mobileNumber?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation<any>();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
  const validateMobile = (mobile: string) => /^\d{10}$/.test(mobile);

  const handleChange = (field: keyof User, value: string) => {
    setUser({ ...user, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleSignup = () => {
    let valid = true;
    let newErrors: typeof errors = {};

    if (!user.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!validateEmail(user.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    if (!user.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
      valid = false;
    } else if (!validateMobile(user.mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
      valid = false;
    }

    if (!user.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!validatePassword(user.password)) {
      newErrors.password =
        "Password must be at least 6 characters with uppercase, lowercase, and number";
      valid = false;
    }

    if (!user.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      navigation.navigate("SignUpConfirmation");
      console.log("Signup Success", user);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View style={styles.card}>
          <Text style={styles.heading}>Create an account</Text>

          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={COLORS.placeholder}
            keyboardType="email-address"
            value={user.email}
            onChangeText={(text) => handleChange("email", text)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor={COLORS.placeholder}
            keyboardType="phone-pad"
            value={user.mobileNumber}
            onChangeText={(text) => handleChange("mobileNumber", text)}
          />
          {errors.mobileNumber && (
            <Text style={styles.errorText}>{errors.mobileNumber}</Text>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.pwdInput, { flex: 1, marginBottom: 0 }]}
              placeholder="Password"
              placeholderTextColor={COLORS.placeholder}
              secureTextEntry={!showPassword}
              value={user.password}
              onChangeText={(text) => handleChange("password", text)}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
              disabled={!user.password}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={22}
                color={user.password ? COLORS.accent : COLORS.placeholder}
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.pwdInput, { flex: 1, marginBottom: 0 }]}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.placeholder}
              secureTextEntry={!showConfirmPassword}
              value={user.confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={!user.confirmPassword}
            >
              <Ionicons
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={22}
                color={
                  user.confirmPassword ? COLORS.accent : COLORS.placeholder
                }
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.textRow}>
            <Text style={{ color: COLORS.hint, fontFamily: FONT.family }}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={styles.linkText}>SignIn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.background },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    margin: 20,
  },
  heading: {
    fontSize: FONT.size.heading,
    fontWeight: FONT.weight.bold,
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.primary,
    fontFamily: FONT.family,
  },
  input: {
    ...INPUT,
    height: 48,
    fontSize: FONT.size.input,
  },
  pwdInput: {
    ...INPUT,
    height: 48,
    fontSize: FONT.size.input,
    borderRightWidth: 0,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: COLORS.surface,
    height: 48,
  },
  eyeButton: {
    paddingHorizontal: 12,
    height: "100%",
    justifyContent: "center",
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT.size.label,
    marginBottom: 8,
    fontFamily: FONT.family,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 48,
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: FONT.size.button,
    fontWeight: FONT.weight.bold,
    color: COLORS.onPrimary,
    fontFamily: FONT.family,
  },
  textRow: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
  linkText: {
    color: COLORS.accent,
    fontWeight: FONT.weight.bold,
    fontFamily: FONT.family,
  },
});
