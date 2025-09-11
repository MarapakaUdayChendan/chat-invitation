import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ContactSearch from '../../../src/components/contacts/ContactSearch';

describe('ContactSearch Component', () => {
  it('renders correctly with initial value', () => {
    const { getByPlaceholderText } = render(
      <ContactSearch query="John" onChange={() => {}} />
    );

    const input = getByPlaceholderText(/search by name or phone/i);
    expect(input.props.value).toBe('John');
  });

  it('calls onChange when text changes', () => {
    const onChangeMock = jest.fn();
    const { getByPlaceholderText } = render(
      <ContactSearch query="" onChange={onChangeMock} />
    );

    const input = getByPlaceholderText(/search by name or phone/i);
    fireEvent.changeText(input, 'Alice');

    expect(onChangeMock).toHaveBeenCalledWith('Alice');
  });
});
