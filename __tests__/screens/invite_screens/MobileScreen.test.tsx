import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import MobileScreen from "../../../src/screens/invite_screens/MobileScreen";

const mockNavigate = jest.fn();

// Mock the useNavigation hook from @react-navigation/native (not expo-router)
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
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

// Mock Ionicons to prevent rendering issues
jest.mock("@expo/vector-icons", () => ({
  Ionicons: ({ name, ...props }: any) => {
    const { Text } = require("react-native");
    return <Text {...props}>{name}</Text>;
  },
}));

// Mock console.log for various handlers
const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

describe("MobileScreen Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it("renders all UI elements correctly", () => {
    const { getByText, getByPlaceholderText } = render(<MobileScreen />);

    expect(getByText("Enter Your Mobile Number")).toBeTruthy();
    expect(getByText("We will send you an OTP to the below mobile number")).toBeTruthy();
    expect(getByText("Mobile Number")).toBeTruthy();
    expect(getByText("+91")).toBeTruthy();
    expect(getByPlaceholderText("1234567890")).toBeTruthy();
    expect(getByText("Verify OTP")).toBeTruthy();
    expect(getByText("Terms of Service")).toBeTruthy();
    expect(getByText("Privacy Policy")).toBeTruthy();
  });

  it("shows error for invalid mobile number length", () => {
    const { getByPlaceholderText, getByText } = render(<MobileScreen />);

    const input = getByPlaceholderText("1234567890");
    const verifyButton = getByText("Verify OTP");

    fireEvent.changeText(input, "12345");
    fireEvent.press(verifyButton);
    expect(getByText("Please enter a valid 10-digit mobile number")).toBeTruthy();
  });

  it("shows error for mobile number with invalid starting digit", () => {
    const { getByPlaceholderText, getByText } = render(<MobileScreen />);

    const input = getByPlaceholderText("1234567890");
    const verifyButton = getByText("Verify OTP");

    fireEvent.changeText(input, "0123456789");
    fireEvent.press(verifyButton);
    expect(getByText("Please enter a valid mobile number starting with 6-9")).toBeTruthy();
  });

  it("accepts valid mobile numbers", () => {
    const { getByPlaceholderText, queryByText } = render(<MobileScreen />);

    const input = getByPlaceholderText("1234567890");
    fireEvent.changeText(input, "9123456789");
    
    expect(queryByText("Please enter your mobile number")).toBeNull();
    expect(queryByText("Please enter a valid 10-digit mobile number")).toBeNull();
    expect(queryByText("Please enter a valid mobile number starting with 6-9")).toBeNull();
  });

  it("filters non-numeric characters from input", () => {
    const { getByPlaceholderText } = render(<MobileScreen />);

    const input = getByPlaceholderText("1234567890");
    fireEvent.changeText(input, "9abc123def456");

    expect(input.props.value).toBe("9123456");
  });

  it("shows loading state during OTP verification", () => {
    const { getByPlaceholderText, getByText } = render(<MobileScreen />);

    const input = getByPlaceholderText("1234567890");
    fireEvent.changeText(input, "9123456789");

    const verifyButton = getByText("Verify OTP");
    fireEvent.press(verifyButton);

    expect(getByText("Sending OTP...")).toBeTruthy();
  });

  it("navigates to MobileOtp screen with correct parameters", async () => {
    const { getByPlaceholderText, getByText } = render(<MobileScreen />);

    const input = getByPlaceholderText("1234567890");
    fireEvent.changeText(input, "9123456789");

    const verifyButton = getByText("Verify OTP");
    fireEvent.press(verifyButton);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Navigating to OTP screen with:", "+919123456789");
      expect(mockNavigate).toHaveBeenCalledWith("MobileOtp", {
        mobileNumber: "+919123456789",
      });
    });
  });

  it("handles Terms of Service press", () => {
    const { getByText } = render(<MobileScreen />);

    const termsLink = getByText("Terms of Service");
    fireEvent.press(termsLink);

    expect(consoleSpy).toHaveBeenCalledWith("Terms of Service pressed");
  });

  it("handles Privacy Policy press", () => {
    const { getByText } = render(<MobileScreen />);

    const privacyLink = getByText("Privacy Policy");
    fireEvent.press(privacyLink);

    expect(consoleSpy).toHaveBeenCalledWith("Privacy Policy pressed");
  });

  it("handles country code selector press", () => {
    const { getByText } = render(<MobileScreen />);

    const countryCodeButton = getByText("+91");
    fireEvent.press(countryCodeButton);

    expect(consoleSpy).toHaveBeenCalledWith("Country code selector would open here");
  });

  it("has correct input properties", () => {
    const { getByPlaceholderText } = render(<MobileScreen />);

    const input = getByPlaceholderText("1234567890");

    expect(input.props.keyboardType).toBe("phone-pad");
    expect(input.props.autoCapitalize).toBe("none");
    expect(input.props.autoCorrect).toBe(false);
    expect(input.props.maxLength).toBe(10);
    expect(input.props.placeholderTextColor).toBe("#999");
  });

  it("formats phone number correctly for navigation", async () => {
    const { getByPlaceholderText, getByText } = render(<MobileScreen />);

    const input = getByPlaceholderText("1234567890");
    fireEvent.changeText(input, "9876543210");

    const verifyButton = getByText("Verify OTP");
    fireEvent.press(verifyButton);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("MobileOtp", {
        mobileNumber: "+919876543210",
      });
    });
  });

  it("validates input format and length correctly", () => {
    const { getByPlaceholderText, getByText } = render(<MobileScreen />);

    const input = getByPlaceholderText("1234567890");
    const verifyButton = getByText("Verify OTP");

    // Test that validation works for different scenarios
    const testCases = [
      { input: "123", expectedError: "Please enter a valid 10-digit mobile number" },
      { input: "1234567890", expectedError: "Please enter a valid mobile number starting with 6-9" },
      { input: "5123456789", expectedError: "Please enter a valid mobile number starting with 6-9" }
    ];

    testCases.forEach(({ input: testInput, expectedError }) => {
      fireEvent.changeText(input, testInput);
      fireEvent.press(verifyButton);
      expect(getByText(expectedError)).toBeTruthy();
    });
  });

  it("button shows correct state during loading", () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<MobileScreen />);

    const input = getByPlaceholderText("1234567890");
    fireEvent.changeText(input, "9123456789");

    const verifyButton = getByText("Verify OTP");
    fireEvent.press(verifyButton);

    // During loading, should show "Sending OTP..." instead of "Verify OTP"
    expect(getByText("Sending OTP...")).toBeTruthy();
    expect(queryByText("Verify OTP")).toBeNull();
  });
});
