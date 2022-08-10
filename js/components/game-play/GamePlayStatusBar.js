import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { hasNotch } from 'react-native-device-info';
import { Platform } from 'react-native';
import IconButton from '../common/IconButton';
import Text, { SIZE } from '../common/Text';
import GameCardButton from '../game-room/GameCardButton';
import QueueItem from './QueueItem';
import Button, { BUTTON_COLOR_SCHEME } from '../common/Button';
import { gamePlayStrings, gameResultScreenStrings } from '../../stringConstants';
import { formatTimeString } from '../../utils';
import { color } from '../../styles';
import { scale, scaleWidth, scaleHeight, heightRatio } from '../../platformUtils';
import { cameraButton, redLight, goldBarsPlus, hourGlass, lastWinArrow } from '../../../assets/images';
import { SCREENS, PLAYER_STATUS } from '../../constants';
import PlayLastWin from './PlayLastWin';
import SimpleButton from '../common/SimpleButton';

const Container = styled.View`
  align-items: center;
  bottom: ${hasNotch() ? scale(24) : scale(5)};
  flex-direction: row;
  justify-content: space-around;
  left: 0;
  position: absolute;
  right: 0;
`;

const GetReadyIcon = styled.Image`
  margin-right: ${scaleWidth(3)};
`;
const GetReadyButtonContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CenterTextWrapper = styled.View`
  margin-top: ${scaleHeight(-1)};
  padding-top: ${heightRatio > 1
    ? scaleHeight(Platform.OS === 'android' ? 0 : 5)
    : scaleHeight(Platform.OS === 'android' ? 0 : 5)};
`;

const FlipButton = styled(IconButton)`
  margin-top: 0;
  margin-left: 0;
`;

const BuyTokenContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const BuyTokenIcon = styled.Image`
  height: ${scaleHeight(20)};
  width: ${scaleHeight(20)};
`;

const BuyTokenText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(7)};
`;

const ButtonWrapper = styled(SimpleButton)`
  border-color: ${color.blackBorder};
  border-radius: ${scaleHeight(40)};
 `;

const GameCardButtonWrapper = styled(GameCardButton)`
  border-color: ${color.blackBorder};
  border-width: ${({ borderWidth }) => borderWidth};
  border-radius: ${scaleHeight(40)};
`;

function GamePlayStatusBar({
  flipCamera,
  time,
  machineData,
  onPlayPress,
  navigation,
  playerStatus,
  queuePosition,
  onTimerEnd,
  onPressBuyToken
}) {
  const [remainingTime, setRemainingTime] = useState(time);
  const isStatusWatchingOrQueue = playerStatus === PLAYER_STATUS.WATCHING || playerStatus === PLAYER_STATUS.IN_QUEUE;

  const startTimer = () => {
    setTimeout(() => {
      if (remainingTime === 1) {
        onTimerEnd();
      }
      setRemainingTime(remainingTime - 1);
      // setting 950 because there is a lag in each render
      // if we set it to 1000 the timer would take 1 more second
      // to complete the whole count down.
    }, 950);
  };

  useEffect(() => {
    // Ref: WIN-1225
    // Without following block, the timer will not be reset for new game
    // It's largely due to React Navigation doesn't unmount component unless it's being pop
    // from the stack
    if (playerStatus === PLAYER_STATUS.NEXT_PLAYER) {
      setRemainingTime(time);
    } else if (playerStatus === PLAYER_STATUS.PLAYING) {
      startTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerStatus, remainingTime]);



  const renderLeftSection = () => (
    <ButtonWrapper
      backgroundColor={[color.white]}
      onPress={onPressBuyToken}
      disabled={!isStatusWatchingOrQueue}
      height={scaleHeight(50)}
      width={scaleWidth(135)}
      borderWidth={2}
      borderColor={color.darkGrey}
      disableBackgroundColor={[color.white]}
    >
      {isStatusWatchingOrQueue ? (
        <BuyTokenContainer>
          <BuyTokenIcon source={goldBarsPlus} />
          <BuyTokenText size={SIZE.XSMALL} color={color.black}>
            {gamePlayStrings.buyTokens}
          </BuyTokenText>
        </BuyTokenContainer>
      ) : (
        <QueueItem icon={redLight} title={gamePlayStrings.playing} color={color.black} />
      )}
    </ButtonWrapper>
  );

  const renderQueueStatusMessage = () => (
    <ButtonWrapper
      backgroundColor={[color.white]}
      disabled={!isStatusWatchingOrQueue}
      width={scaleWidth(130)}
      height={scaleHeight(50)}
      borderWidth={2}
      borderColor={color.darkGrey}
      disableBackgroundColor={[color.white]}
    >
      <GetReadyButtonContent>
        <GetReadyIcon source={hourGlass} resizeMode="contain" />
        <CenterTextWrapper>
          <Text size={SIZE.XSMALL} color={color.black} alignCenter>
            {playerStatus === PLAYER_STATUS.IN_QUEUE
              ? `#${queuePosition} ${gameResultScreenStrings.inLine}`
              : gamePlayStrings.getReady}
          </Text>
        </CenterTextWrapper>
      </GetReadyButtonContent>
    </ButtonWrapper>
  );

  // const { isFree, isVip, isDisabled, tokensCost } = machineData;

  // const renderPayToPlayButton = () => (
  //   <PlayLastWin />
  // );

  const renderTimer = () => (
    <ButtonWrapper
      backgroundColor={[color.white]}
      disabled={!isStatusWatchingOrQueue}
      onPress={onPressBuyToken}
      width={scaleWidth(130)}
      height={scaleHeight(50)}
      borderWidth={2}
      borderColor={color.darkGrey}
      disableBackgroundColor={[color.white]}
    >
      <CenterTextWrapper>
        <Text size={SIZE.LARGEST} color={color.black} alignCenter>
          {formatTimeString(remainingTime)}
        </Text>
      </CenterTextWrapper>
    </ButtonWrapper>
  );

  const renderRightSection = () => {
    if (playerStatus === PLAYER_STATUS.NEXT_PLAYER || playerStatus === PLAYER_STATUS.IN_QUEUE) {
      return renderQueueStatusMessage();
    }
    if (playerStatus === PLAYER_STATUS.PLAYING || playerStatus === PLAYER_STATUS.GAME_ENDED) {
      return renderTimer();
    }
    return <PlayLastWin machineData={machineData} navigation={navigation} />;
  };

  return (
    <Container>
      {renderLeftSection()}
      <FlipButton icon={cameraButton} size={52} onPress={flipCamera} testID="flip-button" />
      {renderRightSection()}
    </Container>
  );
}

GamePlayStatusBar.propTypes = {
  time: PropTypes.number.isRequired,
  flipCamera: PropTypes.func.isRequired,
  onTimerEnd: PropTypes.func.isRequired,
  onPlayPress: PropTypes.func.isRequired,
  machineData: PropTypes.shape({
    isDisabled: PropTypes.bool.isRequired,
    isFree: PropTypes.bool.isRequired,
    tokensCost: PropTypes.number.isRequired,
    isVip: PropTypes.bool.isRequired,
    gameRound: PropTypes.shape({
      replayUrl: PropTypes.string.isRequired
    })
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired,
  playerStatus: PropTypes.string.isRequired,
  queuePosition: PropTypes.number.isRequired,
  onPressBuyToken: PropTypes.func.isRequired
};

export default GamePlayStatusBar;
