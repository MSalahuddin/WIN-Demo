import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import VaultCardInfo from '../../../js/components/prize-vault/VaultCardInfo';

describe('Component VaultCardInfo', () => {
  const setVisible = jest.fn();

  const data = {
    prize: {
      imageUrl: 'a',
      name: '',
      ticketsValue: 0
    },
    packingDate: null,
    redeemDate: null,
    shippedDate: null,
    swapDate: null,
    winDate: null
  };

  test('renders correctly when only winDate is available', () => {
    data.winDate = Date.now();
    const output = render(<VaultCardInfo data={data} isVisible setVisible={setVisible} />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when only winDate is available with null imageUrl', () => {
    data.winDate = Date.now();
    data.prize.imageUrl = null;
    const output = render(<VaultCardInfo data={data} isVisible setVisible={setVisible} />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when only redeemDate is available ', () => {
    data.redeemDate = Date.now();
    const output = render(<VaultCardInfo data={data} isVisible setVisible={setVisible} />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when redeemDate and shippedDate are available ', () => {
    data.redeemDate = Date.now();
    data.swapDate = Date.now();
    const output = render(<VaultCardInfo data={data} isVisible setVisible={setVisible} />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when only swapDate is available ', () => {
    data.swapDate = Date.now();
    const output = render(<VaultCardInfo data={data} isVisible setVisible={setVisible} />);
    expect(output).toMatchSnapshot();
  });

  test('calls setVisible function when cancel button is pressed', () => {
    const { getByTestId } = render(<VaultCardInfo data={data} isVisible setVisible={setVisible} />);
    fireEvent(getByTestId('cancel-button'), 'press');
    expect(setVisible).toHaveBeenCalled();
  });
});
