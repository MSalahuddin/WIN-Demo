import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import ShippingSubmitButton from '../../../js/components/shipping/ShippingSubmitButton';
import MockProvider from '../../MockProvider';

describe('Component Button', () => {
  const onPress = jest.fn();
  const touched = {
    address1: true,
    city: true,
    zipCode: true,
    state: true,
    firstName: true,
    lastName: true,
    email: true,
    phoneNumber: true
  };

  const fieldsNeedValidate = ['address1', 'city', 'email', 'firstName', 'lastName', 'phoneNumber', 'state', 'zipCode'];

  test('renders disabled button correctly', () => {
    const output = render(
      <MockProvider>
        <ShippingSubmitButton onPress={onPress} error={{}} touched={{}} fieldsNeedValidate={fieldsNeedValidate} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders button correctly', () => {
    const output = render(
      <MockProvider>
        <ShippingSubmitButton onPress={onPress} error={{}} touched={touched} fieldsNeedValidate={[]} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <ShippingSubmitButton onPress={onPress} error={{}} touched={touched} fieldsNeedValidate={fieldsNeedValidate} />
      </MockProvider>
    );
    fireEvent(getByTestId('shipping-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
