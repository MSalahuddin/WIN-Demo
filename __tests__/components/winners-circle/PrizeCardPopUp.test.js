import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import PrizeCardPopUp from '../../../js/components/winners-circle/PrizeCardPopUp';
import MockProvider from '../../MockProvider';

describe('Component PrizeCardPopUp', () => {
  const onPress = jest.fn();
  const setVisible = jest.fn();
  const data = { imageUrl: '', name: '', ticketsCost: 0, isOnSale: false };

  test('renders regular prize card pop up correctly', () => {
    const output = render(
      <MockProvider>
        <PrizeCardPopUp data={data} isVisible setVisible={setVisible} onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders sale prize card pop up correctly', () => {
    data.ticketsCost = 20;
    data.saleTicketValue = 10;
    data.isOnSale = true;
    const output = render(
      <MockProvider>
        <PrizeCardPopUp data={data} isVisible setVisible={setVisible} onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls setVisible when cancel button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <PrizeCardPopUp data={data} isVisible setVisible={setVisible} onPress={onPress} />
      </MockProvider>
    );
    fireEvent(getByTestId('cancel-button'), 'press');
    expect(setVisible).toHaveBeenCalled();
  });

  test('calls setVisible when cancel text button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <PrizeCardPopUp data={data} isVisible setVisible={setVisible} onPress={onPress} />
      </MockProvider>
    );
    fireEvent(getByTestId('cancel-text-button'), 'press');
    expect(setVisible).toHaveBeenCalled();
  });

  test('calls onPress when big redeem button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <PrizeCardPopUp data={data} isVisible setVisible={setVisible} onPress={onPress} />
      </MockProvider>
    );
    fireEvent(getByTestId('redeem-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });

  test('calls onPress when overlay discounted red button is pressed', () => {
    data.ticketsCost = 20;
    data.saleTicketValue = 10;
    data.isOnSale = true;
    const { getByTestId } = render(
      <MockProvider>
        <PrizeCardPopUp data={data} isVisible setVisible={setVisible} onPress={onPress} />
      </MockProvider>
    );
    fireEvent(getByTestId('overlay-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
