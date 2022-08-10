import React from 'react';
import { render } from 'react-native-testing-library';

import VideoModal from '../../../js/components/play-history/VideoModal';

describe('Component VideoModal ', () => {
  const setVisible = jest.fn();
  const videoOnError = jest.fn();
  const videoInfo = {
    gameRoundId: 0,
    prizeName: '',
    replayUrl: ''
  };

  test('renders the video popup correctly', () => {
    const output = render(
      <VideoModal isVisible setVisible={setVisible} videoInfo={videoInfo} videoOnError={videoOnError} />
    );
    expect(output).toMatchSnapshot();
  });
});
