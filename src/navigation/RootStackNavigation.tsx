import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LandingScreen from "../screens/LandingScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SignUpConfirmation from "../screens/SignUpConfirmation";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ForgotPasswordConfirmation from "../screens/ForgotPasswordConfirmation";

export type RootStack = {
  LandingScreen: undefined;
  LoginScreen: undefined;
  SignUpScreen: undefined;
  SignUpConfirmation: undefined;
  ForgotPasswordScreen: undefined;
  ForgotPasswordConfirmation: undefined;
};

const Stack = createNativeStackNavigator<RootStack>();

const RootStackNavigation: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default RootStackNavigation;
