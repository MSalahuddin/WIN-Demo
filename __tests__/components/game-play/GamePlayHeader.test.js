import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import MockProvider from '../../MockProvider';
import GamePlayHeader from '../../../js/components/game-play/GamePlayHeader';
import { PLAYER_STATUS } from '../../../js/constants';

describe('Component GamePlayHeader', () => {
  const navigation = { pop: jest.fn(), navigate: jest.fn() };
  const playerStatus = PLAYER_STATUS.WATCHING;
  const machineData = { machineId: 0 };
  const setShowQuitAlert = jest.fn();

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <GamePlayHeader
          navigation={navigation}
          isPlaying
          isInQueue
          watchers={0}
          queueLength={0}
          playerStatus={playerStatus}
          machineData={machineData}
          setShowQuitAlert={setShowQuitAlert}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('navigation.navigate is called when token button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <GamePlayHeader
          navigation={navigation}
          isPlaying={false}
          isInQueue={false}
          watchers={0}
          queueLength={0}
          playerStatus={playerStatus}
          machineData={machineData}
          setShowQuitAlert={setShowQuitAlert}
        />
      </MockProvider>
    );
    fireEvent(getByTestId('coin-button'), 'press');
    expect(navigation.navigate).toHaveBeenCalled();
  });
});
