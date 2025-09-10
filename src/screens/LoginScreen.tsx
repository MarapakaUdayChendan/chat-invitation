import React, { useState, useCallback, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  Alert,
} from "react-native";
import { COLORS, FONT, INPUT } from "../styles/theme";

interface FormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ [K in keyof FormData]?: boolean }>(
    {}
  );

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
      const error =
        field === "email" ? validateEmail(value) : validatePassword(value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleFocus = (field: keyof FormData) => setFocusedField(field);
  const handleBlur = (field: keyof FormData) => {
    setFocusedField(null);
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = formData[field];
    const error =
      field === "email" ? validateEmail(value) : validatePassword(value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });
    return !emailError && !passwordError;
  };

  const handleLogin = () => {
    if (validateForm()) {
      console.log("Login success:", formData);
      navigation.navigate("ContactHome");
    }
  };

  const handleLoginWithOTP = () => {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ email: emailError, password: "" });
      setTouched({ email: true, password: false });
      return;
    }

    navigation.navigate("LoginEmailOtp", {
      email: formData.email,
    });
  };

  const handleForgot = () => {
    navigation.navigate("ForgotPasswordConfirmation");
  };

  const getInputStyle = (field: keyof FormData) => [
    styles.input,
    focusedField === field && styles.inputFocused,
    errors[field] && touched[field] && styles.inputError,
  ];

  const isFormValid =
    !errors.email && !errors.password && formData.email && formData.password;

  const isEmailValid = !errors.email && formData.email;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <TextInput
        placeholder="Email Address"
        placeholderTextColor={COLORS.placeholder}
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

      <TextInput
        placeholder="Password"
        placeholderTextColor={COLORS.placeholder}
        value={formData.password}
        onChangeText={(v) => handleInputChange("password", v)}
        onFocus={() => handleFocus("password")}
        onBlur={() => handleBlur("password")}
        style={getInputStyle("password")}
        autoCapitalize="none"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />
      {errors.password && touched.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <View style={styles.forgotContainer}>
        <TouchableOpacity onPress={handleForgot}>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, !isFormValid && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={!isFormValid}
      >
        <Text style={styles.loginText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.otpButton, !isEmailValid && styles.buttonDisabled]}
        onPress={handleLoginWithOTP}
        disabled={!isEmailValid}
      >
        <Text style={styles.otpText}>Login using OTP</Text>
      </TouchableOpacity>

      <View style={styles.privacyContainer}>
        <Text style={styles.privacyText}>
          By clicking continue, you agree to our{" "}
          <Text style={styles.privacyLink}>Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    shadowColor: COLORS.background,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    justifyContent: "center",
  },
  header: { alignItems: "center", marginBottom: 28 },
  title: {
    fontSize: FONT.size.heading,
    fontWeight: FONT.weight.bold,
    marginBottom: 6,
    color: "black",
    textAlign: "center",
    fontFamily: FONT.family,
  },
  subtitle: {
    fontSize: FONT.size.subheading,
    color: "#000000",
    fontWeight: FONT.weight.medium,
    fontFamily: FONT.family,
    textAlign: "center",
  },
  input: {
    ...INPUT,
    marginBottom: 12,
  },
  inputFocused: { borderColor: COLORS.accent },
  inputError: { borderColor: COLORS.error },
  errorText: {
    fontSize: FONT.size.label,
    color: COLORS.error,
    marginTop: -6,
    marginBottom: 10,
    fontWeight: FONT.weight.medium,
    fontFamily: FONT.family,
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginTop: -8,
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: FONT.weight.bold,
    textDecorationLine: "underline",
    fontFamily: FONT.family,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  otpButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginText: {
    color: COLORS.onPrimary,
    fontSize: FONT.size.button,
    fontWeight: FONT.weight.bold,
    fontFamily: FONT.family,
    letterSpacing: 0.5,
  },
  otpText: {
    color: COLORS.primary,
    fontSize: FONT.size.button,
    fontWeight: FONT.weight.bold,
    fontFamily: FONT.family,
    letterSpacing: 0.5,
  },
  privacyContainer: {
    alignItems: "center",
  },
  privacyText: {
    fontSize: 12,
    color: COLORS.accent,
    fontFamily: FONT.family,
    textAlign: "center",
  },
  privacyLink: {
    color: COLORS.primary,
    fontWeight: FONT.weight.bold,
    textDecorationLine: "underline",
  },
});
