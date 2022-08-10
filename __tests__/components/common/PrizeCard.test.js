import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import PrizeCard from '../../../js/components/common/PrizeCard';

describe('Component PrizeCard', () => {
  const onPress = jest.fn();

  test('renders regular card correctly when ticketQuantity = 0', () => {
    const output = render(<PrizeCard title="" imageUrl="" ticketQuantity={0} onPress={onPress} />);
    expect(output).toMatchSnapshot();
  });

  test('renders regular card correctly when ticketQuantity > 0', () => {
    const output = render(<PrizeCard title="" imageUrl="" ticketQuantity={10} onPress={onPress} />);
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when card is pressed', () => {
    const { getByTestId } = render(<PrizeCard title="" imageUrl="" ticketQuantity={0} onPress={onPress} />);
    fireEvent(getByTestId('prize-card-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
