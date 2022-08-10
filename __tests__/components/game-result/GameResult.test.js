import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import GameResultView from '../../../js/components/game-result';
import MockProvider from '../../MockProvider';

describe('Component GameResultView', () => {
  const machineData = {
    tokensCost: 0,
    isFree: false,
    prizeDuration: 10,
    prize: {
      ticketsValue: 0,
      imageUrl: 'a',
      name: 'a'
    }
  };
  const gameRoundData = {
    prizeId: 0,
    gameRoundId: 1
  };
  const navigation = {
    replace: jest.fn(),
    goBack: jest.fn(),
    popToTop:jest.fn(),
    dispatch: jest.fn(),
    navigate: jest.fn()
  };
  const setShowGameResult = jest.fn();
  const cleanUpGamePlay = jest.fn();
  const playerStatus = 'a';
  const goBackToGame = jest.fn();
  const setPlayerStatus = jest.fn();
  const queueLength = 0;
  const exitQueue = jest.fn();

  test('renders correctly when !isGameWon', () => {
    const output = render(
      <MockProvider>
        <GameResultView
          navigation={navigation}
          machineData={machineData}
          isGameWon={false}
          queuePosition={0}
          setShowGameResult={setShowGameResult}
          gameRoundData={gameRoundData}
          cleanUpGamePlay={cleanUpGamePlay}
          playerStatus={playerStatus}
          goBackToGame={goBackToGame}
          setPlayerStatus={setPlayerStatus}
          queueLength={queueLength}
          exitQueue={exitQueue}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when isGameWon', () => {
    const output = render(
      <MockProvider>
        <GameResultView
          navigation={navigation}
          machineData={machineData}
          isGameWon
          queuePosition={0}
          setShowGameResult={setShowGameResult}
          gameRoundData={gameRoundData}
          cleanUpGamePlay={cleanUpGamePlay}
          playerStatus={playerStatus}
          goBackToGame={goBackToGame}
          setPlayerStatus={setPlayerStatus}
          queueLength={queueLength}
          exitQueue={exitQueue}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when !isGameWon and out of tokens', () => {
    const output = render(
      <MockProvider value={{ tokens: 0 }}>
        <GameResultView
          navigation={navigation}
          machineData={machineData}
          isGameWon={false}
          queuePosition={0}
          setShowGameResult={setShowGameResult}
          cleanUpGamePlay={cleanUpGamePlay}
          playerStatus={playerStatus}
          goBackToGame={goBackToGame}
          setPlayerStatus={setPlayerStatus}
          queueLength={queueLength}
          exitQueue={exitQueue}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls dispatch when find-new-game-button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <GameResultView
          navigation={navigation}
          machineData={machineData}
          isGameWon={false}
          queuePosition={0}
          setShowGameResult={setShowGameResult}
          cleanUpGamePlay={cleanUpGamePlay}
          playerStatus={playerStatus}
          goBackToGame={goBackToGame}
          setPlayerStatus={setPlayerStatus}
          queueLength={queueLength}
          exitQueue={exitQueue}
        />
      </MockProvider>
    );
    fireEvent(getByTestId('find-new-game-button'), 'press');
    expect(navigation.popToTop).toHaveBeenCalled();
  });
});
