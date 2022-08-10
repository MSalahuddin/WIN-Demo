import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import QuickTokenCard from '../../../js/components/common/QuickTokenCard';
import MockProvider from '../../MockProvider';

describe('Component QuickTokenCard', () => {
  const onPress = jest.fn();
  const iapData = { localizedPrice: '$15.99' };

  test('renders regular QuickTokenCard correctly', () => {
    const output = render(
      <MockProvider>
        <QuickTokenCard name="" imageUrl="" tokenAmount={1} iapData={iapData} onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders regular popular QuickTokenCard correctly', () => {
    const output = render(
      <MockProvider>
        <QuickTokenCard
          name=""
          imageUrl=""
          tokenAmount={1}
          iapData={iapData}
          onPress={onPress}
          ribbonColor="red"
          ribbonName="popular"
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders best value popular QuickTokenCard correctly', () => {
    const output = render(
      <MockProvider>
        <QuickTokenCard
          name=""
          imageUrl=""
          tokenAmount={1}
          iapData={iapData}
          ribbonColor="purple"
          ribbonName="best value"
          onPress={onPress}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders on sale QuickTokenCard correctly', () => {
    const output = render(
      <MockProvider>
        <QuickTokenCard name="" imageUrl="" tokenAmount={1} iapData={iapData} bonusTokenAmount={10} onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when buy button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <QuickTokenCard
          name=""
          imageUrl=""
          tokenAmount={1}
          iapData={iapData}
          ribbonColor="purple"
          ribbonName="best value"
          onPress={onPress}
        />
      </MockProvider>
    );
    fireEvent(getByTestId('quick-buy-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
