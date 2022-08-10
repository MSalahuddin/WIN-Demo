import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import GameCardButton from '../../../js/components/game-room/GameCardButton';
import MockProvider from '../../MockProvider';

describe('Component GameCardButton', () => {
  const onPress = jest.fn();

  test('renders regular button correctly', () => {
    const output = render(
      <MockProvider>
        <GameCardButton tokensCost={100} onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders free button correctly', () => {
    const output = render(
      <MockProvider>
        <GameCardButton tokensCost={100} isFree onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders become VIP button for non-VIP user correctly', () => {
    const output = render(
      <MockProvider>
        <GameCardButton tokensCost={100} isGameVIP onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly isDisabled', () => {
    const output = render(
      <MockProvider>
        <GameCardButton tokensCost={100} isDisabled onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when play button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <GameCardButton tokensCost={100} onPress={onPress} />
      </MockProvider>
    );
    fireEvent(getByTestId('play-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });

  test('calls onPress when free button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <GameCardButton tokensCost={100} onPress={onPress} isFree />
      </MockProvider>
    );
    fireEvent(getByTestId('overlay-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
