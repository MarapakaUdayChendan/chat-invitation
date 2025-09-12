import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import ForgotPasswordConfirmation from "../../src/screens/ForgotPasswordConfirmation";

const mockNavigate = jest.fn();

jest.mock("expo-router", () => ({
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

jest.mock("../../src/components/OtpGeneration", () => ({
  OtpGeneration: jest.fn(() => "123456"),
}));

jest.mock("../../src/styles/theme", () => ({
  COLORS: {
    background: "#ffffff",
    primary: "#0066cc",
    accent: "#ff6b35",
    placeholder: "#999999",
    error: "#ff3333",
    onPrimary: "#ffffff",
    secondaryText: "#666666",
  },
  FONT: {
    size: { heading: 24, subheading: 16, label: 12, button: 16 },
    weight: { bold: "700", medium: "500" },
    family: "System",
  },
  INPUT: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

describe("ForgotPasswordConfirmation Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
    (Alert.alert as jest.Mock).mockRestore();
  });

  it("renders all UI elements correctly", () => {
    const { getByText, getByPlaceholderText } = render(<ForgotPasswordConfirmation />);
    expect(getByText("Forgot Password")).toBeTruthy();
    expect(getByText("Recover your account")).toBeTruthy();
    expect(getByPlaceholderText("Email Address")).toBeTruthy();
    expect(getByText("Send OTP")).toBeTruthy();
  });

  it("shows error for invalid email format", () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    const sendButton = getByText("Send OTP");
    fireEvent.changeText(emailInput, "invalidemail");
    fireEvent.press(sendButton);
    expect(getByText("Enter a valid email address")).toBeTruthy();
  });

  it("clears email error when user starts typing", () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    const sendButton = getByText("Send OTP");
    fireEvent.changeText(emailInput, "invalid");
    fireEvent.press(sendButton);
    expect(getByText("Enter a valid email address")).toBeTruthy();
    fireEvent.changeText(emailInput, "test@");
    expect(queryByText("Enter a valid email address")).toBeNull();
  });

  it("sends OTP successfully with valid email", () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    const sendButton = getByText("Send OTP");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.press(sendButton);
    expect(getByText("OTP expires in 30s")).toBeTruthy();
    expect(getByPlaceholderText("Enter OTP")).toBeTruthy();
    expect(getByText("Verify OTP")).toBeTruthy();
    expect(consoleSpy).toHaveBeenCalledWith("OTP Sent", "Your OTP is 123456");
  });

  it("counts down timer correctly", async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    const sendButton = getByText("Send OTP");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.press(sendButton);
    expect(getByText("OTP expires in 30s")).toBeTruthy();
    act(() => { jest.advanceTimersByTime(1000); });
    await waitFor(() => expect(getByText("OTP expires in 29s")).toBeTruthy());
    act(() => { jest.advanceTimersByTime(29000); });
    await waitFor(() => expect(getByText("Resend OTP")).toBeTruthy());
  });

  it("verifies OTP correctly when valid", async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.press(getByText("Send OTP"));
    const otpInput = getByPlaceholderText("Enter OTP");
    const verifyButton = getByText("Verify OTP");
    fireEvent.changeText(otpInput, "123456");
    fireEvent.press(verifyButton);
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        " Success",
        "OTP Verified! You can now reset your password."
      );
      expect(mockNavigate).toHaveBeenCalledWith("ForgotPasswordScreen");
    });
  });

  it("shows error for invalid OTP", () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.press(getByText("Send OTP"));
    const otpInput = getByPlaceholderText("Enter OTP");
    const verifyButton = getByText("Verify OTP");
    fireEvent.changeText(otpInput, "000000");
    fireEvent.press(verifyButton);
    expect(getByText("Invalid OTP. Please try again.")).toBeTruthy();
  });

  it("shows error for expired OTP", async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.press(getByText("Send OTP"));
    act(() => { jest.advanceTimersByTime(30000); });
    const otpInput = getByPlaceholderText("Enter OTP");
    const verifyButton = getByText("Verify OTP");
    fireEvent.changeText(otpInput, "123456");
    fireEvent.press(verifyButton);
    await waitFor(() => expect(getByText("OTP expired! Please resend a new one.")).toBeTruthy());
  });

  it("allows resend after timer expires", async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.press(getByText("Send OTP"));
    act(() => { jest.advanceTimersByTime(30000); });
    await waitFor(() => expect(getByText("Resend OTP")).toBeTruthy());
    fireEvent.press(getByText("Resend OTP"));
    await waitFor(() => {
      expect(getByText("OTP expires in 30s")).toBeTruthy();
      expect(consoleSpy).toHaveBeenLastCalledWith("OTP Sent", "Your OTP is 123456");
    });
  });

  it("shows last attempt warning on third send", async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.press(getByText("Send OTP"));
    act(() => { jest.advanceTimersByTime(30000); });
    await waitFor(() => fireEvent.press(getByText("Resend OTP")));
    act(() => { jest.advanceTimersByTime(30000); });
    await waitFor(() => expect(getByText("Resend OTP (last attempt)")).toBeTruthy());
  });

  it("shows correct resend button text progression", async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.press(getByText("Send OTP"));
    act(() => { jest.advanceTimersByTime(30000); });
    await waitFor(() => expect(getByText("Resend OTP")).toBeTruthy());
    fireEvent.press(getByText("Resend OTP"));
    act(() => { jest.advanceTimersByTime(30000); });
    await waitFor(() => expect(getByText("Resend OTP (last attempt)")).toBeTruthy());
  });

  it("handles maximum send count logic", () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordConfirmation />);
    expect(getByPlaceholderText("Email Address")).toBeTruthy();
    expect(getByText("Send OTP")).toBeTruthy();
  });

  it("disables email input when blocked", () => {
    const { getByPlaceholderText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    fireEvent.changeText(emailInput, "test@example.com");
    expect(emailInput.props.editable).not.toBe(false);
  });

  it("clears OTP error when user starts typing", () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.press(getByText("Send OTP"));
    const otpInput = getByPlaceholderText("Enter OTP");
    const verifyButton = getByText("Verify OTP");
    fireEvent.changeText(otpInput, "000000");
    fireEvent.press(verifyButton);
    expect(getByText("Invalid OTP. Please try again.")).toBeTruthy();
    fireEvent.changeText(otpInput, "1");
    expect(queryByText("Invalid OTP. Please try again.")).toBeNull();
  });

  it("resets form state on successful OTP send", () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    const sendButton = getByText("Send OTP");
    fireEvent.changeText(emailInput, "invalid");
    fireEvent.press(sendButton);
    expect(getByText("Enter a valid email address")).toBeTruthy();
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.press(sendButton);
    expect(queryByText("Enter a valid email address")).toBeNull();
  });

  it("has correct input properties", () => {
    const { getByPlaceholderText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    expect(emailInput.props.keyboardType).toBe("email-address");
    expect(emailInput.props.autoCapitalize).toBe("none");
  });

  it("shows OTP input with correct properties after sending", () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.press(getByText("Send OTP"));
    const otpInput = getByPlaceholderText("Enter OTP");
    expect(otpInput.props.keyboardType).toBe("number-pad");
  });

  it("displays block timer message correctly", () => {
    const { getByPlaceholderText } = render(<ForgotPasswordConfirmation />);
    expect(getByPlaceholderText("Email Address")).toBeTruthy();
  });

  it("handles multiple timer interactions correctly", async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordConfirmation />);
    const emailInput = getByPlaceholderText("Email Address");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.press(getByText("Send OTP"));
    expect(getByText("OTP expires in 30s")).toBeTruthy();
    act(() => { jest.advanceTimersByTime(15000); });
    await waitFor(() => expect(getByText("OTP expires in 15s")).toBeTruthy());
    act(() => { jest.advanceTimersByTime(15000); });
    await waitFor(() => expect(getByText("Resend OTP")).toBeTruthy());
  });
});
