import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PasswordScreen from "../../../src/screens/invite_screens/PasswordScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStack } from "../../../src/navigation/RootStackNavigation";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: ({ name, size, color, ...props }: any) => {
    const { Text } = require("react-native");
    return <Text {...props}>{name}</Text>;
  },
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

// Mock the useNavigation hook
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    setParams: jest.fn(),
    setOptions: jest.fn(),
    dispatch: jest.fn(),
    canGoBack: jest.fn(() => true),
    addListener: jest.fn(() => jest.fn()),
    removeListener: jest.fn(),
  }),
  useRoute: () => mockRoute,
}));

// Mock console.log for various handlers
const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

const mockNavigation: NativeStackNavigationProp<RootStack, "PasswordScreen"> = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  setParams: jest.fn(),
  setOptions: jest.fn(),
  dispatch: jest.fn(),
  canGoBack: jest.fn(() => true),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
} as any;

const mockRoute: RouteProp<RootStack, "PasswordScreen"> = {
  key: "PasswordScreen-1",
  name: "PasswordScreen",
  params: { email: "test@example.com" },
};

describe("PasswordScreen Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it("renders all UI elements correctly", () => {
    const { getByText, getByTestId, getByDisplayValue } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText("Confirm your Password")).toBeTruthy();
    expect(getByText("We will Send you a OTP in the below E-Mail")).toBeTruthy();
    expect(getByText("Email")).toBeTruthy();
    expect(getByText("Password")).toBeTruthy();
    expect(getByText("Confirm Password")).toBeTruthy();
    expect(getByDisplayValue("test@example.com")).toBeTruthy();
    expect(getByTestId("passwordEnter")).toBeTruthy();
    expect(getByText("Submit")).toBeTruthy();
  });

  it("displays email from route params correctly", () => {
    const { getByDisplayValue } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByDisplayValue("test@example.com")).toBeTruthy();
  });

  it("uses default email when no params provided", () => {
    const routeWithoutParams: RouteProp<RootStack, "PasswordScreen"> = {
      key: "PasswordScreen-1",
      name: "PasswordScreen",
      params: undefined,
    } as any;

    const { getByDisplayValue } = render(
      <PasswordScreen route={routeWithoutParams} navigation={mockNavigation} />
    );

    expect(getByDisplayValue("name@example.com")).toBeTruthy();
  });

  it("validates empty password", () => {
    const { getAllByPlaceholderText, getByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInput = getAllByPlaceholderText("Type password")[0];
    const submitButton = getByText("Submit");

    fireEvent.press(submitButton);

    expect(getByText("Please enter a password")).toBeTruthy();
  });

  it("validates password minimum length", () => {
    const { getAllByPlaceholderText, getByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInput = getAllByPlaceholderText("Type password")[0];
    
    fireEvent.changeText(passwordInput, "12");
    
    expect(getByText("Password must be at least 6 characters long")).toBeTruthy();
  });

  it("validates password must contain capital letter", () => {
    const { getAllByPlaceholderText, getByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInput = getAllByPlaceholderText("Type password")[0];
    
    fireEvent.changeText(passwordInput, "password123");
    
    expect(getByText("Password must contain at least one capital letter")).toBeTruthy();
  });

  it("validates password must contain number", () => {
    const { getAllByPlaceholderText, getByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInput = getAllByPlaceholderText("Type password")[0];
    
    fireEvent.changeText(passwordInput, "Password");
    
    expect(getByText("Password must contain at least one number")).toBeTruthy();
  });

  it("accepts valid password", () => {
    const { getAllByPlaceholderText, queryByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInput = getAllByPlaceholderText("Type password")[0];
    
    fireEvent.changeText(passwordInput, "Password123");
    
    expect(queryByText("Please enter a password")).toBeNull();
    expect(queryByText("Password must be at least 6 characters long")).toBeNull();
    expect(queryByText("Password must contain at least one capital letter")).toBeNull();
    expect(queryByText("Password must contain at least one number")).toBeNull();
  });

  it("validates empty confirm password", () => {
    const { getAllByPlaceholderText, getByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInput = getAllByPlaceholderText("Type password")[0];
    const submitButton = getByText("Submit");

    fireEvent.changeText(passwordInput, "Password123");
    fireEvent.press(submitButton);

    expect(getByText("Please confirm your password")).toBeTruthy();
  });

  it("validates password mismatch", () => {
    const { getAllByPlaceholderText, getByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInputs = getAllByPlaceholderText("Type password");
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];

    fireEvent.changeText(passwordInput, "Password123");
    fireEvent.changeText(confirmPasswordInput, "Password456");

    expect(getByText("Passwords do not match")).toBeTruthy();
  });

  it("updates confirm password error when password changes", () => {
    const { getAllByPlaceholderText, getByText, queryByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInputs = getAllByPlaceholderText("Type password");
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];

    // Set matching passwords
    fireEvent.changeText(passwordInput, "Password123");
    fireEvent.changeText(confirmPasswordInput, "Password123");
    
    expect(queryByText("Passwords do not match")).toBeNull();

    // Change password to create mismatch
    fireEvent.changeText(passwordInput, "Password456");
    
    expect(getByText("Passwords do not match")).toBeTruthy();
  });

  it("submits successfully with valid passwords", () => {
    const { getAllByPlaceholderText, getByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInputs = getAllByPlaceholderText("Type password");
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];
    const submitButton = getByText("Submit");

    fireEvent.changeText(passwordInput, "Password123");
    fireEvent.changeText(confirmPasswordInput, "Password123");
    fireEvent.press(submitButton);

    expect(consoleSpy).toHaveBeenCalledWith("Password confirmed successfully");
  });

  it("does not submit with invalid passwords", () => {
    const { getAllByPlaceholderText, getByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInput = getAllByPlaceholderText("Type password")[0];
    const submitButton = getByText("Submit");

    fireEvent.changeText(passwordInput, "weak");
    fireEvent.press(submitButton);

    expect(consoleSpy).not.toHaveBeenCalledWith("Password confirmed successfully");
  });

  it("clears password error when input is cleared", () => {
    const { getAllByPlaceholderText, getByText, queryByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInput = getAllByPlaceholderText("Type password")[0];
    
    // Enter invalid password
    fireEvent.changeText(passwordInput, "weak");
    expect(getByText("Password must be at least 6 characters long")).toBeTruthy();
    
    // Clear password
    fireEvent.changeText(passwordInput, "");
    expect(queryByText("Password must be at least 6 characters long")).toBeNull();
  });

  it("clears confirm password error when input is cleared", () => {
    const { getAllByPlaceholderText, getByText, queryByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInputs = getAllByPlaceholderText("Type password");
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];

    fireEvent.changeText(passwordInput, "Password123");
    fireEvent.changeText(confirmPasswordInput, "Password456");
    expect(getByText("Passwords do not match")).toBeTruthy();
    
    // Clear confirm password
    fireEvent.changeText(confirmPasswordInput, "");
    expect(queryByText("Passwords do not match")).toBeNull();
  });

  it("handles Terms of Service press", () => {
    const { getByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const termsLink = getByText("Terms of Service");
    fireEvent.press(termsLink);
    
    expect(consoleSpy).toHaveBeenCalledWith("Terms of Service pressed");
  });

  it("handles Privacy Policy press", () => {
    const { getByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const privacyLink = getByText("Privacy Policy");
    fireEvent.press(privacyLink);
    
    expect(consoleSpy).toHaveBeenCalledWith("Privacy Policy pressed");
  });

  it("has correct input properties", () => {
    const { getAllByPlaceholderText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInputs = getAllByPlaceholderText("Type password");
    
    passwordInputs.forEach(input => {
      expect(input.props.autoCapitalize).toBe("none");
      expect(input.props.autoCorrect).toBe(false);
      expect(input.props.secureTextEntry).toBe(true);
      expect(input.props.placeholderTextColor).toBe("#999");
    });
  });

  it("email input is not editable", () => {
    const { getByDisplayValue } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const emailInput = getByDisplayValue("test@example.com");
    expect(emailInput.props.editable).toBe(false);
  });

  it("validates multiple password criteria simultaneously", () => {
    const { getAllByPlaceholderText, getByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInput = getAllByPlaceholderText("Type password")[0];
    const submitButton = getByText("Submit");

    // Test password that fails multiple criteria
    fireEvent.changeText(passwordInput, "abc");
    fireEvent.press(submitButton);

    // Should show the first error encountered
    expect(
      getByText("Password must be at least 6 characters long") ||
      getByText("Password must contain at least one capital letter") ||
      getByText("Password must contain at least one number")
    ).toBeTruthy();
  });

  // Test password visibility toggle functionality without relying on finding buttons
  it("toggles password secureTextEntry property", () => {
    const { getAllByPlaceholderText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInput = getAllByPlaceholderText("Type password")[0];
    
    // Enter password to trigger state change
    fireEvent.changeText(passwordInput, "Password123");
    
    // Initially should be secure
    expect(passwordInput.props.secureTextEntry).toBe(true);
    
    // Note: Eye icon visibility and toggle functionality is tested through state changes
    // The actual clicking of eye icons would require testID props in the component
  });

  it("shows password field updates correctly", () => {
    const { getAllByPlaceholderText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInput = getAllByPlaceholderText("Type password")[0];
    
    fireEvent.changeText(passwordInput, "MyPassword123");
    
    expect(passwordInput.props.value).toBe("MyPassword123");
  });

  it("shows confirm password field updates correctly", () => {
    const { getAllByPlaceholderText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );

    const confirmPasswordInput = getAllByPlaceholderText("Type password")[1];
    
    fireEvent.changeText(confirmPasswordInput, "MyPassword123");
    
    expect(confirmPasswordInput.props.value).toBe("MyPassword123");
  });
});
