import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ContactPermission from '../../../src/components/contacts/ContactPermission';

describe('ContactPermission Component', () => {
  it('renders default error text when no error prop is provided', () => {
    const { getByText } = render(<ContactPermission error={null} onRetry={() => {}} />);
    expect(getByText(/permission required/i)).toBeTruthy();
  });

  it('renders the provided error text', () => {
    const errorMessage = 'Contacts permission denied';
    const { getByText } = render(
      <ContactPermission error={errorMessage} onRetry={() => {}} />
    );
    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('calls onRetry when the button is pressed', () => {
    const onRetryMock = jest.fn();
    const { getByText } = render(
      <ContactPermission error={null} onRetry={onRetryMock} />
    );

    const button = getByText(/grant permission/i);
    fireEvent.press(button);

    expect(onRetryMock).toHaveBeenCalled();
  });
});
