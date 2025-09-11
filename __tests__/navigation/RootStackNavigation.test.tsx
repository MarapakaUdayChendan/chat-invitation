import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootStackNavigation from "../../src/navigation/RootStackNavigation";

// Mock all the screen components
jest.mock("../../src/screens/LandingScreen", () => {
  const { Text } = require("react-native");
  return function LandingScreen() {
    return <Text>LandingScreen</Text>;
  };
});

jest.mock("../../src/screens/LoginScreen", () => {
  const { Text } = require("react-native");
  return function LoginScreen() {
    return <Text>LoginScreen</Text>;
  };
});

jest.mock("../../src/screens/ForgotPasswordScreen", () => {
  const { Text } = require("react-native");
  return function ForgotPasswordScreen() {
    return <Text>ForgotPasswordScreen</Text>;
  };
});

jest.mock("../../src/screens/ForgotPasswordConfirmation", () => {
  const { Text } = require("react-native");
  return function ForgotPasswordConfirmation() {
    return <Text>ForgotPasswordConfirmation</Text>;
  };
});

jest.mock("../../src/screens/ContactHome", () => {
  const { Text } = require("react-native");
  return function ContactHome() {
    return <Text>ContactHome</Text>;
  };
});

jest.mock("../../src/screens/InviteContacts", () => {
  const { Text } = require("react-native");
  return function InviteContacts() {
    return <Text>InviteContacts</Text>;
  };
});

jest.mock("../../src/screens/OrganizationSelection", () => {
  const { Text } = require("react-native");
  return function OrganizationSelection() {
    return <Text>OrganizationSelection</Text>;
  };
});

jest.mock("../../src/screens/InviteUsers", () => {
  const { Text } = require("react-native");
  return function InviteUsers() {
    return <Text>InviteUsers</Text>;
  };
});

jest.mock("../../src/screens/invite_screens/MobileScreen", () => {
  const { Text } = require("react-native");
  return function MobileScreen() {
    return <Text>MobileScreen</Text>;
  };
});

jest.mock("../../src/screens/invite_screens/MobileOtp", () => {
  const { Text } = require("react-native");
  return function MobileOtp() {
    return <Text>MobileOtp</Text>;
  };
});

jest.mock("../../src/screens/invite_screens/EmailScreen", () => {
  const { Text } = require("react-native");
  return function EmailScreen() {
    return <Text>EmailScreen</Text>;
  };
});

jest.mock("../../src/screens/invite_screens/EmailOtp", () => {
  const { Text } = require("react-native");
  return function EmailOtp() {
    return <Text>EmailOtp</Text>;
  };
});

jest.mock("../../src/screens/invite_screens/PasswordScreen", () => {
  const { Text } = require("react-native");
  return function PasswordScreen() {
    return <Text>PasswordScreen</Text>;
  };
});

jest.mock("../../src/screens/LoginEmailOtp", () => {
  const { Text } = require("react-native");
  return function LoginEmailOtp() {
    return <Text>LoginEmailOtp</Text>;
  };
});

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock @react-navigation/native-stack
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

// Mock @react-navigation/native
jest.mock("@react-navigation/native", () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => {
    const { View } = require("react-native");
    return (
      <View testID="navigation-container">
        {children}
      </View>
    );
  },
}));

