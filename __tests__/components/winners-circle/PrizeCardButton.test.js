import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import PrizeCardButton from '../../../js/components/winners-circle/PrizeCardButton';
import MockProvider from '../../MockProvider';

describe('Component PrizeCardButton', () => {
  const onPress = jest.fn();

  test('renders regular button correctly', () => {
    const output = render(
      <MockProvider>
        <PrizeCardButton value={10} onPress={onPress} newValue={null} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders discounted prize button correctly', () => {
    const output = render(
      <MockProvider>
        <PrizeCardButton value={10} onPress={onPress} newValue={5} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when big redeem button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <PrizeCardButton value={10} onPress={onPress} newValue={5} />
      </MockProvider>
    );
    fireEvent(getByTestId('redeem-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });

  test('calls onPress when small discounted price button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <PrizeCardButton value={10} onPress={onPress} newValue={5} />
      </MockProvider>
    );
    fireEvent(getByTestId('discounted-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
