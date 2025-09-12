import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../../src/screens/LoginScreen";

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

  it("renders all key UI elements", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    expect(getByPlaceholderText("Email Address")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Sign In")).toBeTruthy();
    expect(getByText("Login using OTP")).toBeTruthy();
    expect(getByText("Forgot your password?")).toBeTruthy();
  });

  it("validates required fields and email format on blur", async () => {
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

    fireEvent.changeText(emailInput, "invalidemail");
    fireEvent(emailInput, "blur");

    await waitFor(() => {
      expect(getByText("Please enter a valid email address")).toBeTruthy();
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

  it("navigates correctly on various button presses", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("Email Address");
    const passwordInput = getByPlaceholderText("Password");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "123456");

    fireEvent.press(getByText("Sign In"));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("ContactHome");
    });

    fireEvent.press(getByText("Login using OTP"));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("LoginEmailOtp", { email: "test@example.com" });
    });

    fireEvent.press(getByText("Forgot your password?"));
    expect(mockNavigate).toHaveBeenCalledWith("ForgotPasswordConfirmation");
  });
});
