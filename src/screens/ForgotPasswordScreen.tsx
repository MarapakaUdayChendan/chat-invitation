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

interface FormData { newPassword: string; confirmPassword: string; }
interface FormErrors { newPassword: string; confirmPassword: string; }

const ForgotPasswordScreen: React.FC = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();

  const [formData, setFormData] = useState<FormData>({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FormErrors>({ newPassword: "", confirmPassword: "" });
  const [focusedField, setFocusedField] = useState<keyof FormData | null>(null);
  const [touched, setTouched] = useState({ newPassword: false, confirmPassword: false });
  const [showPassword, setShowPassword] = useState({ new: false, confirm: false });

  const passwordRegex = useMemo(() => ({
    hasUpperCase: /[A-Z]/, hasNumber: /\d/, minLength: /.{6,}/
  }), []);

  const validatePassword = useCallback((p: string) => {
    if (!p) return "Password is required";
    if (!passwordRegex.minLength.test(p)) return "Password must be at least 6 characters";
    if (!passwordRegex.hasUpperCase.test(p)) return "Password must contain at least one uppercase letter";
    if (!passwordRegex.hasNumber.test(p)) return "Password must contain at least one number";
    return "";
  }, [passwordRegex]);

  const validateConfirmPassword = useCallback((c: string, n: string) => {
    if (!c) return "Please confirm your password";
    if (c !== n) return "Passwords do not match";
    return "";
  }, []);

  const handleInputChange = useCallback((f: keyof FormData, v: string) => {
    setFormData(p => ({ ...p, [f]: v }));
    if (touched[f]) {
      let e = f === "newPassword" ? validatePassword(v) : validateConfirmPassword(v, formData.newPassword);
      setErrors(p => ({ ...p, [f]: e }));
      if (f === "newPassword" && touched.confirmPassword) {
        const ce = validateConfirmPassword(formData.confirmPassword, v);
        setErrors(p => ({ ...p, confirmPassword: ce }));
      }
    }
  }, [touched, formData, validatePassword, validateConfirmPassword]);

  const handleBlur = useCallback((f: keyof FormData) => {
    setFocusedField(null);
    setTouched(p => ({ ...p, [f]: true }));
    const v = formData[f];
    const e = f === "newPassword" ? validatePassword(v) : validateConfirmPassword(v, formData.newPassword);
    setErrors(p => ({ ...p, [f]: e }));
  }, [formData, validatePassword, validateConfirmPassword]);

  const validateForm = useCallback(() => {
    const ne = validatePassword(formData.newPassword);
    const ce = validateConfirmPassword(formData.confirmPassword, formData.newPassword);
    setErrors({ newPassword: ne, confirmPassword: ce });
    setTouched({ newPassword: true, confirmPassword: true });
    return !ne && !ce;
  }, [formData, validatePassword, validateConfirmPassword]);

  const handleSubmit = useCallback(() => {
    if (validateForm()) console.log("Password reset successful:", formData.newPassword);
    navigation.navigate("LoginScreen");
  }, [formData, validateForm]);

  const dismissKeyboard = useCallback(() => { Keyboard.dismiss(); setFocusedField(null); }, []);

  const getInputStyle = useCallback((f: keyof FormData) => [
    styles.input,
    focusedField === f && styles.inputFocused,
    formData[f] && styles.inputFilled,
    errors[f] && touched[f] && styles.inputError,
  ], [focusedField, formData, errors, touched]);

  const isFormValid = useMemo(() =>
    !errors.newPassword && !errors.confirmPassword && formData.newPassword && formData.confirmPassword,
    [errors, formData]
  );

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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Create a new secure password</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChangeText={v => handleInputChange("newPassword", v)}
                  onFocus={() => setFocusedField("newPassword")}
                  onBlur={() => handleBlur("newPassword")}
                  style={[getInputStyle("newPassword"), styles.passwordInput]}
                  secureTextEntry={!showPassword.new}
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(p => ({ ...p, new: !p.new }))}>
                  <Text style={styles.eyeText}>{showPassword.new ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
              </View>
              {formData.newPassword ? (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    {[1, 2, 3, 4].map(l => (
                      <View key={l} style={[
                        styles.strengthSegment,
                        l <= getPasswordStrength.strength && {
                          backgroundColor: getPasswordStrength.strength <= 1 ? "#dc3545" :
                                           getPasswordStrength.strength <= 2 ? "#fd7e14" :
                                           getPasswordStrength.strength <= 3 ? "#ffc107" : "#28a745"
                        }
                      ]}/>
                    ))}
                  </View>
                  <Text style={styles.strengthLabel}>{getPasswordStrength.label}</Text>
                </View>
              ) : null}
              {errors.newPassword && touched.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChangeText={v => handleInputChange("confirmPassword", v)}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                  style={[getInputStyle("confirmPassword"), styles.passwordInput]}
                  secureTextEntry={!showPassword.confirm}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(p => ({ ...p, confirm: !p.confirm }))}>
                  <Text style={styles.eyeText}>{showPassword.confirm ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && touched.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Password must contain:</Text>
              <Text style={[styles.requirementText, passwordRegex.minLength.test(formData.newPassword) && styles.requirementMet]}>• At least 6 characters</Text>
              <Text style={[styles.requirementText, passwordRegex.hasUpperCase.test(formData.newPassword) && styles.requirementMet]}>• One uppercase letter</Text>
              <Text style={[styles.requirementText, passwordRegex.hasNumber.test(formData.newPassword) && styles.requirementMet]}>• One number</Text>
            </View>

            <TouchableOpacity onPress={handleSubmit} style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]} disabled={!isFormValid}>
              <Text style={[styles.submitText, !isFormValid && styles.submitTextDisabled]}>Update Password</Text>
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
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 8, color: "#000" },
  subtitle: { fontSize: 16, textAlign: "center", color: "#666", fontWeight: "400" },
  form: { width: "100%" },
  inputContainer: { marginBottom: 24 },
  inputLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#333" },
  passwordInputWrapper: { position: "relative" },
  input: {
    borderWidth: 1.5, borderColor: "#e0e0e0", borderRadius: 12, padding: 16, fontSize: 16,
    backgroundColor: "#f8f9fa", color: "#000",
    ...Platform.select({ ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }, android: { elevation: 1 } }),
  },
  passwordInput: { paddingRight: 60 },
  inputFocused: { borderColor: "#999", backgroundColor: "#fff", ...Platform.select({ ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 3 } }) },
  inputFilled: { backgroundColor: "#fff", borderColor: "#ccc" },
  inputError: { borderColor: "#dc3545", backgroundColor: "#fff5f5" },
  eyeButton: { position: "absolute", right: 16, top: 16, bottom: 16, justifyContent: "center", paddingHorizontal: 4 },
  eyeText: { fontSize: 14, color: "#666", fontWeight: "500" },
  strengthContainer: { marginTop: 8, flexDirection: "row", alignItems: "center" },
  strengthBar: { flexDirection: "row", flex: 1, height: 4, backgroundColor: "#e0e0e0", borderRadius: 2, marginRight: 12 },
  strengthSegment: { flex: 1, height: "100%", backgroundColor: "#e0e0e0", marginRight: 2, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: "500", color: "#666", minWidth: 40 },
  requirementsContainer: { backgroundColor: "#f8f9fa", borderRadius: 8, padding: 16, marginBottom: 24 },
  requirementsTitle: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  requirementText: { fontSize: 13, color: "#666", marginBottom: 4 },
  requirementMet: { color: "#28a745", fontWeight: "500" },
  errorText: { fontSize: 12, color: "#dc3545", marginTop: 6, marginLeft: 4, fontWeight: "500" },
  submitButton: { backgroundColor: "#000", borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: 8, ...Platform.select({ ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 }, android: { elevation: 4 } }) },
  submitButtonDisabled: { backgroundColor: "#ccc", ...Platform.select({ ios: { shadowOpacity: 0.05 }, android: { elevation: 1 } }) },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600", letterSpacing: 0.5 },
  submitTextDisabled: { color: "#888" },
});

export default ForgotPasswordScreen;
