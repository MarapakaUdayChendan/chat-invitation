import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ContactList from '../../../src/components/contacts/ContactList';

const mockContacts = [
  {
    id: '1',
    name: 'Alice',
    phoneNumbers: [{ label: 'mobile', number: '1234567890' }],
    imageAvailable: false,
  },
  {
    id: '2',
    name: 'Bob',
    phoneNumbers: [{ label: 'mobile', number: '9876543210' }],
    imageAvailable: false,
  },
];

const defaultProps = {
  contacts: mockContacts,
  selectedContacts: new Set<string>(),
  isSelectionMode: false,
  onContactPress: jest.fn(),
  onContactLongPress: jest.fn(),
};

const renderComponent = (props = {}) => render(<ContactList {...defaultProps} {...props} />);

describe('ContactList', () => {
  beforeEach(jest.clearAllMocks);

  it('renders each contact\'s name', () => {
    const { getByText } = renderComponent();
    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('Bob')).toBeTruthy();
  });

  it('shows empty state when no contacts', () => {
    const { getByText } = renderComponent({ contacts: [] });
    expect(getByText(/no contacts found/i)).toBeTruthy();
  });

  it('calls onContactPress with correct contact', () => {
    const onContactPress = jest.fn();
    const { getByText } = renderComponent({ onContactPress });
    fireEvent.press(getByText('Alice'));
    expect(onContactPress).toHaveBeenCalledWith(mockContacts[0]);
  });

  it('calls onContactLongPress with correct contact', () => {
    const onContactLongPress = jest.fn();
    const { getByText } = renderComponent({ onContactLongPress });
    fireEvent(getByText('Bob'), 'onLongPress');
    expect(onContactLongPress).toHaveBeenCalledWith(mockContacts[1]);
  });

  it('applies selection state styling to selected contacts', () => {
    const selectedContacts = new Set<string>(['1']);
    const { getByText } = renderComponent({ selectedContacts, isSelectionMode: true });
    const alice = getByText('Alice');
    expect(alice.props.style).toBeDefined();
  });
});
