import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Email from '../../../src/components/Email';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe('Email', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders inputs and buttons', () => {
    const { getByPlaceholderText, getByTestId } = render(<Email />);
    expect(getByPlaceholderText(/email address/i)).toBeTruthy();
    expect(getByPlaceholderText(/password/i)).toBeTruthy();
    expect(getByTestId('signInButton')).toBeTruthy();
    expect(getByTestId('otpButton')).toBeTruthy();
    expect(getByTestId('forgotButton')).toBeTruthy();
  });

  it('shows errors for empty email and password on blur', async () => {
    const { getByPlaceholderText, findByText } = render(<Email />);
    fireEvent(getByPlaceholderText(/email address/i), 'blur');
    fireEvent(getByPlaceholderText(/password/i), 'blur');
    expect(await findByText(/email is required/i)).toBeTruthy();
    expect(await findByText(/password is required/i)).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows error for invalid email format on login', async () => {
    const { getByPlaceholderText, getByTestId, findByText } = render(<Email />);
    fireEvent.changeText(getByPlaceholderText(/email address/i), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText(/password/i), '123456');
    fireEvent.press(getByTestId('signInButton'));
    expect(await findByText(/please enter a valid email address/i)).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('disables login and OTP buttons initially', () => {
    const { getByTestId } = render(<Email />);
    expect(getByTestId('signInButton').props.accessibilityState?.disabled).toBe(true);
    expect(getByTestId('otpButton').props.accessibilityState?.disabled).toBe(true);
  });

  it('navigates to ContactHome on valid login', async () => {
    const { getByPlaceholderText, getByTestId } = render(<Email />);
    fireEvent.changeText(getByPlaceholderText(/email address/i), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText(/password/i), '123456');
    fireEvent.press(getByTestId('signInButton'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('ContactHome');
    });
  });

  it('navigates to LoginEmailOtp with valid email', async () => {
    const { getByPlaceholderText, getByTestId } = render(<Email />);
    fireEvent.changeText(getByPlaceholderText(/email address/i), 'otp@example.com');
    fireEvent.press(getByTestId('otpButton'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('LoginEmailOtp', { email: 'otp@example.com' });
    });
  });

  it('does not navigate to OTP screen on invalid email', async () => {
    const { getByPlaceholderText, getByTestId, findByText } = render(<Email />);
    fireEvent.changeText(getByPlaceholderText(/email address/i), 'invalid-email');
    fireEvent.press(getByTestId('otpButton'));
    expect(await findByText(/please enter a valid email address/i)).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to forgot password screen', () => {
    const { getByTestId } = render(<Email />);
    fireEvent.press(getByTestId('forgotButton'));
    expect(mockNavigate).toHaveBeenCalledWith('ForgotPasswordConfirmation');
  });
});
