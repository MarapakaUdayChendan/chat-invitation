import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ContactSearch from '../../../src/components/contacts/ContactSearch';

describe('ContactSearch', () => {
  it('renders with initial value', () => {
    const { getByPlaceholderText } = render(<ContactSearch query="John" onChange={() => {}} />);
    expect(getByPlaceholderText(/search by name or phone/i).props.value).toBe('John');
  });

  it('calls onChange on text change', () => {
    const onChangeMock = jest.fn();
    const { getByPlaceholderText } = render(<ContactSearch query="" onChange={onChangeMock} />);
    fireEvent.changeText(getByPlaceholderText(/search by name or phone/i), 'Alice');
    expect(onChangeMock).toHaveBeenCalledWith('Alice');
  });
});
