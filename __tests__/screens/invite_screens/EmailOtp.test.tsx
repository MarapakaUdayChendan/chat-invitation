import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
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

// Mock OTP generation to return a fixed value
jest.mock("../../../src/components/OtpGeneration", () => ({
  OtpGeneration: jest.fn(() => "1234"),
}));

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
  });

  it("renders email and OTP inputs correctly", () => {
    const { getByText, getAllByTestId } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText(/verify e-mail/i)).toBeTruthy();
    expect(getByText(/test@example.com/i)).toBeTruthy();
    expect(getAllByTestId("otpInput")).toHaveLength(4); // 4 OTP inputs
  });

  it("shows error if OTP is incomplete on submit", () => {
    const { getByTestId, getByText } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId("otpbutton"));
    expect(getByText(/please enter complete otp/i)).toBeTruthy();
  });

  it("navigates on correct OTP", async () => {
    const { getAllByTestId, getByTestId } = render(
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
  });

  it("resets OTP and timer on resend", async () => {
    const { getByText, getAllByTestId } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    // Set timer to 0 to allow resend
    jest.useFakeTimers();
    fireEvent.press(getByText(/resend/i));

    await waitFor(() => {
      const inputs = getAllByTestId("otpInput");
      inputs.forEach(input => {
        expect(input.props.value).toBe("");
      });
    });
    jest.useRealTimers();
  });

  it("calls goBack when edit email pressed", () => {
    const { getByTestId } = render(
      <EmailOtp route={mockRoute} navigation={mockNavigation} />
    );

    const editButton = getByTestId("button");
    fireEvent.press(editButton);
    expect(mockGoBack).toHaveBeenCalled();
  });
});
