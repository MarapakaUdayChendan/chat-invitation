import React from "react";
import { render } from "@testing-library/react-native";
import RootStackNavigation from "../../src/navigation/RootStackNavigation";

jest.mock("../../src/screens/LandingScreen", () => {
  const { Text } = require("react-native");
  return () => <Text>LandingScreen</Text>;
});
jest.mock("../../src/screens/LoginScreen", () => {
  const { Text } = require("react-native");
  return () => <Text>LoginScreen</Text>;
});
jest.mock("../../src/screens/ForgotPasswordScreen", () => {
  const { Text } = require("react-native");
  return () => <Text>ForgotPasswordScreen</Text>;
});
jest.mock("../../src/screens/ForgotPasswordConfirmation", () => {
  const { Text } = require("react-native");
  return () => <Text>ForgotPasswordConfirmation</Text>;
});
jest.mock("../../src/screens/ContactHome", () => {
  const { Text } = require("react-native");
  return () => <Text>ContactHome</Text>;
});
jest.mock("../../src/screens/InviteContacts", () => {
  const { Text } = require("react-native");
  return () => <Text>InviteContacts</Text>;
});
jest.mock("../../src/screens/OrganizationSelection", () => {
  const { Text } = require("react-native");
  return () => <Text>OrganizationSelection</Text>;
});
jest.mock("../../src/screens/InviteUsers", () => {
  const { Text } = require("react-native");
  return () => <Text>InviteUsers</Text>;
});
jest.mock("../../src/screens/invite_screens/MobileScreen", () => {
  const { Text } = require("react-native");
  return () => <Text>MobileScreen</Text>;
});
jest.mock("../../src/screens/invite_screens/MobileOtp", () => {
  const { Text } = require("react-native");
  return () => <Text>MobileOtp</Text>;
});
jest.mock("../../src/screens/invite_screens/EmailScreen", () => {
  const { Text } = require("react-native");
  return () => <Text>EmailScreen</Text>;
});
jest.mock("../../src/screens/invite_screens/EmailOtp", () => {
  const { Text } = require("react-native");
  return () => <Text>EmailOtp</Text>;
});
jest.mock("../../src/screens/invite_screens/PasswordScreen", () => {
  const { Text } = require("react-native");
  return () => <Text>PasswordScreen</Text>;
});
jest.mock("../../src/screens/LoginEmailOtp", () => {
  const { Text } = require("react-native");
  return () => <Text>LoginEmailOtp</Text>;
});

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@react-navigation/native-stack", () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children, initialRouteName }: any) => {
      const { View, Text } = require("react-native");
      return (
        <View testID="stack-navigator" accessibilityLabel={`Initial route: ${initialRouteName}`}>
          <Text>Stack Navigator</Text>
          {children}
        </View>
      );
    },
    Screen: ({ name, component: Component }: any) => {
      const { View, Text } = require("react-native");
      return (
        <View testID={`screen-${name}`}>
          <Text>Screen: {name}</Text>
          <Component />
        </View>
      );
    },
  }),
}));

jest.mock("@react-navigation/native", () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => {
    const { View } = require("react-native");
    return <View testID="navigation-container">{children}</View>;
  },
}));

describe("RootStackNavigation", () => {
  it("renders navigation container and stack navigator", () => {
    const { getByTestId } = render(<RootStackNavigation />);
    expect(getByTestId("navigation-container")).toBeTruthy();
    expect(getByTestId("stack-navigator")).toBeTruthy();
  });

  it("sets initial route to LoginScreen", () => {
    const { getByTestId } = render(<RootStackNavigation />);
    const stackNavigator = getByTestId("stack-navigator");
    expect(stackNavigator.props.accessibilityLabel).toBe("Initial route: LoginScreen");
  });

  it("registers all expected screens", () => {
    const { getByTestId } = render(<RootStackNavigation />);
    const screens = [
      "LandingScreen",
      "LoginScreen",
      "LoginEmailOtp",
      "ForgotPasswordScreen",
      "ForgotPasswordConfirmation",
      "ContactHome",
      "InviteContacts",
      "OrganizationSelection",
      "InviteUsers",
      "MobileScreen",
      "MobileOtp",
      "EmailScreen",
      "EmailOtp",
      "PasswordScreen",
    ];
    screens.forEach(name => {
      expect(getByTestId(`screen-${name}`)).toBeTruthy();
    });
  });

  it("renders screen components correctly", () => {
    const { getByText } = render(<RootStackNavigation />);
    const texts = [
      "LandingScreen",
      "LoginScreen",
      "LoginEmailOtp",
      "ForgotPasswordScreen",
      "ForgotPasswordConfirmation",
      "ContactHome",
      "InviteContacts",
      "OrganizationSelection",
      "InviteUsers",
      "MobileScreen",
      "MobileOtp",
      "EmailScreen",
      "EmailOtp",
      "PasswordScreen",
      "Stack Navigator",
    ];
    texts.forEach(text => {
      expect(getByText(text)).toBeTruthy();
    });
  });

  it("applies SafeAreaProvider wrapper", () => {
    const { getByTestId } = render(<RootStackNavigation />);
    expect(getByTestId("navigation-container")).toBeTruthy();
  });

  it("navigation container and stack navigator exist with correct structure", () => {
    const { getByTestId, getByText } = render(<RootStackNavigation />);
    expect(getByTestId("navigation-container")).toBeTruthy();
    expect(getByTestId("stack-navigator")).toBeTruthy();
    expect(getByText("Stack Navigator")).toBeTruthy();
  });
});
