import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View } from "react-native";
import { RootStack } from "../navigation/RootStackNavigation";

type NavigationProp = NativeStackNavigationProp<RootStack, "LoginScreen">;

const LoginScreen: React.FC = () => {
  return <View></View>;
};

export default LoginScreen;
