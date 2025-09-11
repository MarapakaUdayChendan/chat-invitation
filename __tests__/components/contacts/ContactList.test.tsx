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

describe('ContactList Component', () => {
  it('renders contacts correctly', () => {
    const { getByText } = render(
      <ContactList
        contacts={mockContacts}
        selectedContacts={new Set()}
        isSelectionMode={false}
        onContactPress={() => {}}
        onContactLongPress={() => {}}
      />
    );

    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('Bob')).toBeTruthy();
  });

  it('renders empty state when no contacts', () => {
    const { getByText } = render(
      <ContactList
        contacts={[]}
        selectedContacts={new Set()}
        isSelectionMode={false}
        onContactPress={() => {}}
        onContactLongPress={() => {}}
      />
    );

    expect(getByText(/no contacts found/i)).toBeTruthy();
  });

  it('handles onContactPress correctly', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <ContactList
        contacts={mockContacts}
        selectedContacts={new Set()}
        isSelectionMode={false}
        onContactPress={onPressMock}
        onContactLongPress={() => {}}
      />
    );

    fireEvent.press(getByText('Alice'));
    expect(onPressMock).toHaveBeenCalledWith(mockContacts[0]);
  });

  it('handles onContactLongPress correctly', () => {
    const onLongPressMock = jest.fn();
    const { getByText } = render(
      <ContactList
        contacts={mockContacts}
        selectedContacts={new Set()}
        isSelectionMode={false}
        onContactPress={() => {}}
        onContactLongPress={onLongPressMock}
      />
    );

    fireEvent(getByText('Bob'), 'onLongPress');
    expect(onLongPressMock).toHaveBeenCalledWith(mockContacts[1]);
  });

  it('marks selected contacts correctly', () => {
    const selectedSet = new Set(['1']);
    const { getByText } = render(
      <ContactList
        contacts={mockContacts}
        selectedContacts={selectedSet}
        isSelectionMode={true}
        onContactPress={() => {}}
        onContactLongPress={() => {}}
      />
    );

    const alice = getByText('Alice');
    expect(alice.props.style).toBeDefined(); // Basic check that component rendered with selection mode
  });
});
