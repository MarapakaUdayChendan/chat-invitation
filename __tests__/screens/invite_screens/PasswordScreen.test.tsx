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

describe("PasswordScreen Component - Complete Coverage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("Rendering Tests", () => {
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
      expect(getByTestId("app-logo")).toBeTruthy();
      expect(getByTestId("email-checkmark")).toBeTruthy();
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

    it("renders logo and checkmark icons", () => {
      const { getByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      expect(getByTestId("app-logo")).toBeTruthy();
      expect(getByTestId("email-checkmark")).toBeTruthy();
    });
  });

  describe("Password Validation Tests", () => {
    it("validates empty password", () => {
      const { getByTestId, getByText, getByTestId: getById } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const submitButton = getByText("Submit");
      fireEvent.press(submitButton);
      
      expect(getById("password-error")).toBeTruthy();
      expect(getByText("Please enter a password")).toBeTruthy();
    });

    it("validates password length", () => {
      const { getByTestId, getByText } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      fireEvent.changeText(passwordInput, "12");
      
      expect(getByText("Password must be at least 6 characters long")).toBeTruthy();
    });

    it("validates capital letter requirement", () => {
      const { getByTestId, getByText } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      fireEvent.changeText(passwordInput, "password123");
      
      expect(getByText("Password must contain at least one capital letter")).toBeTruthy();
    });

    it("validates number requirement", () => {
      const { getByTestId, getByText } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      fireEvent.changeText(passwordInput, "Password");
      
      expect(getByText("Password must contain at least one number")).toBeTruthy();
    });

    it("clears password error when valid password is entered", () => {
      const { getByTestId, queryByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      fireEvent.changeText(passwordInput, "Password123");
      
      expect(queryByTestId("password-error")).toBeNull();
    });

    it("clears password error when input becomes empty", () => {
      const { getByTestId, getByText, queryByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      fireEvent.changeText(passwordInput, "123");
      expect(getByText("Password must be at least 6 characters long")).toBeTruthy();
      
      fireEvent.changeText(passwordInput, "");
      expect(queryByTestId("password-error")).toBeNull();
    });
  });

  describe("Confirm Password Validation Tests", () => {
    it("validates empty confirm password", () => {
      const { getByTestId, getByText } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      const submitButton = getByText("Submit");
      
      fireEvent.changeText(passwordInput, "Password123");
      fireEvent.press(submitButton);
      
      expect(getByText("Please confirm your password")).toBeTruthy();
    });

    it("validates password mismatch", () => {
      const { getByTestId, getByText } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      const confirmPasswordInput = getByTestId("confirm-password-input");
      
      fireEvent.changeText(passwordInput, "Password123");
      fireEvent.changeText(confirmPasswordInput, "Password456");
      
      expect(getByText("Passwords do not match")).toBeTruthy();
    });

    it("clears confirm password error when passwords match", () => {
      const { getByTestId, queryByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      const confirmPasswordInput = getByTestId("confirm-password-input");
      
      fireEvent.changeText(passwordInput, "Password123");
      fireEvent.changeText(confirmPasswordInput, "Password123");
      
      expect(queryByTestId("confirm-password-error")).toBeNull();
    });

    it("clears confirm password error when input becomes empty", () => {
      const { getByTestId, queryByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      const confirmPasswordInput = getByTestId("confirm-password-input");
      
      fireEvent.changeText(passwordInput, "Password123");
      fireEvent.changeText(confirmPasswordInput, "Password456");
      fireEvent.changeText(confirmPasswordInput, "");
      
      expect(queryByTestId("confirm-password-error")).toBeNull();
    });

    it("updates confirm password error when password changes", () => {
      const { getByTestId, getByText } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      const confirmPasswordInput = getByTestId("confirm-password-input");
      
      fireEvent.changeText(passwordInput, "Password123");
      fireEvent.changeText(confirmPasswordInput, "Password123");
      fireEvent.changeText(passwordInput, "Password456");
      
      expect(getByText("Passwords do not match")).toBeTruthy();
    });
  });

  describe("Eye Icon Toggle Tests", () => {
    it("shows password eye toggle when password is entered", () => {
      const { getByTestId, queryByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      
      expect(queryByTestId("password-eye-toggle")).toBeNull();
      
      fireEvent.changeText(passwordInput, "Password123");
      expect(getByTestId("password-eye-toggle")).toBeTruthy();
    });

    it("toggles password visibility", () => {
      const { getByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      fireEvent.changeText(passwordInput, "Password123");
      
      const eyeToggle = getByTestId("password-eye-toggle");
      
      expect(passwordInput.props.secureTextEntry).toBe(true);
      fireEvent.press(eyeToggle);
      expect(passwordInput.props.secureTextEntry).toBe(false);
      fireEvent.press(eyeToggle);
      expect(passwordInput.props.secureTextEntry).toBe(true);
    });

    it("shows confirm password eye toggle when confirm password is entered", () => {
      const { getByTestId, queryByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const confirmPasswordInput = getByTestId("confirm-password-input");
      
      expect(queryByTestId("confirm-password-eye-toggle")).toBeNull();
      
      fireEvent.changeText(confirmPasswordInput, "Password123");
      expect(getByTestId("confirm-password-eye-toggle")).toBeTruthy();
    });

    it("toggles confirm password visibility", () => {
      const { getByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const confirmPasswordInput = getByTestId("confirm-password-input");
      fireEvent.changeText(confirmPasswordInput, "Password123");
      
      const eyeToggle = getByTestId("confirm-password-eye-toggle");
      
      expect(confirmPasswordInput.props.secureTextEntry).toBe(true);
      fireEvent.press(eyeToggle);
      expect(confirmPasswordInput.props.secureTextEntry).toBe(false);
      fireEvent.press(eyeToggle);
      expect(confirmPasswordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe("Submission Tests", () => {
    it("submits successfully with valid matching passwords", () => {
      const { getByTestId, getByText } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      const confirmPasswordInput = getByTestId("confirm-password-input");
      const submitButton = getByText("Submit");
      
      fireEvent.changeText(passwordInput, "Password123");
      fireEvent.changeText(confirmPasswordInput, "Password123");
      fireEvent.press(submitButton);
      
      expect(consoleSpy).toHaveBeenCalledWith("Password confirmed successfully");
    });

    it("does not submit with invalid password", () => {
      const { getByTestId, getByText } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      const submitButton = getByText("Submit");
      
      fireEvent.changeText(passwordInput, "weak");
      fireEvent.press(submitButton);
      
      expect(consoleSpy).not.toHaveBeenCalledWith("Password confirmed successfully");
    });

    it("does not submit with mismatched passwords", () => {
      const { getByTestId, getByText } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      const confirmPasswordInput = getByTestId("confirm-password-input");
      const submitButton = getByText("Submit");
      
      fireEvent.changeText(passwordInput, "Password123");
      fireEvent.changeText(confirmPasswordInput, "Password456");
      fireEvent.press(submitButton);
      
      expect(consoleSpy).not.toHaveBeenCalledWith("Password confirmed successfully");
    });
  });

  describe("Input Properties Tests", () => {
    it("has correct input properties", () => {
      const { getByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      const confirmPasswordInput = getByTestId("confirm-password-input");
      const emailInput = getByTestId("email-input");
      
      expect(passwordInput.props.autoCapitalize).toBe("none");
      expect(passwordInput.props.autoCorrect).toBe(false);
      expect(passwordInput.props.secureTextEntry).toBe(true);
      expect(passwordInput.props.placeholderTextColor).toBe("#999");
      
      expect(confirmPasswordInput.props.autoCapitalize).toBe("none");
      expect(confirmPasswordInput.props.autoCorrect).toBe(false);
      expect(confirmPasswordInput.props.secureTextEntry).toBe(true);
      expect(confirmPasswordInput.props.placeholderTextColor).toBe("#999");
      
      expect(emailInput.props.editable).toBe(false);
    });
  });

  describe("Link Press Tests", () => {
    it("handles Terms of Service press", () => {
      const { getByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      fireEvent.press(getByTestId("terms-link"));
      expect(consoleSpy).toHaveBeenCalledWith("Terms of Service pressed");
    });

    it("handles Privacy Policy press", () => {
      const { getByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      fireEvent.press(getByTestId("privacy-link"));
      expect(consoleSpy).toHaveBeenCalledWith("Privacy Policy pressed");
    });
  });

  describe("Field Update Tests", () => {
    it("updates password field value correctly", () => {
      const { getByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      fireEvent.changeText(passwordInput, "MyPassword123");
      
      expect(passwordInput.props.value).toBe("MyPassword123");
    });

    it("updates confirm password field value correctly", () => {
      const { getByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const confirmPasswordInput = getByTestId("confirm-password-input");
      fireEvent.changeText(confirmPasswordInput, "MyPassword123");
      
      expect(confirmPasswordInput.props.value).toBe("MyPassword123");
    });
  });

  describe("Edge Cases", () => {
    it("validates multiple password criteria at once", () => {
      const { getByTestId, getByText } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      const submitButton = getByText("Submit");
      
      fireEvent.changeText(passwordInput, "abc");
      fireEvent.press(submitButton);
      
      // Should show the first validation error encountered
      expect(getByText("Password must be at least 6 characters long")).toBeTruthy();
    });

    it("handles route with null params", () => {
      const routeWithNull: RouteProp<RootStack, "PasswordScreen"> = {
        key: "PasswordScreen-1",
        name: "PasswordScreen",
        params: null,
      } as any;

      const { getByDisplayValue } = render(
        <PasswordScreen route={routeWithNull} navigation={mockNavigation} />
      );
      
      expect(getByDisplayValue("name@example.com")).toBeTruthy();
    });

    it("handles empty email param", () => {
      const routeWithEmptyEmail: RouteProp<RootStack, "PasswordScreen"> = {
        key: "PasswordScreen-1",
        name: "PasswordScreen",
        params: { email: "" },
      };

      const { getByDisplayValue } = render(
        <PasswordScreen route={routeWithEmptyEmail} navigation={mockNavigation} />
      );
      
      expect(getByDisplayValue("name@example.com")).toBeTruthy();
    });

    it("cross-validates passwords when both fields have values", () => {
      const { getByTestId, queryByTestId } = render(
        <PasswordScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      const passwordInput = getByTestId("passwordEnter");
      const confirmPasswordInput = getByTestId("confirm-password-input");
      
      // Enter matching passwords
      fireEvent.changeText(passwordInput, "Password123");
      fireEvent.changeText(confirmPasswordInput, "Password123");
      
      // Change password to create mismatch
      fireEvent.changeText(passwordInput, "NewPassword123");
      
      expect(getByTestId("confirm-password-error")).toBeTruthy();
    });
  });
});
