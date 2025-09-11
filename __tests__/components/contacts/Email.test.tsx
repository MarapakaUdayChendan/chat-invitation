import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Email from '../../../src/components/Email';
import { useNavigation } from '@react-navigation/native';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe('Email Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all inputs and buttons correctly', () => {
    const { getByPlaceholderText, getByTestId } = render(<Email />);

    expect(getByPlaceholderText(/email address/i)).toBeTruthy();
    expect(getByPlaceholderText(/password/i)).toBeTruthy();
    expect(getByTestId('signInButton')).toBeTruthy();
    expect(getByTestId('otpButton')).toBeTruthy();
    expect(getByTestId('forgotButton')).toBeTruthy();
  });

it('shows error for empty email and password on login', async () => {
  const { getByPlaceholderText, findByText } = render(<Email />);

  const emailInput = getByPlaceholderText(/email address/i);
  const passwordInput = getByPlaceholderText(/password/i);

  // Simulate user leaving the fields empty (blur triggers touched + error)
fireEvent(emailInput, 'blur');
fireEvent(passwordInput, 'blur');

  // Check errors
  expect(await findByText(/email is required/i)).toBeTruthy();
  expect(await findByText(/password is required/i)).toBeTruthy();
  expect(mockNavigate).not.toHaveBeenCalled();
});

  it('shows error for invalid email format', async () => {
    const { getByPlaceholderText, getByTestId, findByText } = render(<Email />);
    fireEvent.changeText(getByPlaceholderText(/email address/i), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText(/password/i), '123456');

    fireEvent.press(getByTestId('signInButton'));

    expect(await findByText(/please enter a valid email address/i)).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('disables login button if email or password is empty', () => {
    const { getByTestId } = render(<Email />);
    const loginBtn = getByTestId('signInButton');
    const otpBtn = getByTestId('otpButton');

    expect(loginBtn.props.accessibilityState?.disabled).toBe(true);
    expect(otpBtn.props.accessibilityState?.disabled).toBe(true);
  });

  it('navigates on valid login', async () => {
    const { getByPlaceholderText, getByTestId } = render(<Email />);
    fireEvent.changeText(getByPlaceholderText(/email address/i), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText(/password/i), '123456');

    fireEvent.press(getByTestId('signInButton'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('ContactHome');
    });
  });

  it('navigates to OTP screen with valid email', async () => {
    const { getByPlaceholderText, getByTestId } = render(<Email />);
    fireEvent.changeText(getByPlaceholderText(/email address/i), 'otp@example.com');

    fireEvent.press(getByTestId('otpButton'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('LoginEmailOtp', {
        email: 'otp@example.com',
      });
    });
  });

  it('does not navigate to OTP screen with invalid email', async () => {
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
