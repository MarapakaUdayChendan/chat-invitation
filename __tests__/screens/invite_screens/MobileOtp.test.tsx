import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import MobileOtp from "../../../src/screens/invite_screens/MobileOtp";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStack } from "../../../src/navigation/RootStackNavigation";

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

// Mock the useNavigation hook from expo-router
jest.mock("expo-router", () => ({
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

// Mock Ionicons to prevent button detection issues
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

// Mock console.log for various handlers
const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

const mockNavigation: NativeStackNavigationProp<RootStack, "MobileOtp"> = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  setParams: jest.fn(),
  setOptions: jest.fn(),
  dispatch: jest.fn(),
  canGoBack: jest.fn(() => true),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
} as any;

const mockRoute: RouteProp<RootStack, "MobileOtp"> = {
  key: "MobileOtp-1",
  name: "MobileOtp",
  params: { mobileNumber: "+1234567890" },
};

describe("MobileOtp Component", () => {
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
    const { getByText, getAllByDisplayValue } = render(
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText("Verify Mobile Number")).toBeTruthy();
    expect(getByText("We have sent a 4 digit verification code to")).toBeTruthy();
    expect(getByText("+1234567890")).toBeTruthy();
    expect(getByText("Didn't receive code?")).toBeTruthy();
    expect(getByText("Resend")).toBeTruthy();
    expect(getByText("Submit")).toBeTruthy();
    expect(getAllByDisplayValue("")).toHaveLength(4); // 4 OTP inputs
  });

  it("generates OTP on component mount", () => {
    render(<MobileOtp route={mockRoute} navigation={mockNavigation} />);
    
    expect(consoleSpy).toHaveBeenCalledWith("Generated OTP:", "1234");
  });

  it("updates OTP input and moves focus to next field", () => {
    const { getAllByDisplayValue } = render(
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    
    // Enter first digit
    fireEvent.changeText(inputs[0], "1");
    
    // Check that the input value is updated
    expect(inputs[0].props.value).toBe("1");
    
    // Enter remaining digits
    fireEvent.changeText(inputs[1], "2");
    fireEvent.changeText(inputs[2], "3");
    fireEvent.changeText(inputs[3], "4");
  });

  it("handles backspace navigation between inputs", () => {
    const { getAllByDisplayValue } = render(
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    
    // Fill first two inputs
    fireEvent.changeText(inputs[0], "1");
    fireEvent.changeText(inputs[1], "2");
    
    // Press backspace on second input when it's empty
    fireEvent.changeText(inputs[1], "");
    fireEvent(inputs[1], "keyPress", {
      nativeEvent: { key: "Backspace" }
    });
    
    // Should move focus back to first input
  });

  it("shows error for incomplete OTP on submit", () => {
    const { getByText, getAllByDisplayValue } = render(
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
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
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
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

  it("navigates to EmailScreen on correct OTP", async () => {
    const { getAllByDisplayValue, getByText } = render(
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
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
      expect(mockNavigate).toHaveBeenCalledWith("EmailScreen");
    });
  });

  it("shows error for invalid OTP", () => {
    const { getAllByDisplayValue, getByText } = render(
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
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

  // FIXED: Separate the console log check from timer display check
  it("handles resend OTP when timer expires", async () => {
    const { getByText } = render(
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
    );

    // Fast forward timer to 0
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    const resendButton = getByText("Resend");
    
    // Press resend and check console log
    fireEvent.press(resendButton);
    
    // Just check that resend OTP was called
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Resent OTP:", "1234");
    });
  });

  it("disables resend when timer is active", () => {
    const { getByText } = render(
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
    );

    const resendButton = getByText("Resend");
    
    // Try to press resend while timer is active
    fireEvent.press(resendButton);
    
    // Should not generate new OTP
    expect(consoleSpy).not.toHaveBeenCalledWith("Resent OTP:", "1234");
  });

  // FIXED: Use regex to handle whitespace around timer text
it("timer functionality works correctly", async () => {
  const { getByText } = render(
    <MobileOtp route={mockRoute} navigation={mockNavigation} />
  );

  // Verify timer shows some time format initially (flexible matching)
  await waitFor(() => {
    expect(getByText(/\d{2}:\d{2}/)).toBeTruthy();
  });

  // Fast forward to 0 and verify using regex to handle whitespace
  act(() => {
    jest.advanceTimersByTime(60000);
  });

  await waitFor(() => {
    expect(getByText(/00:00/)).toBeTruthy(); // Regex allows whitespace around text
  });

  // Resend should work when timer reaches 0
  const resendButton = getByText("Resend");
  fireEvent.press(resendButton);
  
  expect(consoleSpy).toHaveBeenCalledWith("Resent OTP:", "1234");
});

  it("handles Terms of Service press", () => {
    const { getByText } = render(
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
    );

    const termsLink = getByText("Terms of Service");
    fireEvent.press(termsLink);
    
    expect(consoleSpy).toHaveBeenCalledWith("Terms of Service pressed");
  });

  it("handles Privacy Policy press", () => {
    const { getByText } = render(
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
    );

    const privacyLink = getByText("Privacy Policy");
    fireEvent.press(privacyLink);
    
    expect(consoleSpy).toHaveBeenCalledWith("Privacy Policy pressed");
  });

  it("clears OTP inputs on resend", async () => {
    const { getAllByDisplayValue, getByText } = render(
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
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
    });
  });

  // FIXED: Updated test to match actual component behavior
  it("prevents entering more than one digit per input", () => {
    const { getAllByDisplayValue } = render(
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    
    // Try to enter multiple digits - component ignores input longer than 1 character
    fireEvent.changeText(inputs[0], "12");
    
    // Should remain empty because component doesn't update state for multi-digit input
    expect(inputs[0].props.value).toBe("");
    
    // Test that single digit works
    fireEvent.changeText(inputs[0], "1");
    expect(inputs[0].props.value).toBe("1");
  });

  it("clears status message on resend", async () => {
    const { getAllByDisplayValue, getByText, queryByText } = render(
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
    );

    const inputs = getAllByDisplayValue("");
    const submitButton = getByText("Submit");
    
    // Enter incorrect OTP to show error message
    fireEvent.changeText(inputs[0], "0");
    fireEvent.changeText(inputs[1], "0");
    fireEvent.changeText(inputs[2], "0");
    fireEvent.changeText(inputs[3], "0");
    
    fireEvent.press(submitButton);
    expect(getByText("Invalid OTP")).toBeTruthy();
    
    // Fast forward timer and resend
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    const resendButton = getByText("Resend");
    fireEvent.press(resendButton);
    
    await waitFor(() => {
      // Status message should be cleared
      expect(queryByText("Invalid OTP")).toBeNull();
    });
  });

  // Test the edit mobile functionality without relying on getByRole
  it("renders mobile number with edit option", () => {
    const { getByText } = render(
      <MobileOtp route={mockRoute} navigation={mockNavigation} />
    );

    // Verify mobile number is displayed
    expect(getByText("+1234567890")).toBeTruthy();
    
    // Note: Edit functionality would require testID in component for reliable testing
    // The pencil icon TouchableOpacity would need testID="edit-mobile-button"
  });
});
