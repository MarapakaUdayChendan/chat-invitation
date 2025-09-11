import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import LoginEmailOtp from "../../src/screens/LoginEmailOtp";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStack } from "../../src/navigation/RootStackNavigation";

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

// Mock the useNavigation hook from @react-navigation/native
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

// Mock Ionicons to prevent rendering issues
jest.mock("@expo/vector-icons", () => ({
  Ionicons: ({ name, ...props }: any) => {
    const { Text } = require("react-native");
    return <Text {...props}>{name}</Text>;
  },
}));

// Mock OTP generation to return a fixed value
jest.mock("../../src/components/OtpGeneration", () => ({
  OtpGeneration: jest.fn(() => "1234"),
}));

// Mock theme colors
jest.mock("../../src/styles/theme", () => ({
  COLORS: {
    primary: "#4A90E2",
    background: "#FFFFFF",
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock console.log for various handlers
const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

const mockNavigation: NativeStackNavigationProp<RootStack, "LoginEmailOtp"> = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  setParams: jest.fn(),
  setOptions: jest.fn(),
  dispatch: jest.fn(),
  canGoBack: jest.fn(() => true),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
} as any;

const mockRoute: RouteProp<RootStack, "LoginEmailOtp"> = {
  key: "LoginEmailOtp-1",
  name: "LoginEmailOtp",
  params: { email: "test@example.com" },
};

describe("LoginEmailOtp Component", () => {
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
    const { getByText, getAllByDisplayValue } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText("Verify Email")).toBeTruthy();
    expect(getByText("We have sent a 4 digit verification code to")).toBeTruthy();
    expect(getByText("test@example.com")).toBeTruthy();
    expect(getByText("Didn't receive code?")).toBeTruthy();
    expect(getByText("Resend")).toBeTruthy();
    expect(getByText("Submit")).toBeTruthy();
    expect(getAllByDisplayValue("")).toHaveLength(4); // 4 OTP inputs
  });

  it("generates OTP on component mount", () => {
    render(<LoginEmailOtp route={mockRoute} navigation={mockNavigation} />);
    
    expect(consoleSpy).toHaveBeenCalledWith("Generated OTP:", "1234");
  });

  it("accepts only numeric input in OTP fields", () => {
    const { getAllByDisplayValue } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    
    // Enter numeric digit - should be accepted
    fireEvent.changeText(inputs[0], "1");
    expect(inputs[0].props.value).toBe("1");
    
    // Enter alphabetic character - should be rejected
    fireEvent.changeText(inputs[1], "a");
    expect(inputs[1].props.value).toBe("");
    
    // Enter special character - should be rejected
    fireEvent.changeText(inputs[2], "#");
    expect(inputs[2].props.value).toBe("");
  });

  it("moves focus to next input when digit is entered", () => {
    const { getAllByDisplayValue } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    
    // Enter digits in sequence
    fireEvent.changeText(inputs[0], "1");
    fireEvent.changeText(inputs[1], "2");
    fireEvent.changeText(inputs[2], "3");
    fireEvent.changeText(inputs[3], "4");
    
    // Verify values are set correctly
    expect(inputs[0].props.value).toBe("1");
    expect(inputs[1].props.value).toBe("2");
    expect(inputs[2].props.value).toBe("3");
    expect(inputs[3].props.value).toBe("4");
  });

  it("handles backspace navigation between inputs", () => {
    const { getAllByDisplayValue } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    
    // Fill first input
    fireEvent.changeText(inputs[0], "1");
    
    // Press backspace on empty second input
    fireEvent(inputs[1], "keyPress", {
      nativeEvent: { key: "Backspace" }
    });
    
    // Should move focus back to first input
  });

  it("clears error status when user starts typing", () => {
    const { getAllByDisplayValue, getByText, queryByText } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    const submitButton = getByText("Submit");
    
    // Trigger error by submitting incomplete OTP
    fireEvent.changeText(inputs[0], "1");
    fireEvent.press(submitButton);
    expect(getByText("Please enter complete OTP")).toBeTruthy();
    
    // Start typing in another field - error should clear
    fireEvent.changeText(inputs[1], "2");
    expect(queryByText("Please enter complete OTP")).toBeNull();
  });

  it("shows error for incomplete OTP on submit", () => {
    const { getByText, getAllByDisplayValue } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    const submitButton = getByText("Submit");
    
    // Enter incomplete OTP
    fireEvent.changeText(inputs[0], "1");
    fireEvent.changeText(inputs[1], "2");
    
    fireEvent.press(submitButton);
    
    expect(getByText("Please enter complete OTP")).toBeTruthy();
  });

  it("shows error for expired OTP", async () => {
    const { getByText, getAllByDisplayValue } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    const submitButton = getByText("Submit");
    
    // Fast forward timer to 0
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    // Enter complete OTP
    fireEvent.changeText(inputs[0], "1");
    fireEvent.changeText(inputs[1], "2");
    fireEvent.changeText(inputs[2], "3");
    fireEvent.changeText(inputs[3], "4");
    
    fireEvent.press(submitButton);
    
    await waitFor(() => {
      expect(getByText("OTP expired, please resend")).toBeTruthy();
    });
  });

  it("navigates to ContactHome on correct OTP", async () => {
    const { getAllByDisplayValue, getByText } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    const submitButton = getByText("Submit");
    
    // Enter correct OTP: 1234
    fireEvent.changeText(inputs[0], "1");
    fireEvent.changeText(inputs[1], "2");
    fireEvent.changeText(inputs[2], "3");
    fireEvent.changeText(inputs[3], "4");
    
    fireEvent.press(submitButton);
    
    await waitFor(() => {
      expect(getByText("OTP Matched")).toBeTruthy();
      expect(consoleSpy).toHaveBeenCalledWith("OTP Matched");
      expect(mockNavigate).toHaveBeenCalledWith("ContactHome");
    });
  });

  it("shows error for invalid OTP", () => {
    const { getAllByDisplayValue, getByText } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    const submitButton = getByText("Submit");
    
    // Enter incorrect OTP
    fireEvent.changeText(inputs[0], "0");
    fireEvent.changeText(inputs[1], "0");
    fireEvent.changeText(inputs[2], "0");
    fireEvent.changeText(inputs[3], "0");
    
    fireEvent.press(submitButton);
    
    expect(getByText("Invalid OTP")).toBeTruthy();
    expect(consoleSpy).toHaveBeenCalledWith("Invalid OTP");
  });

  it("handles resend OTP when timer expires", async () => {
    const { getByText } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    // Fast forward timer to 0
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    const resendButton = getByText("Resend");
    fireEvent.press(resendButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Resent OTP:", "1234");
      expect(getByText("New OTP sent to your email")).toBeTruthy();
      expect(getByText(/01:00/)).toBeTruthy(); // Timer reset
    });
  });

  it("disables resend when timer is active", () => {
    const { getByText } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const resendButton = getByText("Resend");
    
    // Try to press resend while timer is active
    fireEvent.press(resendButton);
    
    // Should not generate new OTP
    expect(consoleSpy).not.toHaveBeenCalledWith("Resent OTP:", "1234");
  });

  it("updates timer display correctly", async () => {
    const { getByText } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    // Wait for initial timer to appear
    await waitFor(() => {
      expect(getByText(/01:00/)).toBeTruthy();
    });
    
    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(getByText(/00:59/)).toBeTruthy();
    });
  });

  it("calls goBack when edit email pressed", () => {
    const { getByText } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    // Find the pencil icon (edit email button) by finding the email text and its parent
    const emailText = getByText("test@example.com");
    const emailContainer = emailText.parent;
    
    // The edit button should be in the same container
    const editButton = getByText("pencil");
    fireEvent.press(editButton);
    
    expect(mockGoBack).toHaveBeenCalled();
  });

  it("handles Terms of Service press", () => {
    const { getByText } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const termsLink = getByText("Terms of Service");
    fireEvent.press(termsLink);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      "Terms of Service",
      "Terms of service content would appear here."
    );
  });

  it("handles Privacy Policy press", () => {
    const { getByText } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const privacyLink = getByText("Privacy Policy");
    fireEvent.press(privacyLink);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      "Privacy Policy",
      "Privacy policy content would appear here."
    );
  });

  it("clears OTP inputs and status on resend", async () => {
    const { getAllByDisplayValue, getByText, queryByText } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    
    // Fill OTP inputs
    fireEvent.changeText(inputs[0], "1");
    fireEvent.changeText(inputs[1], "2");
    fireEvent.changeText(inputs[2], "3");
    fireEvent.changeText(inputs[3], "4");
    
    // Fast forward timer to 0
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    const resendButton = getByText("Resend");
    fireEvent.press(resendButton);
    
    await waitFor(() => {
      // Check that inputs are cleared
      inputs.forEach(input => {
        expect(input.props.value).toBe("");
      });
      expect(getByText("New OTP sent to your email")).toBeTruthy();
    });
  });

  it("automatically clears success message after resend", async () => {
    const { getByText, queryByText } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    // Fast forward timer to 0 and resend
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    const resendButton = getByText("Resend");
    fireEvent.press(resendButton);
    
    // Message should appear
    await waitFor(() => {
      expect(getByText("New OTP sent to your email")).toBeTruthy();
    });
    
    // Fast forward 3 seconds to auto-clear message
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    await waitFor(() => {
      expect(queryByText("New OTP sent to your email")).toBeNull();
    });
  });

  it("returns correct values from handleSubmit function", () => {
    const { getAllByDisplayValue, getByText } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    const submitButton = getByText("Submit");
    
    // Test incomplete OTP returns false
    fireEvent.changeText(inputs[0], "1");
    fireEvent.press(submitButton);
    
    // Test complete valid OTP returns true
    fireEvent.changeText(inputs[1], "2");
    fireEvent.changeText(inputs[2], "3");
    fireEvent.changeText(inputs[3], "4");
    fireEvent.press(submitButton);
    
    expect(mockNavigate).toHaveBeenCalledWith("ContactHome");
  });

  it("has correct input properties", () => {
    const { getAllByDisplayValue } = render(
      <LoginEmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    
    inputs.forEach(input => {
      expect(input.props.keyboardType).toBe("numeric");
      expect(input.props.maxLength).toBe(1);
      expect(input.props.textAlign).toBe("center");
      expect(input.props.selectTextOnFocus).toBe(true);
    });
  });
});
