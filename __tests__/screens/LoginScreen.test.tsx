import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../../src/screens/LoginScreen";

// Mock navigation
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe("LoginScreen", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders all elements correctly", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    expect(getByPlaceholderText("Email Address")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Sign In")).toBeTruthy();
    expect(getByText("Login using OTP")).toBeTruthy();
    expect(getByText("Forgot your password?")).toBeTruthy();
  });

  it("shows validation errors when fields are blurred and empty", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("Email Address");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent(emailInput, "focus");
    fireEvent(emailInput, "blur");
    fireEvent(passwordInput, "focus");
    fireEvent(passwordInput, "blur");

    await waitFor(() => {
      expect(getByText("Email is required")).toBeTruthy();
      expect(getByText("Password is required")).toBeTruthy();
    });
  });

  it("updates input fields correctly", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("Email Address");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "123456");

    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("123456");
  });

  it("shows email format error", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("Email Address");

    fireEvent.changeText(emailInput, "invalidemail");
    fireEvent(emailInput, "blur");

    await waitFor(() => {
      expect(getByText("Please enter a valid email address")).toBeTruthy();
    });
  });

  it("navigates to ContactHome on successful login", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("Email Address");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "123456");

    const loginButton = getByText("Sign In");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("ContactHome");
    });
  });

  it("navigates to LoginEmailOtp when using OTP login", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("Email Address");

    fireEvent.changeText(emailInput, "test@example.com");

    const otpButton = getByText("Login using OTP");
    fireEvent.press(otpButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("LoginEmailOtp", {
        email: "test@example.com",
      });
    });
  });

  it("navigates to ForgotPasswordConfirmation on forgot password press", () => {
    const { getByText } = render(<LoginScreen />);

    const forgotButton = getByText("Forgot your password?");
    fireEvent.press(forgotButton);

    expect(mockNavigate).toHaveBeenCalledWith("ForgotPasswordConfirmation");
  });
});
