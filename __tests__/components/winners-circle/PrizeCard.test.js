import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import PrizeCard from '../../../js/components/winners-circle/PrizeCard';
import MockProvider from '../../MockProvider';

describe('Component PrizeCard', () => {
  const onPress = jest.fn();
  const onPressInfo = jest.fn();

  test('renders regular PrizeCard correctly', () => {
    const output = render(
      <MockProvider>
        <PrizeCard prizeName="" description="" value={0} imageUrl="" onPress={onPress} onPressInfo={onPressInfo} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders popular PrizeCard on sale', () => {
    const output = render(
      <MockProvider>
        <PrizeCard
          prizeName=""
          description=""
          value={10}
          imageUrl=""
          isOnSale
          saleTicketValue={0}
          onPressInfo={onPressInfo}
          onPress={onPress}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPressInfo when info button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <PrizeCard
          prizeName="a"
          description=""
          value={10}
          imageUrl=""
          isOnSale
          saleTicketValue={0}
          onPressInfo={onPressInfo}
          onPress={onPress}
        />
      </MockProvider>
    );
    fireEvent(getByTestId('winner-info-button'), 'press');
    expect(onPressInfo).toHaveBeenCalled();
  });
});
