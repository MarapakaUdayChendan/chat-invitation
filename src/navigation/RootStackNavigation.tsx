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
import OrganizationSelection from "../screens/OrganizationSelection";
import InviteUsers from "../screens/InviteUsers";
import MobileScreen from "../screens/invite_screens/MobileScreen";
import MobileOtp from "../screens/invite_screens/MobileOtp";
import EmailScreen from "../screens/invite_screens/EmailScreen";
import EmailOtp from "../screens/invite_screens/EmailOtp";
import PasswordScreen from "../screens/invite_screens/PasswordScreen";

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
  OrganizationSelection: undefined;
  InviteUsers: undefined;
  MobileScreen: undefined;
  MobileOtp: undefined;
  EmailScreen: undefined;
  EmailOtp: undefined;
  PasswordScreen: undefined;
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
            <Stack.Screen
              name="OrganizationSelection"
              component={OrganizationSelection}
            />
            <Stack.Screen name="InviteUsers" component={InviteUsers} />
            <Stack.Screen name="MobileScreen" component={MobileScreen} />
            <Stack.Screen name="MobileOtp" component={MobileOtp} />
            <Stack.Screen name="EmailScreen" component={EmailScreen} />
            <Stack.Screen name="EmailOtp" component={EmailOtp} />
            <Stack.Screen name="PasswordScreen" component={PasswordScreen} />
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
