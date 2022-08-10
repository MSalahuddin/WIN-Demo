import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import TokenCard from '../../../js/components/game-card-reload/TokenCard';
import MockProvider from '../../MockProvider';

describe('Component TokenCard', () => {
  const onPress = jest.fn();
  const iapData = { localizedPrice: '$15.99' };

  test('renders regular TokenCard correctly', () => {
    const output = render(
      <MockProvider>
        <TokenCard name="" imageUrl="" tokenAmount={1} iapData={iapData} onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders regular popular TokenCard correctly', () => {
    const output = render(
      <MockProvider>
        <TokenCard
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

  test('renders best value popular TokenCard correctly', () => {
    const output = render(
      <MockProvider>
        <TokenCard
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

  test('renders on sale TokenCard correctly', () => {
    const output = render(
      <MockProvider>
        <TokenCard name="" imageUrl="" tokenAmount={1} iapData={iapData} bonusTokenAmount={10} onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when buy button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <TokenCard
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
    fireEvent(getByTestId('buy-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
