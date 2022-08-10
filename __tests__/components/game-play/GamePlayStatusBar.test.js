import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import MockProvider from '../../MockProvider';
import GamePlayStatusBar from '../../../js/components/game-play/GamePlayStatusBar';

describe('Component GamePlayStatusBar', () => {
  const flipCamera = jest.fn();
  const onPress = jest.fn();
  const onTimerEnd = jest.fn();
  const navigation = {
    navigate: jest.fn()
  };
  const machineData = {
    isFree: true,
    isDisabled: false,
    tokensCost: 0
  };
  const playerStatus = '';
  const queuePosition = 0;
  const tokensCost = 0;

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <GamePlayStatusBar
          machineData={machineData}
          onPlayPress={onPress}
          flipCamera={flipCamera}
          time={0}
          isPlaying={false}
          isInQueue={false}
          onTimerEnd={onTimerEnd}
          navigation={navigation}
          playerStatus={playerStatus}
          queuePosition={queuePosition}
          tokensCost={tokensCost}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when isPlaying', () => {
    const output = render(
      <MockProvider>
        <GamePlayStatusBar
          machineData={machineData}
          onPlayPress={onPress}
          flipCamera={flipCamera}
          time={1}
          isPlaying
          isInQueue={false}
          onTimerEnd={onTimerEnd}
          navigation={navigation}
          playerStatus={playerStatus}
          queuePosition={queuePosition}
          tokensCost={tokensCost}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when isInQueue', () => {
    const output = render(
      <MockProvider>
        <GamePlayStatusBar
          machineData={machineData}
          onPlayPress={onPress}
          flipCamera={flipCamera}
          time={1}
          isPlaying={false}
          isInQueue
          onTimerEnd={onTimerEnd}
          navigation={navigation}
          playerStatus={playerStatus}
          queuePosition={queuePosition}
          tokensCost={tokensCost}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls flipCamera when flip camera button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <GamePlayStatusBar
          machineData={machineData}
          onPlayPress={onPress}
          flipCamera={flipCamera}
          time={1}
          isPlaying
          onTimerEnd={onTimerEnd}
          navigation={navigation}
          playerStatus={playerStatus}
          queuePosition={queuePosition}
          tokensCost={tokensCost}
        />
      </MockProvider>
    );
    fireEvent(getByTestId('flip-button'), 'press');
    expect(flipCamera).toHaveBeenCalled();
  });
});
