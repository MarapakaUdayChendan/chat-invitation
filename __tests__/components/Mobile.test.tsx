import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Mobile from "../../src/components/Mobile";
import { OtpGeneration } from '../../src/components/OtpGeneration';
import { useNavigation } from 'expo-router';

jest.mock('../../src/components/OtpGeneration', () => ({
  OtpGeneration: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useNavigation: jest.fn(),
}));

describe('Mobile', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (OtpGeneration as jest.Mock).mockReturnValue('1234');
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    jest.clearAllMocks();
  });

  it('renders initial UI', () => {
    const { getByPlaceholderText, getByText, queryByPlaceholderText } = render(<Mobile />);
    expect(getByPlaceholderText(/mobile number/i)).toBeTruthy();
    expect(getByText(/send otp/i)).toBeTruthy();
    expect(queryByPlaceholderText(/enter otp/i)).toBeNull();
  });

  it('shows error for invalid mobile number', () => {
    const { getByText, getByPlaceholderText } = render(<Mobile />);
    fireEvent.changeText(getByPlaceholderText(/mobile number/i), '123');
    fireEvent.press(getByText(/send otp/i));
    expect(getByText(/enter a valid 10-digit mobile number/i)).toBeTruthy();
  });

  it('shows OTP field after sending OTP', () => {
    const { getByPlaceholderText, getByText } = render(<Mobile />);
    fireEvent.changeText(getByPlaceholderText(/mobile number/i), '9876543210');
    fireEvent.press(getByText(/send otp/i));
    expect(OtpGeneration).toHaveBeenCalled();
    expect(getByPlaceholderText(/enter otp/i)).toBeTruthy();
  });

  it('navigates on correct OTP', async () => {
    const { getByPlaceholderText, getByText } = render(<Mobile />);
    fireEvent.changeText(getByPlaceholderText(/mobile number/i), '9876543210');
    fireEvent.press(getByText(/send otp/i));
    fireEvent.changeText(getByPlaceholderText(/enter otp/i), '1234');
    fireEvent.press(getByText(/submit/i));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('ContactHome'));
  });

  it('shows error on wrong OTP', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<Mobile />);
    fireEvent.changeText(getByPlaceholderText(/mobile number/i), '9876543210');
    fireEvent.press(getByText(/send otp/i));
    fireEvent.changeText(getByPlaceholderText(/enter otp/i), '9999');
    fireEvent.press(getByText(/submit/i));
    expect(await findByText(/invalid otp/i)).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
