import React, { useState, useCallback, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStack } from "../navigation/RootStackNavigation";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

interface FormData {
  email: string;
  password: string;
}

const Email: React.FC = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();

  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormData>({ email: "", password: "" });
  const [focusedField, setFocusedField] = useState<keyof FormData | null>(null);
  const [touched, setTouched] = useState<FormData>({ email: "", password: "" });

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const validateEmail = useCallback(
    (email: string) =>
      !email.trim()
        ? "Email is required"
        : !emailRegex.test(email.trim())
        ? "Please enter a valid email address"
        : "",
    [emailRegex]
  );

  const validatePassword = useCallback(
    (password: string) =>
      !password
        ? "Password is required"
        : password.length < 6
        ? "Password must be at least 6 characters"
        : "",
    []
  );

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = field === "email" ? validateEmail(value) : validatePassword(value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleFocus = (field: keyof FormData) => setFocusedField(field);

  const handleBlur = (field: keyof FormData) => {
    setFocusedField(null);
    setTouched((prev) => ({ ...prev, [field]: "true" as any }));
    const value = formData[field];
    const error = field === "email" ? validateEmail(value) : validatePassword(value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: "true" as any, password: "true" as any });
    return !emailError && !passwordError;
  };

  const handleLogin = () => {
    if (validateForm()) {
      console.log("Login successful:", formData);
      navigation.navigate("ContactHome");
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setFocusedField(null);
  };

  const handleForgot= ()=>{
    navigation.navigate("ForgotPasswordScreen");
  }

  const getInputStyle = (field: keyof FormData) => [
    styles.input,
    focusedField === field && styles.inputFocused,
    formData[field] && styles.inputFilled,
    errors[field] && touched[field] && styles.inputError,
  ];

  const isFormValid =
    !errors.email && !errors.password && formData.email && formData.password;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(v) => handleInputChange("email", v)}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                style={getInputStyle("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
              {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                placeholder="Enter your password"
                value={formData.password}
                secureTextEntry
                onChangeText={(v) => handleInputChange("password", v)}
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password")}
                style={getInputStyle("password")}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              style={[styles.loginButton, !isFormValid && styles.loginButtonDisabled]}
              activeOpacity={0.8}
              disabled={!isFormValid}
            >
              <Text style={[styles.loginText, !isFormValid && styles.loginTextDisabled]}>
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotWrapper} activeOpacity={0.7} onPress={handleForgot}>
              <Text style={styles.forgotText}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flexGrow: 1, padding: 24, justifyContent: "center", minHeight: "100%" },
  header: { alignItems: "center", marginBottom: 40 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8, color: "#000" },
  subtitle: { fontSize: 16, color: "#666", fontWeight: "400" },
  form: { width: "100%" },
  inputContainer: { marginBottom: 24 },
  inputLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#333" },
  input: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    color: "#000",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
      android: { elevation: 1 },
    }),
  },
  inputFocused: {
    borderColor: "#999",
    backgroundColor: "#fff",
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  inputFilled: { backgroundColor: "#fff", borderColor: "#ccc" },
  inputError: { borderColor: "#dc3545", backgroundColor: "#fff5f5" },
  errorText: { fontSize: 12, color: "#dc3545", marginTop: 6, fontWeight: "500" },
  loginButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },
  loginButtonDisabled: { backgroundColor: "#ccc" },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "600", letterSpacing: 0.5 },
  loginTextDisabled: { color: "#888" },
  forgotWrapper: { alignItems: "center", paddingVertical: 8 },
  forgotText: { fontSize: 14, color: "#666", fontWeight: "500", textDecorationLine: "underline" },
});

export default Email;
