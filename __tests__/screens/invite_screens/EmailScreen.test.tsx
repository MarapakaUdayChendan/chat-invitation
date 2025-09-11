import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import EmailScreen from "../../../src/screens/invite_screens/EmailScreen";

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
}));

// Mock Alert.alert
jest.spyOn(Alert, "alert");

// Mock console.log for terms and privacy handlers
const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

describe("EmailScreen Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it("renders all UI elements correctly", () => {
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
    
    const verifyButton = getByText("Verify OTP");
    fireEvent.press(verifyButton);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Please enter your email address"
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows error alert for invalid email format", () => {
    const { getByPlaceholderText, getByText } = render(<EmailScreen />);
    
    const emailInput = getByPlaceholderText("name@example.com");
    const verifyButton = getByText("Verify OTP");
    
    // Test invalid email formats
    const invalidEmails = [
      "invalid-email",
      "@example.com",
      "test@",
      "test.example.com",
      "test @example.com",
    ];
    
    invalidEmails.forEach((invalidEmail) => {
      jest.clearAllMocks();
      fireEvent.changeText(emailInput, invalidEmail);
      fireEvent.press(verifyButton);
      
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Please enter a valid email address"
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("navigates to EmailOtp screen with valid email", () => {
    const { getByPlaceholderText, getByText } = render(<EmailScreen />);
    
    const emailInput = getByPlaceholderText("name@example.com");
    const verifyButton = getByText("Verify OTP");
    
    const validEmail = "test@example.com";
    fireEvent.changeText(emailInput, validEmail);
    fireEvent.press(verifyButton);
    
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("EmailOtp", {
      email: validEmail,
    });
  });

  it("accepts various valid email formats", () => {
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
      expect(mockNavigate).toHaveBeenCalledWith("EmailOtp", {
        email: validEmail,
      });
    });
  });

  it("handles Terms of Service press", () => {
    const { getByText } = render(<EmailScreen />);
    
    const termsLink = getByText("Terms of Service");
    fireEvent.press(termsLink);
    
    expect(consoleSpy).toHaveBeenCalledWith("Terms of Service pressed");
  });

  it("handles Privacy Policy press", () => {
    const { getByText } = render(<EmailScreen />);
    
    const privacyLink = getByText("Privacy Policy");
    fireEvent.press(privacyLink);
    
    expect(consoleSpy).toHaveBeenCalledWith("Privacy Policy pressed");
  });

  it("has correct input properties", () => {
    const { getByPlaceholderText } = render(<EmailScreen />);
    
    const emailInput = getByPlaceholderText("name@example.com");
    
    expect(emailInput.props.keyboardType).toBe("email-address");
    expect(emailInput.props.autoCapitalize).toBe("none");
    expect(emailInput.props.autoCorrect).toBe(false);
    expect(emailInput.props.placeholderTextColor).toBe("#999");
  });

it("shows error for email with leading/trailing whitespace", () => {
  const { getByPlaceholderText, getByText } = render(<EmailScreen />);
  
  const emailInput = getByPlaceholderText("name@example.com");
  const verifyButton = getByText("Verify OTP");
  
  // Test email with leading/trailing spaces
  const emailWithSpaces = "  test@example.com  ";
  fireEvent.changeText(emailInput, emailWithSpaces);
  fireEvent.press(verifyButton);
  
  // Should show error because regex doesn't allow whitespace
  expect(Alert.alert).toHaveBeenCalledWith(
    "Error",
    "Please enter a valid email address"
  );
  expect(mockNavigate).not.toHaveBeenCalled();
});

  it("maintains email state across multiple interactions", () => {
    const { getByPlaceholderText, getByText } = render(<EmailScreen />);
    
    const emailInput = getByPlaceholderText("name@example.com");
    const verifyButton = getByText("Verify OTP");
    
    // First enter invalid email
    fireEvent.changeText(emailInput, "invalid-email");
    fireEvent.press(verifyButton);
    
    expect(Alert.alert).toHaveBeenCalled();
    expect(emailInput.props.value).toBe("invalid-email");
    
    // Clear mocks and enter valid email
    jest.clearAllMocks();
    fireEvent.changeText(emailInput, "valid@example.com");
    fireEvent.press(verifyButton);
    
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("EmailOtp", {
      email: "valid@example.com",
    });
  });
});
