import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
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

  it("renders all main UI elements correctly", () => {
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

  it("displays correct email from route params or default", () => {
    const { getByDisplayValue, rerender } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );
    expect(getByDisplayValue("test@example.com")).toBeTruthy();

    const routeWithoutParams: RouteProp<RootStack, "PasswordScreen"> = {
      key: "PasswordScreen-1",
      name: "PasswordScreen",
      params: undefined,
    } as any;

    rerender(<PasswordScreen route={routeWithoutParams} navigation={mockNavigation} />);
    expect(getByDisplayValue("name@example.com")).toBeTruthy();
  });

  it("validates password input and confirms password", () => {
    const { getAllByPlaceholderText, getByText, queryByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );
    const passwordInputs = getAllByPlaceholderText("Type password");
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = passwordInputs[1];
    const submitButton = getByText("Submit");

    fireEvent.press(submitButton);
    expect(getByText("Please enter a password")).toBeTruthy();

    fireEvent.changeText(passwordInput, "12");
    expect(getByText("Password must be at least 6 characters long")).toBeTruthy();

    fireEvent.changeText(passwordInput, "password123");
    expect(getByText("Password must contain at least one capital letter")).toBeTruthy();

    fireEvent.changeText(passwordInput, "Password");
    expect(getByText("Password must contain at least one number")).toBeTruthy();

    fireEvent.changeText(passwordInput, "Password123");
    expect(queryByText("Please enter a password")).toBeNull();
    expect(queryByText("Password must be at least 6 characters long")).toBeNull();
    expect(queryByText("Password must contain at least one capital letter")).toBeNull();
    expect(queryByText("Password must contain at least one number")).toBeNull();

    fireEvent.press(submitButton);
    expect(getByText("Please confirm your password")).toBeTruthy();

    fireEvent.changeText(confirmPasswordInput, "Password456");
    expect(getByText("Passwords do not match")).toBeTruthy();

    fireEvent.changeText(confirmPasswordInput, "Password123");
    expect(queryByText("Passwords do not match")).toBeNull();

    fireEvent.changeText(passwordInput, "Password456");
    expect(getByText("Passwords do not match")).toBeTruthy();

    fireEvent.changeText(confirmPasswordInput, "");
    expect(queryByText("Passwords do not match")).toBeNull();
  });

  it("submits successfully with valid matching passwords", () => {
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

  it("does not submit with invalid password", () => {
    const { getAllByPlaceholderText, getByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );
    const passwordInput = getAllByPlaceholderText("Type password")[0];
    const submitButton = getByText("Submit");

    fireEvent.changeText(passwordInput, "weak");
    fireEvent.press(submitButton);

    expect(consoleSpy).not.toHaveBeenCalledWith("Password confirmed successfully");
  });

  it("has correct input properties and email field is not editable", () => {
    const { getAllByPlaceholderText, getByDisplayValue } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );
    const passwordInputs = getAllByPlaceholderText("Type password");
    passwordInputs.forEach(input => {
      expect(input.props.autoCapitalize).toBe("none");
      expect(input.props.autoCorrect).toBe(false);
      expect(input.props.secureTextEntry).toBe(true);
      expect(input.props.placeholderTextColor).toBe("#999");
    });
    const emailInput = getByDisplayValue("test@example.com");
    expect(emailInput.props.editable).toBe(false);
  });

  it("handles Terms of Service and Privacy Policy presses", () => {
    const { getByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );
    fireEvent.press(getByText("Terms of Service"));
    expect(consoleSpy).toHaveBeenCalledWith("Terms of Service pressed");
    fireEvent.press(getByText("Privacy Policy"));
    expect(consoleSpy).toHaveBeenCalledWith("Privacy Policy pressed");
  });

  it("updates password and confirm password fields correctly", () => {
    const { getAllByPlaceholderText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );
    const passwordInput = getAllByPlaceholderText("Type password")[0];
    const confirmPasswordInput = getAllByPlaceholderText("Type password")[1];

    fireEvent.changeText(passwordInput, "MyPassword123");
    expect(passwordInput.props.value).toBe("MyPassword123");

    fireEvent.changeText(confirmPasswordInput, "MyPassword123");
    expect(confirmPasswordInput.props.value).toBe("MyPassword123");
  });

  it("validates multiple password criteria at once", () => {
    const { getAllByPlaceholderText, getByText } = render(
      <PasswordScreen route={mockRoute} navigation={mockNavigation} />
    );
    const passwordInput = getAllByPlaceholderText("Type password")[0];
    const submitButton = getByText("Submit");

    fireEvent.changeText(passwordInput, "abc");
    fireEvent.press(submitButton);

    expect(
      getByText("Password must be at least 6 characters long") ||
      getByText("Password must contain at least one capital letter") ||
      getByText("Password must contain at least one number")
    ).toBeTruthy();
  });
});
