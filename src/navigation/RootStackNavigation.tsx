import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, StyleSheet } from "react-native";

import LandingScreen from "../screens/LandingScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SignUpConfirmation from "../screens/SignUpConfirmation";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ForgotPasswordConfirmation from "../screens/ForgotPasswordConfirmation";
import ContactHome from "../screens/ContactHome";
import InviteContacts from "../screens/InviteContacts";

export type SelectedContact = {
  id: string;
  name: string;
};

export type RootStack = {
  LandingScreen: undefined;
  LoginScreen: undefined;
  SignUpScreen: undefined;
  SignUpConfirmation: undefined;
  ForgotPasswordScreen: undefined;
  ForgotPasswordConfirmation: undefined;
  ContactHome: undefined;
  InviteContacts: { selectedContacts: SelectedContact[] };
};

const Stack = createNativeStackNavigator<RootStack>();

const RootStackNavigation: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <NavigationContainer>
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="LandingScreen"
          >
            <Stack.Screen name="LandingScreen" component={LandingScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen
              name="SignUpConfirmation"
              component={SignUpConfirmation}
            />
            <Stack.Screen
              name="ForgotPasswordScreen"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen
              name="ForgotPasswordConfirmation"
              component={ForgotPasswordConfirmation}
            />
            <Stack.Screen name="ContactHome" component={ContactHome} />
            <Stack.Screen name="InviteContacts" component={InviteContacts} />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default RootStackNavigation;
