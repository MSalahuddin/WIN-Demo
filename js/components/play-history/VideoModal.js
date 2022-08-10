import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import Video from 'react-native-video';

import IconButton from '../common/IconButton';
import { scale } from '../../platformUtils';
import { closeBlack } from '../../../assets/images';
import { color } from '../../styles';
import { logEvent } from '../../amplitudeUtils';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from '../../constants';

const StyledModal = styled(Modal)`
  background-color: ${color.black};
  margin: 0;
  justify-content: flex-start;
`;

const Header = styled.View`
  flex-direction: row;
  padding-horizontal: ${scale(24)};
  position: absolute;
  width: 100%;
  justify-content: flex-end;
  z-index: 1;
`;

const VideoWrapper = styled(Video)`
  top: 25%;
  width: 100%;
  height: 50%;
  background-color: ${color.black};
`;

const VideoModal = ({ isVisible, setVisible, videoInfo, videoOnError, ...rest }) => {
  const { gameRoundId, prizeName, replayUrl } = videoInfo;
  const trackWatchGamePlay = () => {
    logEvent(ANALYTICS_EVENTS.WATCHED_GAME_PLAY, {
      [ANALYTICS_PROPERTIES.PRIZE_NAME]: prizeName,
      [ANALYTICS_PROPERTIES.GAME_ROUND_ID]: gameRoundId
    });
  };
  return (
    <SafeAreaView>
      <StyledModal isVisible={isVisible} {...rest}>
        <Header>
          <IconButton testID="cancel-button" onPress={() => setVisible(false)} icon={closeBlack} size={32} />
        </Header>
        <VideoWrapper
          controls
          fullscreen
          onLoad={trackWatchGamePlay}
          onError={videoOnError}
          source={{ uri: replayUrl }}
          resizeMode="cover"
        />
      </StyledModal>
    </SafeAreaView>
  );
};

VideoModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  videoOnError: PropTypes.func.isRequired,
  videoInfo: PropTypes.shape({
    replayUrl: PropTypes.string.isRequired,
    gameRoundId: PropTypes.number.isRequired,
    prizeName: PropTypes.string.isRequired
  }).isRequired
};

export default VideoModal;
