import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import SubscriptionCard from '../../../js/components/game-card-reload/SubscriptionCard';
import MockProvider from '../../MockProvider';

describe('Component SubscriptionCard', () => {
  const onPress = jest.fn();
  const iapData = { localizedPrice: '$15.99' };

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <SubscriptionCard
          iapData={iapData}
          imageUrl=""
          monthlyTokenAmount={0}
          name=""
          oneTimeTokenAmount={0}
          onPress={onPress}
          totalTokens={0}
          type={1}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when type={2}', () => {
    const output = render(
      <MockProvider>
        <SubscriptionCard
          iapData={iapData}
          imageUrl=""
          monthlyTokenAmount={0}
          name=""
          oneTimeTokenAmount={0}
          onPress={onPress}
          totalTokens={0}
          type={1}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when type={3}', () => {
    const output = render(
      <MockProvider>
        <SubscriptionCard
          iapData={iapData}
          imageUrl=""
          monthlyTokenAmount={0}
          name=""
          oneTimeTokenAmount={0}
          onPress={onPress}
          totalTokens={0}
          type={0}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
  test('renders regular popular SubscriptionCard correctly', () => {
    const output = render(
      <MockProvider>
        <SubscriptionCard
          iapData={iapData}
          imageUrl=""
          monthlyTokenAmount={0}
          name=""
          oneTimeTokenAmount={0}
          onPress={onPress}
          totalTokens={0}
          type={0}
          ribbonColor="red"
          ribbonName="popular"
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders best value popular SubscriptionCard correctly', () => {
    const output = render(
      <MockProvider>
        <SubscriptionCard
          iapData={iapData}
          imageUrl=""
          monthlyTokenAmount={0}
          name=""
          oneTimeTokenAmount={0}
          onPress={onPress}
          totalTokens={0}
          type={0}
          ribbonColor="purple"
          ribbonName="best value"
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders SubscriptionCard correctly when isOnSale', () => {
    const output = render(
      <MockProvider>
        <SubscriptionCard
          saleMonthlyTokenAmount={2}
          saleOneTimeTokenAmount={3}
          bonusTotalTokens={4}
          iapData={iapData}
          imageUrl=""
          monthlyTokenAmount={0}
          name=""
          oneTimeTokenAmount={0}
          onPress={onPress}
          totalTokens={0}
          type={0}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when buy button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <SubscriptionCard
          iapData={iapData}
          imageUrl=""
          monthlyTokenAmount={0}
          name=""
          oneTimeTokenAmount={0}
          onPress={onPress}
          totalTokens={0}
          type={0}
        />
      </MockProvider>
    );
    fireEvent(getByTestId('buy-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
