import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import RewardOption from '../../../js/components/game-result/RewardOption';
import { ticket } from '../../../assets/images';

describe('Component RewardOption', () => {
  const onPress = jest.fn();

  test('renders prize reward correctly', () => {
    const output = render(
      <RewardOption isActive prizeImage="a" prizeName="" prizeQty={1} ticketQty={1} type="PRIZE" onPress={onPress} />
    );
    expect(output).toMatchSnapshot();
  });

  test('renders ticket reward correctly', () => {
    const output = render(<RewardOption isActive prizeName="" ticketQty={100} type="TICKETS" onPress={onPress} />);
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when button is pressed', () => {
    const { getByTestId } = render(
      <RewardOption
        isActive
        prizeImage={ticket}
        prizeName=""
        prizeQty={1}
        ticketQty={1}
        type="PRIZE"
        onPress={onPress}
      />
    );
    fireEvent(getByTestId('reward-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
