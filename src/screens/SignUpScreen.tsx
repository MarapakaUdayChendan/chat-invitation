import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStack } from "../navigation/RootStackNavigation";
import { useNavigation } from "expo-router";
import { useState } from "react";

type NavigationProp = NativeStackNavigationProp<RootStack, "SignUpScreen">;

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

  const navigation = useNavigation<NavigationProp>();

  const handleChange = (field: keyof User, value: string) => {
    setUser({ ...user, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  const validateMobile = (mobile: string) => /^\d{10}$/.test(mobile);

  const handleLogin = () => {
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
      console.log("Signup Successful ✅", user);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "android" ? undefined : "padding"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}>Create an account</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter email"
            value={user.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={user.mobileNumber}
            onChangeText={(text) => handleChange("mobileNumber", text)}
            keyboardType="phone-pad"
          />
          {errors.mobileNumber && (
            <Text style={styles.errorText}>{errors.mobileNumber}</Text>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Enter password"
              value={user.password}
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Text style={{ color: "#0066cc" }}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Confirm password"
              value={user.confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeButton}
            >
              <Text style={{ color: "#0066cc" }}>
                {showConfirmPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#0066cc" }]}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.textRow}>
            <Text>Already have an account? </Text>
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
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
    height: 48,
  },
  eyeButton: {
    paddingHorizontal: 12,
    height: "100%",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  buttonWrapper: {
    marginTop: 10,
    marginBottom: 15,
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  linkText: {
    color: "green",
    fontWeight: "500",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    height: 48,
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});
