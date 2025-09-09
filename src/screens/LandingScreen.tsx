import React from "react";
import { useNavigation } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONT } from "../styles/theme";

const LandingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Choose your authentication method</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("LoginScreen")}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.accent }]}
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
    backgroundColor: COLORS.background,
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
    fontSize: FONT.size.heading,
    fontWeight: FONT.weight.bold,
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: FONT.family,
  },
  subtitle: {
    fontSize: FONT.size.subheading,
    color: COLORS.accent,
    textAlign: "center",
    lineHeight: 22,
    fontFamily: FONT.family,
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
    marginTop: 20,
  },
  buttonText: {
    fontSize: FONT.size.button,
    fontWeight: FONT.weight.bold,
    color: COLORS.onPrimary,
    fontFamily: FONT.family,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
    shadowColor: COLORS.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
});
