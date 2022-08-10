import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import PriceCardModal from '../../../js/components/game-room/PriceCardModal';
import MockProvider from '../../MockProvider';

describe('Component PriceCardModal', () => {
  const setVisible = jest.fn();
  const onPress = jest.fn();
  const machineData = {
    prize: {
      imageUrl: '',
      name: 'a',
      ticketsValue: 0,
      value: 0
    },
    lastWin: '',
    isVip: false,
    isDisabled: false,
    isFree: true,
    tokensCost: 0,
    viewersCount: 0,
    queueLength: 0
  };

  test('renders regular card correctly', () => {
    const output = render(
      <MockProvider>
        <PriceCardModal
          isVisible
          setVisible={setVisible}
          machineData={machineData}
          isFree={false}
          isVip={false}
          onPress={onPress}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders VIP card and VIP player correctly', () => {
    machineData.isVip = true;
    machineData.isFree = false;
    machineData.isDisabled = false;
    const output = render(
      <MockProvider>
        <PriceCardModal isVisible setVisible={setVisible} machineData={machineData} isVip onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders VIP card and non VIP player correctly', () => {
    machineData.isVip = true;
    machineData.isFree = false;
    machineData.isDisabled = true;
    const output = render(
      <MockProvider>
        <PriceCardModal isVisible setVisible={setVisible} machineData={machineData} isVip={false} onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders free card correctly', () => {
    machineData.isDisabled = false;
    machineData.isFree = true;
    machineData.isVip = false;

    const output = render(
      <MockProvider>
        <PriceCardModal isVisible setVisible={setVisible} machineData={machineData} onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls setVisible when back button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <PriceCardModal isVisible setVisible={setVisible} machineData={machineData} isVip onPress={onPress} />
      </MockProvider>
    );
    fireEvent(getByTestId('back-button'), 'press');
    expect(setVisible).toHaveBeenCalled();
  });

  test('calls setVisible when cancel button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <PriceCardModal isVisible setVisible={setVisible} machineData={machineData} isVip onPress={onPress} />
      </MockProvider>
    );
    fireEvent(getByTestId('cancel-button'), 'press');
    expect(setVisible).toHaveBeenCalled();
  });

  test('calls onPress when play button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <PriceCardModal isVisible setVisible={setVisible} machineData={machineData} isVip onPress={onPress} />
      </MockProvider>
    );
    fireEvent(getByTestId('game-play-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
