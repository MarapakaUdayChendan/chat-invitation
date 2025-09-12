import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Email from '../../src/components/Email';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Email Component - Complete Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    it('renders all UI elements correctly', () => {
      const { getByTestId, getByText } = render(<Email />);
      
      expect(getByText("Welcome Back")).toBeTruthy();
      expect(getByText("Sign in to continue")).toBeTruthy();
      expect(getByTestId("email-input")).toBeTruthy();
      expect(getByTestId("password-input")).toBeTruthy();
      expect(getByTestId("signInButton")).toBeTruthy();
      expect(getByTestId("otpButton")).toBeTruthy();
      expect(getByTestId("forgotButton")).toBeTruthy();
      expect(getByText("Privacy Policy")).toBeTruthy();
    });
  });

  describe('Form Input Tests', () => {
    it('updates email field value correctly', () => {
      const { getByTestId } = render(<Email />);
      const emailInput = getByTestId("email-input");
      
      fireEvent.changeText(emailInput, 'test@example.com');
      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('updates password field value correctly', () => {
      const { getByTestId } = render(<Email />);
      const passwordInput = getByTestId("password-input");
      
      fireEvent.changeText(passwordInput, 'password123');
      expect(passwordInput.props.value).toBe('password123');
    });
  });

  describe('Email Validation Tests', () => {
    it('shows error for empty email on blur', async () => {
      const { getByTestId, getByText } = render(<Email />);
      const emailInput = getByTestId("email-input");
      
      fireEvent(emailInput, 'blur');
      
      await waitFor(() => {
        expect(getByText("Email is required")).toBeTruthy();
      });
    });

    it('shows error for invalid email format on blur', async () => {
      const { getByTestId, getByText } = render(<Email />);
      const emailInput = getByTestId("email-input");
      
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent(emailInput, 'blur');
      
      await waitFor(() => {
        expect(getByText("Please enter a valid email address")).toBeTruthy();
      });
    });

    it('clears email error when valid email is entered after being touched', async () => {
      const { getByTestId, getByText, queryByText } = render(<Email />);
      const emailInput = getByTestId("email-input");
      
      // First create an error by blurring empty field
      fireEvent(emailInput, 'blur');
      await waitFor(() => {
        expect(getByText("Email is required")).toBeTruthy();
      });
      
      // Then enter valid email - this should clear the error
      fireEvent.changeText(emailInput, 'test@example.com');
      
      await waitFor(() => {
        expect(queryByText("Email is required")).toBeNull();
      });
    });
  });

  describe('Password Validation Tests', () => {
    it('shows error for empty password on blur', async () => {
      const { getByTestId, getByText } = render(<Email />);
      const passwordInput = getByTestId("password-input");
      
      fireEvent(passwordInput, 'blur');
      
      await waitFor(() => {
        expect(getByText("Password is required")).toBeTruthy();
      });
    });

    it('shows error for short password on blur', async () => {
      const { getByTestId, getByText } = render(<Email />);
      const passwordInput = getByTestId("password-input");
      
      fireEvent.changeText(passwordInput, '123');
      fireEvent(passwordInput, 'blur');
      
      await waitFor(() => {
        expect(getByText("Password must be at least 6 characters")).toBeTruthy();
      });
    });
  });

  describe('Form Submission Tests', () => {

    it('submits successfully with valid credentials', async () => {
      const { getByTestId } = render(<Email />);
      const emailInput = getByTestId("email-input");
      const passwordInput = getByTestId("password-input");
      const loginButton = getByTestId("signInButton");
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'validpassword');
      fireEvent.press(loginButton);
      
      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith("Login success:", {
          email: 'test@example.com',
          password: 'validpassword'
        });
        expect(mockNavigate).toHaveBeenCalledWith("ContactHome");
      });
    });
  });

  describe('OTP Login Tests', () => {
    it('navigates to OTP screen with valid email', async () => {
      const { getByTestId } = render(<Email />);
      const emailInput = getByTestId("email-input");
      const otpButton = getByTestId("otpButton");
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.press(otpButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("LoginEmailOtp", {
          email: 'test@example.com'
        });
      });
    });

    it('shows error and does not navigate with invalid email for OTP', async () => {
      const { getByTestId, getByText } = render(<Email />);
      const emailInput = getByTestId("email-input");
      const otpButton = getByTestId("otpButton");
      
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.press(otpButton);
      
      await waitFor(() => {
        expect(getByText("Please enter a valid email address")).toBeTruthy();
      });
      
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Button State Tests', () => {
    it('disables login button when form is invalid', () => {
      const { getByTestId } = render(<Email />);
      const loginButton = getByTestId("signInButton");
      
      expect(loginButton.props.accessibilityState?.disabled).toBeTruthy();
    });

    it('enables login button when form is valid', () => {
      const { getByTestId } = render(<Email />);
      const emailInput = getByTestId("email-input");
      const passwordInput = getByTestId("password-input");
      const loginButton = getByTestId("signInButton");
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'validpassword');
      
      expect(loginButton.props.accessibilityState?.disabled).toBeFalsy();
    });

    it('disables OTP button when email is invalid', () => {
      const { getByTestId } = render(<Email />);
      const otpButton = getByTestId("otpButton");
      
      expect(otpButton.props.accessibilityState?.disabled).toBeTruthy();
    });

    it('enables OTP button when email is valid', () => {
      const { getByTestId } = render(<Email />);
      const emailInput = getByTestId("email-input");
      const otpButton = getByTestId("otpButton");
      
      fireEvent.changeText(emailInput, 'test@example.com');
      
      expect(otpButton.props.accessibilityState?.disabled).toBeFalsy();
    });
  });

  describe('Navigation Tests', () => {
    it('navigates to forgot password screen', () => {
      const { getByTestId } = render(<Email />);
      const forgotButton = getByTestId("forgotButton");
      
      fireEvent.press(forgotButton);
      
      expect(mockNavigate).toHaveBeenCalledWith("ForgotPasswordConfirmation");
    });
  });

  describe('Input Properties Tests', () => {
    it('has correct input properties', () => {
      const { getByTestId } = render(<Email />);
      
      const emailInput = getByTestId("email-input");
      const passwordInput = getByTestId("password-input");
      
      expect(emailInput.props.keyboardType).toBe("email-address");
      expect(emailInput.props.autoCapitalize).toBe("none");
      expect(emailInput.props.autoCorrect).toBe(false);
      expect(emailInput.props.returnKeyType).toBe("next");
      
      expect(passwordInput.props.autoCapitalize).toBe("none");
      expect(passwordInput.props.secureTextEntry).toBe(true);
      expect(passwordInput.props.returnKeyType).toBe("done");
    });
  });

  describe('Edge Cases', () => {
    it('handles password submit editing', async () => {
      const { getByTestId } = render(<Email />);
      const emailInput = getByTestId("email-input");
      const passwordInput = getByTestId("password-input");
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'validpassword');
      fireEvent(passwordInput, 'submitEditing');
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("ContactHome");
      });
    });

    it('validates form with mixed valid/invalid states', async () => {
      const { getByTestId, getByText } = render(<Email />);
      const emailInput = getByTestId("email-input");
      const passwordInput = getByTestId("password-input");
      const loginButton = getByTestId("signInButton");
      
      // Valid email, invalid password
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, '123');
      fireEvent.press(loginButton);
      
      await waitFor(() => {
        expect(getByText("Password must be at least 6 characters")).toBeTruthy();
      });
      
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
