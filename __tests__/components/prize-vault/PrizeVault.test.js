import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import PrizeVault from '../../../js/components/prize-vault';
import MockProvider from '../../MockProvider';

describe('Component PrizeVault', () => {
  const navigation = { navigate: jest.fn() };

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <PrizeVault navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when isVip', () => {
    const output = render(
      <MockProvider value={{ isVip: true }}>
        <PrizeVault navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls navigate when InstructionPopUp is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <PrizeVault navigation={navigation} />
      </MockProvider>
    );
    fireEvent(getByTestId('instruction-popup'), 'press');
    expect(navigation.navigate).toHaveBeenCalled();
  });
});
