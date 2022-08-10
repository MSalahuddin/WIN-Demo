import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import GameCard from '../../../js/components/game-room/GameCard';
import MockProvider from '../../MockProvider';

describe('Component GameCard', () => {
  const onPress = jest.fn();
  const onPressInfo = jest.fn();

  test('renders regular card correctly', () => {
    const output = render(
      <MockProvider>
        <GameCard
          imageUrl="a"
          isDisabled={false}
          isFree={false}
          isGameVIP={false}
          onPress={onPress}
          onPressInfo={onPressInfo}
          tokensCost={100}
          prizeName=""
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders free card correctly', () => {
    const output = render(
      <MockProvider>
        <GameCard
          imageUrl="a"
          isDisabled={false}
          isFree
          isGameVIP={false}
          onPress={onPress}
          onPressInfo={onPressInfo}
          tokensCost={100}
          prizeName=""
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders VIP card for non-VIP user correctly', () => {
    const output = render(
      <MockProvider>
        <GameCard
          imageUrl="a"
          isDisabled
          isFree={false}
          isGameVIP
          onPress={onPress}
          onPressInfo={onPressInfo}
          tokensCost={100}
          prizeName=""
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders VIP card for VIP user correctly', () => {
    const output = render(
      <MockProvider>
        <GameCard
          imageUrl="a"
          isDisabled={false}
          isFree={false}
          isGameVIP
          onPress={onPress}
          onPressInfo={onPressInfo}
          tokensCost={100}
          prizeName=""
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPressInfo when info button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <GameCard
          imageUrl="a"
          isDisabled={false}
          isFree={false}
          isGameVIP={false}
          onPress={onPress}
          onPressInfo={onPressInfo}
          tokensCost={100}
          prizeName=""
        />
      </MockProvider>
    );
    fireEvent(getByTestId('info-button'), 'press');
    expect(onPressInfo).toHaveBeenCalled();
  });
});
