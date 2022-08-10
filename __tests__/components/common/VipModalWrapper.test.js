import React from 'react';
import { View } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';

import VipModalWrapper from '../../../js/components/common/VipModalWrapper';
import MockProvider from '../../MockProvider';

describe('Component VipModalWrapper', () => {
  const setVisible = jest.fn();

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <VipModalWrapper isVisible setVisible={setVisible}>
          <View />
        </VipModalWrapper>
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when !isVisible', () => {
    const output = render(
      <MockProvider>
        <VipModalWrapper isVisible={false} setVisible={setVisible}>
          <View />
        </VipModalWrapper>
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when showChicken', () => {
    const output = render(
      <MockProvider>
        <VipModalWrapper isVisible setVisible={setVisible} showChicken>
          <View />
        </VipModalWrapper>
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <VipModalWrapper isVisible setVisible={setVisible}>
          <View />
        </VipModalWrapper>
      </MockProvider>
    );
    fireEvent(getByTestId('dismiss-button'), 'press');
    expect(setVisible).toHaveBeenCalled();
  });
});
