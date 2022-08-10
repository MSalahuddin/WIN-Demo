import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import PromoCard from '../../../js/components/common/PromoCard';
import { purseCoins } from '../../../assets/images';

describe('Component PromoCard', () => {
  const onPress = jest.fn();
  const onClose = jest.fn();

  test('renders correctly when it is a banner and imageUrl=null', () => {
    const output = render(<PromoCard onPress={onPress} title="a" subtitle="a" imageUrl={null} />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when it is a banner and imageUrl exists', () => {
    const output = render(<PromoCard onPress={onPress} title="a" subtitle="a" imageUrl="a" />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when it is a card with imageUrl=null', () => {
    const output = render(<PromoCard onPress={onPress} isCard title="a" subtitle="a" imageUrl={null} />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when it is a card with imageUrl exists', () => {
    const output = render(<PromoCard onPress={onPress} isCard title="a" subtitle="a" imageUrl="a" />);
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when component is pressed', () => {
    const { getByTestId } = render(<PromoCard onPress={onPress} icon={purseCoins} />);
    fireEvent(getByTestId('promo-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });

  test('calls onClose when close button is pressed', () => {
    const { getByTestId } = render(<PromoCard icon={purseCoins} onPress={onPress} onClose={onClose} isClosable />);
    fireEvent(getByTestId('close-button'), 'press');
    expect(onClose).toHaveBeenCalled();
  });
});
