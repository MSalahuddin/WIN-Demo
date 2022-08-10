import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import PlayAgainButton from '../../../js/components/game-result/PlayAgainButton';
import MockProvider from '../../MockProvider';

describe('Component PlayAgainButton', () => {
  const onPress = jest.fn();
  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <PlayAgainButton tokensCost={1} onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when isFree', () => {
    const output = render(
      <MockProvider>
        <PlayAgainButton tokensCost={1} onPress={onPress} isFree />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when play again button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <PlayAgainButton tokensCost={1} onPress={onPress} isFree />
      </MockProvider>
    );
    fireEvent(getByTestId('play-again-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
