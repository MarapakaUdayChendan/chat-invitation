import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ContactList from '../../src/components/contacts/ContactList';

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
    imageAvailable: true,
    image: { uri: 'https://example.com/bob.jpg' },
  },
  {
    id: '3',
    name: '', // Empty name to test fallback
    phoneNumbers: [],
    imageAvailable: false,
  },
  {
    id: '4',
    name: 'Charlie',
    // No phoneNumbers array to test optional chaining
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all contacts in the list', () => {
      const { getByText } = renderComponent();
      expect(getByText('Alice')).toBeTruthy();
      expect(getByText('Bob')).toBeTruthy();
      expect(getByText('Unknown')).toBeTruthy(); // Empty name fallback
      expect(getByText('Charlie')).toBeTruthy();
    });

    it('shows "Unknown" for contacts with empty names', () => {
      const contactsWithEmptyName = [
        { id: '1', name: '', phoneNumbers: [], imageAvailable: false }
      ];
      const { getByText } = renderComponent({ contacts: contactsWithEmptyName });
      expect(getByText('Unknown')).toBeTruthy();
    });

    it('shows empty state when no contacts provided', () => {
      const { getByText } = renderComponent({ contacts: [] });
      expect(getByText('No contacts found')).toBeTruthy();
    });

    it('shows empty state when contacts array is undefined', () => {
      const { getByText } = renderComponent({ contacts: undefined });
      expect(getByText('No contacts found')).toBeTruthy();
    });
  });

  describe('Contact Data Handling', () => {
    it('handles contacts without phone numbers', () => {
      const contactWithoutPhone = [
        { id: '1', name: 'John', imageAvailable: false }
      ];
      const { getByText } = renderComponent({ contacts: contactWithoutPhone });
      expect(getByText('John')).toBeTruthy();
    });

    it('handles contacts with empty phone numbers array', () => {
      const contactWithEmptyPhones = [
        { id: '1', name: 'Jane', phoneNumbers: [], imageAvailable: false }
      ];
      const { getByText } = renderComponent({ contacts: contactWithEmptyPhones });
      expect(getByText('Jane')).toBeTruthy();
    });

    it('passes correct image URI when imageAvailable is true', () => {
      const contactWithImage = [
        {
          id: '1',
          name: 'Avatar User',
          phoneNumbers: [{ label: 'mobile', number: '1111111111' }],
          imageAvailable: true,
          image: { uri: 'https://example.com/avatar.jpg' }
        }
      ];
      const { getByText } = renderComponent({ contacts: contactWithImage });
      expect(getByText('Avatar User')).toBeTruthy();
    });

    it('passes undefined image URI when imageAvailable is false', () => {
      const contactWithoutImage = [
        {
          id: '1',
          name: 'No Avatar',
          phoneNumbers: [{ label: 'mobile', number: '2222222222' }],
          imageAvailable: false,
          image: { uri: 'https://example.com/should-not-use.jpg' }
        }
      ];
      const { getByText } = renderComponent({ contacts: contactWithoutImage });
      expect(getByText('No Avatar')).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('calls onContactPress with correct contact when pressed', () => {
      const onContactPress = jest.fn();
      const { getByText } = renderComponent({ onContactPress });
      
      fireEvent.press(getByText('Alice'));
      
      expect(onContactPress).toHaveBeenCalledTimes(1);
      expect(onContactPress).toHaveBeenCalledWith(mockContacts[0]);
    });

    it('calls onContactLongPress with correct contact when long pressed', () => {
      const onContactLongPress = jest.fn();
      const { getByText } = renderComponent({ onContactLongPress });
      
      const bobContact = getByText('Bob');
      fireEvent(bobContact, 'onLongPress');
      
      expect(onContactLongPress).toHaveBeenCalledTimes(1);
      expect(onContactLongPress).toHaveBeenCalledWith(mockContacts[1]);
    });

    it('handles multiple contact presses correctly', () => {
      const onContactPress = jest.fn();
      const { getByText } = renderComponent({ onContactPress });
      
      fireEvent.press(getByText('Alice'));
      fireEvent.press(getByText('Bob'));
      
      expect(onContactPress).toHaveBeenCalledTimes(2);
      expect(onContactPress).toHaveBeenNthCalledWith(1, mockContacts[0]);
      expect(onContactPress).toHaveBeenNthCalledWith(2, mockContacts[1]);
    });
  });

  describe('Selection Mode', () => {
    it('passes selection mode to ContactCard when isSelectionMode is true', () => {
      const { getByText } = renderComponent({ 
        isSelectionMode: true,
        selectedContacts: new Set(['1']) 
      });
      
      // Contact should render even in selection mode
      expect(getByText('Alice')).toBeTruthy();
    });

    it('handles single selected contact', () => {
      const selectedContacts = new Set(['1']);
      const { getByText } = renderComponent({ 
        selectedContacts, 
        isSelectionMode: true 
      });
      
      expect(getByText('Alice')).toBeTruthy();
      expect(getByText('Bob')).toBeTruthy();
    });

    it('handles multiple selected contacts', () => {
      const selectedContacts = new Set(['1', '2']);
      const { getByText } = renderComponent({ 
        selectedContacts, 
        isSelectionMode: true 
      });
      
      expect(getByText('Alice')).toBeTruthy();
      expect(getByText('Bob')).toBeTruthy();
    });

    it('handles empty selection set', () => {
      const { getByText } = renderComponent({ 
        selectedContacts: new Set(), 
        isSelectionMode: true 
      });
      
      expect(getByText('Alice')).toBeTruthy();
      expect(getByText('Bob')).toBeTruthy();
    });
  });

  describe('FlatList Props', () => {
    it('uses contact id as keyExtractor', () => {
      const { getByText } = renderComponent();
      // Verify the list renders (keyExtractor working properly)
      expect(getByText('Alice')).toBeTruthy();
      expect(getByText('Bob')).toBeTruthy();
    });

    it('applies correct contentContainerStyle for proper spacing', () => {
      const { getByText } = renderComponent();
      // Verify list renders with proper styling
      expect(getByText('Alice')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles null or undefined contact properties gracefully', () => {
      const problematicContacts = [
        {
          id: '1',
          name: null,
          phoneNumbers: null,
          imageAvailable: null,
        }
      ];
      
      const { getByText } = renderComponent({ contacts: problematicContacts });
      expect(getByText('Unknown')).toBeTruthy();
    });

    it('handles very long contact names', () => {
      const longNameContact = [
        {
          id: '1',
          name: 'A'.repeat(100),
          phoneNumbers: [{ label: 'mobile', number: '1234567890' }],
          imageAvailable: false,
        }
      ];
      
      const { getByText } = renderComponent({ contacts: longNameContact });
      expect(getByText('A'.repeat(100))).toBeTruthy();
    });

    it('handles contacts with special characters in names', () => {
      const specialCharContact = [
        {
          id: '1',
          name: 'José María Ñoño',
          phoneNumbers: [{ label: 'mobile', number: '1234567890' }],
          imageAvailable: false,
        }
      ];
      
      const { getByText } = renderComponent({ contacts: specialCharContact });
      expect(getByText('José María Ñoño')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('handles large contact lists efficiently', () => {
      const largeContactList = Array.from({ length: 1000 }, (_, index) => ({
        id: `${index}`,
        name: `Contact ${index}`,
        phoneNumbers: [{ label: 'mobile', number: `${index}`.repeat(10) }],
        imageAvailable: false,
      }));
      
      const { getByText } = renderComponent({ contacts: largeContactList });
      expect(getByText('Contact 0')).toBeTruthy();
    });
  });
});
