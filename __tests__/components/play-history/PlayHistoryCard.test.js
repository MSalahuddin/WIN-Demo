import React from 'react';
import { Linking } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';
import sinon from 'sinon';

import PlayHistoryCard from '../../../js/components/play-history/PlayHistoryCard';
import MockProvider from '../../MockProvider';

describe('Component PlayHistoryCard', () => {
  const setShowVideoAlert = jest.fn();
  const setVideoInfo = jest.fn();
  const setIsVideoModalVisible = jest.fn();

  test('renders correctly with lose banner', () => {
    const output = render(
      <MockProvider>
        <PlayHistoryCard
          prizeName=""
          gamePlayDate=""
          gamePlayTime=""
          isWon={false}
          imageUrl=""
          tokensCost={0}
          gameRoundId={0}
          machineId={0}
          setShowVideoAlert={setShowVideoAlert}
          setVideoInfo={setVideoInfo}
          setIsVideoModalVisible={setIsVideoModalVisible}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly with win banner', () => {
    const output = render(
      <MockProvider>
        <PlayHistoryCard
          prizeName=""
          gamePlayDate=""
          gamePlayTime=""
          isWon
          imageUrl=""
          tokensCost={0}
          gameRoundId={0}
          machineId={0}
          setShowVideoAlert={setShowVideoAlert}
          setVideoInfo={setVideoInfo}
          setIsVideoModalVisible={setIsVideoModalVisible}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('should open email to report issue', async () => {
    const openURLSpy = sinon.spy(Linking, 'openURL');
    const { getByTestId } = render(
      <MockProvider>
        <PlayHistoryCard
          prizeName=""
          gamePlayDate=""
          gamePlayTime=""
          isWon
          imageUrl=""
          tokensCost={0}
          gameRoundId={0}
          machineId={0}
          setShowVideoAlert={setShowVideoAlert}
          setVideoInfo={setVideoInfo}
          setIsVideoModalVisible={setIsVideoModalVisible}
        />
      </MockProvider>
    );
    await fireEvent(getByTestId('report-issue-text-button'), 'press');
    expect(openURLSpy).toHaveBeenCalled();
  });
});