describe("RootStackNavigation Component", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<RootStackNavigation />);
    
    expect(getByTestId("navigation-container")).toBeTruthy();
    expect(getByTestId("stack-navigator")).toBeTruthy();
  });

  it("configures NavigationContainer correctly", () => {
    const { getByTestId } = render(<RootStackNavigation />);
    
    const navigationContainer = getByTestId("navigation-container");
    expect(navigationContainer).toBeTruthy();
  });

  it("sets up Stack Navigator with correct initial route", () => {
    const { getByTestId } = render(<RootStackNavigation />);
    
    const stackNavigator = getByTestId("stack-navigator");
    expect(stackNavigator).toBeTruthy();
    expect(stackNavigator.props.accessibilityLabel).toBe("Initial route: LoginScreen");
  });

  it("registers all required screens", () => {
    const { getByTestId } = render(<RootStackNavigation />);
    
    // Check that all screens are registered
    const expectedScreens = [
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
      "PasswordScreen"
    ];

    expectedScreens.forEach(screenName => {
      expect(getByTestId(`screen-${screenName}`)).toBeTruthy();
    });
  });

  it("renders screen components correctly", () => {
    const { getByText } = render(<RootStackNavigation />);
    
    // Check that screen components are rendered
    expect(getByText("LandingScreen")).toBeTruthy();
    expect(getByText("LoginScreen")).toBeTruthy();
    expect(getByText("LoginEmailOtp")).toBeTruthy();
    expect(getByText("ForgotPasswordScreen")).toBeTruthy();
    expect(getByText("ForgotPasswordConfirmation")).toBeTruthy();
    expect(getByText("ContactHome")).toBeTruthy();
    expect(getByText("InviteContacts")).toBeTruthy();
    expect(getByText("OrganizationSelection")).toBeTruthy();
    expect(getByText("InviteUsers")).toBeTruthy();
    expect(getByText("MobileScreen")).toBeTruthy();
    expect(getByText("MobileOtp")).toBeTruthy();
    expect(getByText("EmailScreen")).toBeTruthy();
    expect(getByText("EmailOtp")).toBeTruthy();
    expect(getByText("PasswordScreen")).toBeTruthy();
  });

  it("has correct navigation structure", () => {
    const { getByTestId, getByText } = render(<RootStackNavigation />);
    
    // Verify the overall structure
    expect(getByTestId("navigation-container")).toBeTruthy();
    expect(getByTestId("stack-navigator")).toBeTruthy();
    expect(getByText("Stack Navigator")).toBeTruthy();
  });

  it("applies SafeAreaProvider wrapper correctly", () => {
    // Since we mocked SafeAreaProvider to pass children through,
    // we can verify the navigation structure is intact
    const { getByTestId } = render(<RootStackNavigation />);
    
    expect(getByTestId("navigation-container")).toBeTruthy();
  });

  it("configures stack navigator options correctly", () => {
    const { getByTestId } = render(<RootStackNavigation />);
    
    const stackNavigator = getByTestId("stack-navigator");
    expect(stackNavigator).toBeTruthy();
    
    // Verify initial route is set
    expect(stackNavigator.props.accessibilityLabel).toContain("LoginScreen");
  });

  it("includes all invite flow screens", () => {
    const { getByTestId } = render(<RootStackNavigation />);
    
    const inviteScreens = [
      "MobileScreen",
      "MobileOtp", 
      "EmailScreen",
      "EmailOtp",
      "PasswordScreen"
    ];

    inviteScreens.forEach(screenName => {
      expect(getByTestId(`screen-${screenName}`)).toBeTruthy();
    });
  });

  it("includes all authentication screens", () => {
    const { getByTestId } = render(<RootStackNavigation />);
    
    const authScreens = [
      "LoginScreen",
      "LoginEmailOtp",
      "ForgotPasswordScreen",
      "ForgotPasswordConfirmation"
    ];

    authScreens.forEach(screenName => {
      expect(getByTestId(`screen-${screenName}`)).toBeTruthy();
    });
  });

  it("includes all contact management screens", () => {
    const { getByTestId } = render(<RootStackNavigation />);
    
    const contactScreens = [
      "ContactHome",
      "InviteContacts",
      "OrganizationSelection",
      "InviteUsers"
    ];

    contactScreens.forEach(screenName => {
      expect(getByTestId(`screen-${screenName}`)).toBeTruthy();
    });
  });

  it("component structure matches expected hierarchy", () => {
    const { getByTestId } = render(<RootStackNavigation />);
    
    // Verify nested structure exists
    const navigationContainer = getByTestId("navigation-container");
    const stackNavigator = getByTestId("stack-navigator");
    
    expect(navigationContainer).toBeTruthy();
    expect(stackNavigator).toBeTruthy();
  });
});
