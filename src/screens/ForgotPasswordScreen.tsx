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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { COLORS, FONT, INPUT } from "../styles/theme";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}
interface FormErrors {
  newPassword: string;
  confirmPassword: string;
}

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();

  const [formData, setFormData] = useState<FormData>({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    newPassword: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const passwordRegex = useMemo(
    () => ({
      hasUpperCase: /[A-Z]/,
      hasNumber: /\d/,
      minLength: /.{6,}/,
    }),
    []
  );

  const validatePassword = useCallback(
    (p: string) => {
      if (!p) return "Password is required";
      if (!passwordRegex.minLength.test(p))
        return "At least 6 characters required";
      if (!passwordRegex.hasUpperCase.test(p))
        return "Must contain 1 uppercase letter";
      if (!passwordRegex.hasNumber.test(p)) return "Must contain 1 number";
      return "";
    },
    [passwordRegex]
  );

  const validateConfirmPassword = useCallback((c: string, n: string) => {
    if (!c) return "Please confirm password";
    if (c !== n) return "Passwords do not match";
    return "";
  }, []);

  const handleInputChange = (f: keyof FormData, v: string) => {
    setFormData((p) => ({ ...p, [f]: v }));
    if (touched[f]) {
      const e =
        f === "newPassword"
          ? validatePassword(v)
          : validateConfirmPassword(v, formData.newPassword);
      setErrors((p) => ({ ...p, [f]: e }));
    }
  };

  const handleBlur = (f: keyof FormData) => {
    setTouched((p) => ({ ...p, [f]: true }));
    const v = formData[f];
    const e =
      f === "newPassword"
        ? validatePassword(v)
        : validateConfirmPassword(v, formData.newPassword);
    setErrors((p) => ({ ...p, [f]: e }));
  };

  const validateForm = () => {
    const ne = validatePassword(formData.newPassword);
    const ce = validateConfirmPassword(
      formData.confirmPassword,
      formData.newPassword
    );
    setErrors({ newPassword: ne, confirmPassword: ce });
    setTouched({ newPassword: true, confirmPassword: true });
    return !ne && !ce;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Password reset successful:", formData.newPassword);
      navigation.navigate("LoginScreen");
    }
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  const isFormValid =
    !errors.newPassword &&
    !errors.confirmPassword &&
    formData.newPassword &&
    formData.confirmPassword;

  const getPasswordStrength = useMemo(() => {
    const p = formData.newPassword;
    if (!p) return { strength: 0, label: "" };
    let s = 0;
    if (passwordRegex.minLength.test(p)) s++;
    if (passwordRegex.hasUpperCase.test(p)) s++;
    if (passwordRegex.hasNumber.test(p)) s++;
    if (p.length >= 8) s++;
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    return { strength: s, label: labels[s] };
  }, [formData.newPassword, passwordRegex]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.heading}>Reset Password</Text>
            <Text style={styles.subheading}>Create a new secure password</Text>

            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor={COLORS.placeholder}
              secureTextEntry={!showPassword.new}
              value={formData.newPassword}
              onChangeText={(v) => handleInputChange("newPassword", v)}
              onBlur={() => handleBlur("newPassword")}
            />
            {errors.newPassword && touched.newPassword && (
              <Text style={styles.error}>{errors.newPassword}</Text>
            )}

            {formData.newPassword ? (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBar}>
                  {[1, 2, 3, 4].map((l) => (
                    <View
                      key={l}
                      style={[
                        styles.strengthSegment,
                        l <= getPasswordStrength.strength && {
                          backgroundColor:
                            getPasswordStrength.strength <= 1
                              ? COLORS.error
                              : getPasswordStrength.strength <= 2
                              ? COLORS.accent
                              : getPasswordStrength.strength <= 3
                              ? "#ffc107"
                              : "#28a745",
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.strengthLabel}>
                  {getPasswordStrength.label}
                </Text>
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.placeholder}
              secureTextEntry={!showPassword.confirm}
              value={formData.confirmPassword}
              onChangeText={(v) => handleInputChange("confirmPassword", v)}
              onBlur={() => handleBlur("confirmPassword")}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity
              style={[styles.submitButton, !isFormValid && styles.disabled]}
              onPress={handleSubmit}
              disabled={!isFormValid}
            >
              <Text style={styles.buttonText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 370,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    alignSelf: "center",
    elevation: 4,
  },
  heading: {
    fontSize: FONT.size.heading,
    fontWeight: FONT.weight.bold,
    textAlign: "center",
    marginBottom: 8,
    color: COLORS.primary,
  },
  subheading: {
    fontSize: FONT.size.subheading,
    textAlign: "center",
    color: COLORS.secondaryText,
    marginBottom: 24,
  },
  input: {
    ...INPUT,
    width: "100%",
    textAlign: "center",
  },
  error: {
    color: COLORS.error,
    fontSize: FONT.size.label,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: FONT.weight.medium,
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  strengthBar: {
    flex: 1,
    height: 6,
    flexDirection: "row",
    backgroundColor: "#ddd",
    borderRadius: 3,
    marginRight: 10,
  },
  strengthSegment: {
    flex: 1,
    marginHorizontal: 1,
    borderRadius: 2,
    backgroundColor: "#eee",
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: FONT.weight.medium,
    color: COLORS.onSurface,
  },
  submitButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  disabled: {
    backgroundColor: COLORS.secondaryText,
  },
  buttonText: {
    color: COLORS.onPrimary,
    fontSize: FONT.size.button,
    fontWeight: FONT.weight.bold,
    textAlign: "center",
  },
});
