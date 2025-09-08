import { useNavigation } from "expo-router";
import { Button, StatusBar, StyleSheet, Text, View } from "react-native";
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
          <Button
            title="Login"
            onPress={() => navigation.navigate("LoginScreen")}
            color="#14d565ff"
          />
          <Button
            title="SignUp"
            onPress={() => navigation.navigate("SignUpScreen")}
            color="blue"
          />
          {/* <MyButton
            fullWidth={true}
            title="Admin Login"
            onPress={() => navigation.navigate("AdminLogin")}
            color="#14a86cff"
            style={styles.button}
          />
          <MyButton
            fullWidth={true}
            title="User Login"
            onPress={() => navigation.navigate("Login")}
            color="#14d565ff"
            style={styles.button}
          />
          <MyButton
            fullWidth={true}
            title="User Signup"
            onPress={() => navigation.navigate("SignUp")}
            color="#2e25c8ff"
            style={styles.button}
          /> */}
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
  button: {
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});
