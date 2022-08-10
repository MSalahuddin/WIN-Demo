import React from 'react';
import { View } from 'react-native';
import { render } from 'react-native-testing-library';

import VipModal from '../../../js/components/account-profile/VipModal';
import MockProvider from '../../MockProvider';

describe('Component VipModal', () => {
  const setVisible = jest.fn();

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <VipModal isVisible setVisible={setVisible}>
          <View />
        </VipModal>
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when !isVisible', () => {
    const output = render(
      <MockProvider>
        <VipModal isVisible={false} setVisible={setVisible}>
          <View />
        </VipModal>
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
