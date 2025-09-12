import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Alert } from "react-native";
import EmailScreen from "../../../src/screens/invite_screens/EmailScreen";

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
}));

jest.spyOn(Alert, "alert");

const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

describe("EmailScreen Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it("renders all main UI elements", () => {
    const { getByText, getByPlaceholderText } = render(<EmailScreen />);

    expect(getByText("Enter Your E-Mail")).toBeTruthy();
    expect(getByText("We will Send you a OTP in the below E-Mail")).toBeTruthy();
    expect(getByText("Email")).toBeTruthy();
    expect(getByPlaceholderText("name@example.com")).toBeTruthy();
    expect(getByText("Verify OTP")).toBeTruthy();
    expect(getByText("By clicking continue, you agree to our")).toBeTruthy();
    expect(getByText("Terms of Service")).toBeTruthy();
    expect(getByText("and")).toBeTruthy();
    expect(getByText("Privacy Policy")).toBeTruthy();
  });

  it("updates email input when user types", () => {
    const { getByPlaceholderText } = render(<EmailScreen />);
    const emailInput = getByPlaceholderText("name@example.com");
    fireEvent.changeText(emailInput, "test@example.com");
    expect(emailInput.props.value).toBe("test@example.com");
  });

  it("shows error alert when email is empty", () => {
    const { getByText } = render(<EmailScreen />);
    fireEvent.press(getByText("Verify OTP"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "Please enter your email address");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows error alert for invalid email formats", () => {
    const { getByPlaceholderText, getByText } = render(<EmailScreen />);
    const emailInput = getByPlaceholderText("name@example.com");
    const verifyButton = getByText("Verify OTP");
    const invalidEmails = ["invalid-email", "@example.com", "test@", "test.example.com", "test @example.com"];

    invalidEmails.forEach((invalidEmail) => {
      jest.clearAllMocks();
      fireEvent.changeText(emailInput, invalidEmail);
      fireEvent.press(verifyButton);
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Please enter a valid email address");
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("navigates to EmailOtp screen for valid emails", () => {
    const { getByPlaceholderText, getByText } = render(<EmailScreen />);
    const emailInput = getByPlaceholderText("name@example.com");
    const verifyButton = getByText("Verify OTP");

    const validEmails = [
      "test@example.com",
      "user.name@domain.co.uk",
      "firstname+lastname@company.org",
      "123@numbers.net",
      "a@b.co",
    ];

    validEmails.forEach((validEmail) => {
      jest.clearAllMocks();
      fireEvent.changeText(emailInput, validEmail);
      fireEvent.press(verifyButton);
      expect(Alert.alert).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("EmailOtp", { email: validEmail });
    });
  });

  it("handles Terms of Service and Privacy Policy presses", () => {
    const { getByText } = render(<EmailScreen />);
    fireEvent.press(getByText("Terms of Service"));
    expect(consoleSpy).toHaveBeenCalledWith("Terms of Service pressed");
    fireEvent.press(getByText("Privacy Policy"));
    expect(consoleSpy).toHaveBeenCalledWith("Privacy Policy pressed");
  });

  it("has correct input properties set", () => {
    const { getByPlaceholderText } = render(<EmailScreen />);
    const emailInput = getByPlaceholderText("name@example.com");
    expect(emailInput.props.keyboardType).toBe("email-address");
    expect(emailInput.props.autoCapitalize).toBe("none");
    expect(emailInput.props.autoCorrect).toBe(false);
    expect(emailInput.props.placeholderTextColor).toBe("#999");
  });

  it("shows error alert for emails with leading/trailing whitespace", () => {
    const { getByPlaceholderText, getByText } = render(<EmailScreen />);
    const emailInput = getByPlaceholderText("name@example.com");
    fireEvent.changeText(emailInput, "  test@example.com  ");
    fireEvent.press(getByText("Verify OTP"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "Please enter a valid email address");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("maintains email input state across interactions", () => {
    const { getByPlaceholderText, getByText } = render(<EmailScreen />);
    const emailInput = getByPlaceholderText("name@example.com");
    const verifyButton = getByText("Verify OTP");

    fireEvent.changeText(emailInput, "invalid-email");
    fireEvent.press(verifyButton);
    expect(Alert.alert).toHaveBeenCalled();
    expect(emailInput.props.value).toBe("invalid-email");

    jest.clearAllMocks();

    fireEvent.changeText(emailInput, "valid@example.com");
    fireEvent.press(verifyButton);
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("EmailOtp", { email: "valid@example.com" });
  });
});
