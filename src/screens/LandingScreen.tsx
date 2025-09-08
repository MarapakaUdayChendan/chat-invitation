import { useNavigation } from "expo-router";
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LoginScreen from "./LoginScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../navigation/RootStackNavigation";

type NavigationProp = NativeStackNavigationProp<RootStack, "LandingScreen">;

const LandingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.centerContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Choose your authentication method</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#14d565ff" }]}
            onPress={() => navigation.navigate("LoginScreen")}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "blue" }]}
            onPress={() => navigation.navigate("SignUpScreen")}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    width: "85%",
    maxWidth: 350,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
    width: "100%",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#636e72",
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});
