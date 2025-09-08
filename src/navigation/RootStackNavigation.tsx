import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
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
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LandingScreen"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpConfirmation"
          component={SignUpConfirmation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPasswordConfirmation"
          component={ForgotPasswordConfirmation}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNavigation;
