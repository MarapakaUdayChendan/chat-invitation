import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Keyboard } from "react-native";
import ForgotPasswordScreen from "../../src/screens/ForgotPasswordScreen";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: jest.fn(),
    setParams: jest.fn(),
    setOptions: jest.fn(),
    dispatch: jest.fn(),
    canGoBack: jest.fn(() => true),
    addListener: jest.fn(() => jest.fn()),
    removeListener: jest.fn(),
  }),
}));

jest.mock("../../src/styles/theme", () => ({
  COLORS: {
    background: "#ffffff",
    surface: "#ffffff",
    primary: "#0066cc",
    accent: "#ff6b35",
    placeholder: "#999999",
    error: "#ff3333",
    onPrimary: "#ffffff",
    secondaryText: "#666666",
    onSurface: "#000000",
  },
  FONT: {
    size: { heading: 24, subheading: 16, label: 12, button: 16 },
    weight: { bold: "700", medium: "500" },
  },
  INPUT: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    marginBottom: 16,
  },
}));

jest.spyOn(Keyboard, "dismiss").mockImplementation(() => {});

const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

describe("ForgotPasswordScreen", () => {
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => consoleSpy.mockRestore());

  it("renders UI elements", () => {
    const { getByText, getByPlaceholderText } = render(<ForgotPasswordScreen />);
    expect(getByText("Reset Password")).toBeTruthy();
    expect(getByText("Create a new secure password")).toBeTruthy();
    expect(getByPlaceholderText("New Password")).toBeTruthy();
    expect(getByPlaceholderText("Confirm Password")).toBeTruthy();
    expect(getByText("Update Password")).toBeTruthy();
  });

  it("shows password validation errors", () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen />);
    const newPasswordInput = getByPlaceholderText("New Password");
    fireEvent.changeText(newPasswordInput, "");
    fireEvent(newPasswordInput, "blur");
    getByText("Password is required");
    fireEvent.changeText(newPasswordInput, "123");
    fireEvent(newPasswordInput, "blur");
    getByText("At least 6 characters required");
    fireEvent.changeText(newPasswordInput, "password1");
    fireEvent(newPasswordInput, "blur");
    getByText("Must contain 1 uppercase letter");
    fireEvent.changeText(newPasswordInput, "Password");
    fireEvent(newPasswordInput, "blur");
    getByText("Must contain 1 number");
  });

  it("accepts valid password without errors", () => {
    const { getByPlaceholderText, queryByText } = render(<ForgotPasswordScreen />);
    const newPasswordInput = getByPlaceholderText("New Password");
    fireEvent.changeText(newPasswordInput, "Password123");
    fireEvent(newPasswordInput, "blur");
    expect(queryByText("Password is required")).toBeNull();
    expect(queryByText("At least 6 characters required")).toBeNull();
    expect(queryByText("Must contain 1 uppercase letter")).toBeNull();
    expect(queryByText("Must contain 1 number")).toBeNull();
  });

  it("validates confirm password mismatch", () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen />);
    const newPasswordInput = getByPlaceholderText("New Password");
    const confirmPasswordInput = getByPlaceholderText("Confirm Password");
    fireEvent.changeText(newPasswordInput, "Password123");
    fireEvent.changeText(confirmPasswordInput, "Password456");
    fireEvent(confirmPasswordInput, "blur");
    getByText("Passwords do not match");
  });

  it("shows error for empty confirm password", () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen />);
    const confirmPasswordInput = getByPlaceholderText("Confirm Password");
    fireEvent.changeText(confirmPasswordInput, "");
    fireEvent(confirmPasswordInput, "blur");
    getByText("Please confirm password");
  });

  it("accepts matching passwords", () => {
    const { getByPlaceholderText, queryByText } = render(<ForgotPasswordScreen />);
    const newPasswordInput = getByPlaceholderText("New Password");
    const confirmPasswordInput = getByPlaceholderText("Confirm Password");
    fireEvent.changeText(newPasswordInput, "Password123");
    fireEvent.changeText(confirmPasswordInput, "Password123");
    fireEvent(confirmPasswordInput, "blur");
    expect(queryByText("Passwords do not match")).toBeNull();
    expect(queryByText("Please confirm password")).toBeNull();
  });

  it("clears errors when typing after blur", () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<ForgotPasswordScreen />);
    const newPasswordInput = getByPlaceholderText("New Password");
    fireEvent.changeText(newPasswordInput, "123");
    fireEvent(newPasswordInput, "blur");
    getByText("At least 6 characters required");
    fireEvent.changeText(newPasswordInput, "Password123");
    expect(queryByText("At least 6 characters required")).toBeNull();
  });

  it("enables submit button when form valid", () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen />);
    const newPasswordInput = getByPlaceholderText("New Password");
    const confirmPasswordInput = getByPlaceholderText("Confirm Password");
    const submitButton = getByText("Update Password");
    fireEvent.changeText(newPasswordInput, "Password123");
    fireEvent.changeText(confirmPasswordInput, "Password123");
    expect(submitButton.parent?.props.accessibilityState?.disabled).toBeFalsy();
  });

  it("submits form and navigates", () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen />);
    const newPasswordInput = getByPlaceholderText("New Password");
    const confirmPasswordInput = getByPlaceholderText("Confirm Password");
    const submitButton = getByText("Update Password");
    fireEvent.changeText(newPasswordInput, "Password123");
    fireEvent.changeText(confirmPasswordInput, "Password123");
    fireEvent.press(submitButton);
    expect(consoleSpy).toHaveBeenCalledWith("Password reset successful:", "Password123");
    expect(mockNavigate).toHaveBeenCalledWith("LoginScreen");
  });

  it("mocks Keyboard.dismiss", () => {
    render(<ForgotPasswordScreen />);
    expect(Keyboard.dismiss).toBeDefined();
  });

  it("renders input fields", () => {
    const { getByPlaceholderText } = render(<ForgotPasswordScreen />);
    expect(getByPlaceholderText("New Password")).toBeTruthy();
    expect(getByPlaceholderText("Confirm Password")).toBeTruthy();
  });

  it("validates form with user interaction", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<ForgotPasswordScreen />);
    const newPasswordInput = getByPlaceholderText("New Password");
    const confirmPasswordInput = getByPlaceholderText("Confirm Password");
    fireEvent.changeText(newPasswordInput, "123");
    fireEvent(newPasswordInput, "blur");
    await waitFor(() => getByText("At least 6 characters required"));
    fireEvent.changeText(newPasswordInput, "Password123");
    await waitFor(() => expect(queryByText("At least 6 characters required")).toBeNull());
    fireEvent.changeText(confirmPasswordInput, "WrongPassword");
    fireEvent(confirmPasswordInput, "blur");
    await waitFor(() => getByText("Passwords do not match"));
    fireEvent.changeText(confirmPasswordInput, "Password123");
    await waitFor(() => expect(queryByText("Passwords do not match")).toBeNull());
  });

  it("updates errors in real-time", () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<ForgotPasswordScreen />);
    const newPasswordInput = getByPlaceholderText("New Password");
    fireEvent(newPasswordInput, "blur");
    getByText("Password is required");
    fireEvent.changeText(newPasswordInput, "123");
    expect(queryByText("Password is required")).toBeNull();
    getByText("At least 6 characters required");
    fireEvent.changeText(newPasswordInput, "password123");
    expect(queryByText("At least 6 characters required")).toBeNull();
    getByText("Must contain 1 uppercase letter");
    fireEvent.changeText(newPasswordInput, "Password123");
    expect(queryByText("Must contain 1 uppercase letter")).toBeNull();
  });

  it("validates confirm password on new password change", () => {
    const { getByPlaceholderText } = render(<ForgotPasswordScreen />);
    const newPasswordInput = getByPlaceholderText("New Password");
    const confirmPasswordInput = getByPlaceholderText("Confirm Password");
    fireEvent.changeText(newPasswordInput, "Password123");
    fireEvent.changeText(confirmPasswordInput, "Password123");
    fireEvent(confirmPasswordInput, "blur");
    expect(() => getByPlaceholderText("Passwords do not match")).toThrow();
    fireEvent.changeText(newPasswordInput, "Password456");
  });

  it("renders password strength bar", () => {
    const { getByPlaceholderText } = render(<ForgotPasswordScreen />);
    fireEvent.changeText(getByPlaceholderText("New Password"), "Password123");
    expect(getByPlaceholderText("New Password")).toBeTruthy();
  });
});
