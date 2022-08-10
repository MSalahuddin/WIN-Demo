import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import Button from '../../../js/components/common/Button';
import MockProvider from '../../MockProvider';

describe('Component Button', () => {
  const onPress = jest.fn();
  const onPressFunction = jest.fn();

  test('renders regular button correctly', () => {
    const output = render(
      <MockProvider>
        <Button>{1}</Button>
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders disabled button correctly', () => {
    const output = render(
      <MockProvider>
        <Button disabled>{1}</Button>
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <Button onPress={onPress}>{1}</Button>
      </MockProvider>
    );
    fireEvent(getByTestId('button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });

  test('not call onPress when button is disabled', () => {
    const { getByTestId } = render(
      <MockProvider>
        <Button disabled onPress={onPressFunction}>
          {1}
        </Button>
      </MockProvider>
    );
    fireEvent(getByTestId('button'), 'press');
    expect(onPressFunction).not.toHaveBeenCalled();
  });
});
