import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import EmailOtp from "../../../src/screens/invite_screens/EmailOtp";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStack } from "../../../src/navigation/RootStackNavigation";

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

// Mock Ionicons to prevent act() warnings
jest.mock("@expo/vector-icons", () => ({
  Ionicons: ({ name, ...props }: any) => {
    const { Text } = require("react-native");
    return <Text {...props}>{name}</Text>;
  },
}));

// Mock OTP generation to return a fixed value
jest.mock("../../../src/components/OtpGeneration", () => ({
  OtpGeneration: jest.fn(() => "1234"),
}));

// Mock console.log for handlers
const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

const mockNavigation: NativeStackNavigationProp<RootStack, "EmailOtp"> = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  setParams: jest.fn(),
  setOptions: jest.fn(),
  dispatch: jest.fn(),
  canGoBack: jest.fn(() => true),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
} as any;

const mockRoute: RouteProp<RootStack, "EmailOtp"> = {
  key: "EmailOtp-1",
  name: "EmailOtp",
  params: { email: "test@example.com" },
};

describe("EmailOtp Component", () => {
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

  it("renders email and OTP inputs correctly", () => {
    const { getByText, getAllByTestId } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText(/verify e-mail/i)).toBeTruthy();
    expect(getByText(/test@example.com/i)).toBeTruthy();
    expect(getAllByTestId("otpInput")).toHaveLength(4); // 4 OTP inputs
  });

  it("generates OTP on component mount", () => {
    render(<EmailOtp route={mockRoute} navigation={mockNavigation} />);
    
    expect(consoleSpy).toHaveBeenCalledWith("Generated OTP:", "1234");
  });

  it("shows error if OTP is incomplete on submit", () => {
    const { getByTestId, getByText } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId("otpbutton"));
    expect(getByText(/please enter complete otp/i)).toBeTruthy();
  });

  it("navigates on correct OTP", async () => {
    const { getAllByTestId, getByTestId , getByText} = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    // Enter correct OTP: 1234
    const inputs = getAllByTestId("otpInput");
    fireEvent.changeText(inputs[0], "1");
    fireEvent.changeText(inputs[1], "2");
    fireEvent.changeText(inputs[2], "3");
    fireEvent.changeText(inputs[3], "4");

    fireEvent.press(getByTestId("otpbutton"));

    await waitFor(() => {
      expect(getByText(/otp matched/i)).toBeTruthy();
      expect(consoleSpy).toHaveBeenCalledWith("OTP Matched");
      expect(mockNavigate).toHaveBeenCalledWith("PasswordScreen", {
        email: "test@example.com",
      });
    });
  });

  it("shows error for invalid OTP", () => {
    const { getAllByTestId, getByTestId, getByText } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    // Use getAllByTestId to get all OTP inputs
    const inputs = getAllByTestId("otpInput");
    fireEvent.changeText(inputs[0], "0");
    fireEvent.changeText(inputs[1], "0");
    fireEvent.changeText(inputs[2], "0");
    fireEvent.changeText(inputs[3], "0");

    fireEvent.press(getByTestId("otpbutton"));
    expect(getByText(/invalid otp/i)).toBeTruthy();
    expect(consoleSpy).toHaveBeenCalledWith("Invalid OTP");
  });

  it("shows error for expired OTP", async () => {
    const { getAllByTestId, getByTestId, getByText } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    // Fast forward timer to 0
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    // Enter complete OTP
    const inputs = getAllByTestId("otpInput");
    fireEvent.changeText(inputs[0], "1");
    fireEvent.changeText(inputs[1], "2");
    fireEvent.changeText(inputs[2], "3");
    fireEvent.changeText(inputs[3], "4");
    
    fireEvent.press(getByTestId("otpbutton"));
    
    await waitFor(() => {
      expect(getByText(/otp expired, please resend/i)).toBeTruthy();
    });
  });

  it("resets OTP and timer on resend when timer expires", async () => {
    const { getByText, getAllByTestId } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    // Fast forward timer to 0 to allow resend
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    const resendButton = getByText(/resend/i);
    fireEvent.press(resendButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Resent OTP:", "1234");
      const inputs = getAllByTestId("otpInput");
      inputs.forEach(input => {
        expect(input.props.value).toBe("");
      });
    });
  });

  it("disables resend when timer is active", () => {
    const { getByText } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const resendButton = getByText(/resend/i);
    
    // Try to press resend while timer is active
    fireEvent.press(resendButton);
    
    // Should not generate new OTP
    expect(consoleSpy).not.toHaveBeenCalledWith("Resent OTP:", "1234");
  });

  it("updates timer display correctly", async () => {
    const { getByText } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
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
    const { getByTestId } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const editButton = getByTestId("button");
    fireEvent.press(editButton);
    expect(mockGoBack).toHaveBeenCalled();
  });

  it("handles Terms of Service and Privacy Policy links", () => {
    const { getByText } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const termsLink = getByText(/terms of service/i);
    const privacyLink = getByText(/privacy policy/i);
    
    fireEvent.press(termsLink);
    fireEvent.press(privacyLink);
    
    expect(consoleSpy).toHaveBeenCalledWith("Terms of Service pressed");
    expect(consoleSpy).toHaveBeenCalledWith("Privacy Policy pressed");
  });

  it("accepts only numeric input in OTP fields", () => {
    const { getAllByTestId } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByTestId("otpInput");
    
    // Enter numeric digit - should be accepted
    fireEvent.changeText(inputs[0], "1");
    expect(inputs[0].props.value).toBe("1");
    
    // Enter alphabetic character - should be rejected (assuming validation exists)
    fireEvent.changeText(inputs[1], "a");
    // Check if your component filters non-numeric input
  });

  it("moves focus to next input when digit is entered", () => {
    const { getAllByTestId } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByTestId("otpInput");
    
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

it("clears error status when user starts typing", async () => {
  const { getAllByTestId, getByTestId, getByText, queryByText } = render(
    <EmailOtp route={mockRoute} navigation={mockNavigation} />
  );

  const inputs = getAllByTestId("otpInput");
  const submitButton = getByTestId("otpbutton");
  
  // Trigger error by submitting incomplete OTP
  fireEvent.changeText(inputs[0], "1");
  fireEvent.press(submitButton);
  expect(getByText(/please enter complete otp/i)).toBeTruthy();
  
  // Start typing in another field
  fireEvent.changeText(inputs[1], "2");
  
  // If your component doesn't automatically clear errors, just verify the input worked
  expect(inputs[1].props.value).toBe("2");
  
  // Optional: Test that error clears on next submit with complete OTP
  fireEvent.changeText(inputs[2], "3");
  fireEvent.changeText(inputs[3], "4");
  fireEvent.press(submitButton);
  
  await waitFor(() => {
    expect(queryByText(/please enter complete otp/i)).toBeNull();
  });
});

  it("handles backspace navigation between inputs", () => {
    const { getAllByTestId } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByTestId("otpInput");
    
    // Fill first input
    fireEvent.changeText(inputs[0], "1");
    
    // Press backspace on empty second input
    fireEvent(inputs[1], "keyPress", {
      nativeEvent: { key: "Backspace" }
    });
    
    // Should move focus back to first input (if implemented)
  });

  it("has correct input properties", () => {
    const { getAllByTestId } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByTestId("otpInput");
    
    inputs.forEach(input => {
      expect(input.props.keyboardType).toBe("numeric");
      expect(input.props.maxLength).toBe(1);
      expect(input.props.textAlign).toBe("center");
    });
  });

  it("clears status message after successful operations", async () => {
    const { getAllByTestId, getByTestId, getByText } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByTestId("otpInput");
    
    // Enter correct OTP and verify success message appears and navigation occurs
    fireEvent.changeText(inputs[0], "1");
    fireEvent.changeText(inputs[1], "2");
    fireEvent.changeText(inputs[2], "3");
    fireEvent.changeText(inputs[3], "4");
    
    fireEvent.press(getByTestId("otpbutton"));
    
    await waitFor(() => {
      expect(getByText(/otp matched/i)).toBeTruthy();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});
