import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ContactPermission from '../../src/components/contacts/ContactPermission';

describe('ContactPermission', () => {
  it('renders default error text when no error', () => {
    const { getByText } = render(<ContactPermission error={null} onRetry={() => {}} />);
    expect(getByText(/permission required/i)).toBeTruthy();
  });

  it('renders provided error text', () => {
    const errorMessage = 'Contacts permission denied';
    const { getByText } = render(<ContactPermission error={errorMessage} onRetry={() => {}} />);
    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('triggers onRetry on button press', () => {
    const onRetryMock = jest.fn();
    const { getByText } = render(<ContactPermission error={null} onRetry={onRetryMock} />);
    fireEvent.press(getByText(/grant permission/i));
    expect(onRetryMock).toHaveBeenCalled();
  });
});
