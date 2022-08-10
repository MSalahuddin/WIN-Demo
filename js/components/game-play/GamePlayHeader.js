import React, { useContext, useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Animated, BackHandler } from "react-native";
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { hasNotch } from 'react-native-device-info';

import IconButton from '../common/IconButton';
import Ellipse from '../common/Ellipse';
import QueueBar from './QueueBar';
import QueueItem from './QueueItem';
import { SOUNDS } from '../../soundUtils';
import { logEvent } from '../../amplitudeUtils';
import { scale, scaleHeight } from '../../platformUtils';
import { gamePlayStrings } from '../../stringConstants';
import { color } from '../../styles';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';
import { UserContext } from '../../context/User.context';
import { coin, redLight, redBack, backInactive } from '../../../assets/images';
import { SCREENS, PLAYER_STATUS, ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from '../../constants';

const Header = styled.View`
  flex-direction: column;
  margin-top: ${hasNotch() ? scaleHeight(24) : 0};
  background-color: transparent;
`;

const MainRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-right: ${scale(16)};
`;

const SecondaryRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding-horizontal: ${scale(20)};
  margin-top: ${scale(16)};
`;

const LiveContainer = styled.View`
  border-radius: ${scaleHeight(20)};
  height: ${scaleHeight(40)};
  padding-horizontal: ${scale(5)};
  background-color: ${color.whiteTransparent};
`;

const EllipseWrapper = styled.View`
  margin-top: ${scale(24)};
`;

const GamePlayHeader = ({ navigation, playerStatus, watchers, queueLength, machineData, setShowQuitAlert, challengeIndex, selectedChallenge  }, ref) => {
  const { tokens } = useContext(UserContext);
  const [isBackButtonDisabled, setIsBackButtonDisabled] = useState(false);
  const { playSoundEffect } = useContext(BackgroundMusicContext);
  const isStatusWatchingOrQueue = playerStatus === PLAYER_STATUS.WATCHING || playerStatus === PLAYER_STATUS.IN_QUEUE;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // if status is playing and go back button is disabled,
    // this means the back button was pressed during the countdown
    const backButtonPressedInCountdown = playerStatus === PLAYER_STATUS.PLAYING && isBackButtonDisabled;

    if (backButtonPressedInCountdown) {
      setShowQuitAlert(true);
      setIsBackButtonDisabled(false);
    } else if (playerStatus === PLAYER_STATUS.NEXT_PLAYER || playerStatus === PLAYER_STATUS.IN_QUEUE) {
      setIsBackButtonDisabled(false);
    } else if (playerStatus === PLAYER_STATUS.GAME_ENDED) {
      setIsBackButtonDisabled(true);
    }

    const backAction = () => { 
      // eslint-disable-next-line no-use-before-define
      backOnPress(); 
      return true 
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerStatus]);

  useEffect(() => {
    // Animated.timing(fadeAnim, {
    //   toValue: 1,
    //   duration: 250,
    // }).start();
  }, []);

  const fadeOut = () => {
    setIsBackButtonDisabled(true);
    // Animated.timing(
    //   fadeAnim,
    //   {
    //     toValue: 0, 
    //     duration: 250,
    //   }
    // ).start();
  }


  const backOnPress = () => {
    const { navigate } = navigation;
    playSoundEffect(SOUNDS.NEGATIVE_POPUP);
    switch (playerStatus) {
      case PLAYER_STATUS.IN_QUEUE:
        logEvent(ANALYTICS_EVENTS.LEFT_MACHINE_QUEUE, {
          [ANALYTICS_PROPERTIES.MACHINE_ID]: machineData.machineId
        });
        setShowQuitAlert(true);
        break;
      case PLAYER_STATUS.WATCHING:
        if(!!selectedChallenge && challengeIndex != 'undefine'){
          navigate(SCREENS.CHALLENGE_GAME, {challengeIndex, selectedChallenge })
        } else {
          navigate(SCREENS.GAME_ROOM);
        }
        break;
      case PLAYER_STATUS.NEXT_PLAYER:
        setIsBackButtonDisabled(true);
        break;
      default:
        setShowQuitAlert(true);
    }
  };

  useImperativeHandle(ref, () => ({
    hideComponents: () => {
      fadeOut();
    }
  }));

  return (
    <Header>
      <MainRow>
        {/* <Animated.View
          style={
            {
              opacity: fadeAnim
            }
          }> */}
          <IconButton
            onPress={backOnPress}
            icon={isBackButtonDisabled ? backInactive : redBack}
            disabled={isBackButtonDisabled}
          />
        {/* </Animated.View> */}
        {/* <Animated.View
          style={
            {
              opacity: fadeAnim
            }
          }> */}
          <EllipseWrapper>
            <Ellipse
              testID="coin-button"
              width={95}
              borderRadius={44}
              icon={coin}
              amount={tokens}
              isGamePlay
              backgroundColor={color.whiteTransparent}
              disabled={!isStatusWatchingOrQueue}
              onPress={() => {
                const { navigate } = navigation;
                navigate(SCREENS.GAME_CARD_RELOAD);
              }}
            />
          </EllipseWrapper>
        {/* </Animated.View> */}
        {/* <Animated.View
          style={
            {
              opacity: fadeAnim
            }
          }> */}
          <QueueBar watchingQueue={watchers} gameQueue={queueLength} />
        {/* </Animated.View> */}
      </MainRow>
      {/* <Animated.View
        style={
          {
            opacity: fadeAnim
          }
        }> */}
        <SecondaryRow>
          <LiveContainer>
            <QueueItem icon={redLight} title={gamePlayStrings.live} />
          </LiveContainer>
        </SecondaryRow>
      {/* </Animated.View> */}
    </Header>
  );
};

GamePlayHeader.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired,
  playerStatus: PropTypes.string.isRequired,
  watchers: PropTypes.number.isRequired,
  queueLength: PropTypes.number.isRequired,
  machineData: PropTypes.shape({
    machineId: PropTypes.number.isRequired
  }).isRequired,
  setShowQuitAlert: PropTypes.func.isRequired
};

// export default GamePlayHeader;

const ControlPanelHeaderForwardRef = forwardRef(GamePlayHeader);


export default ControlPanelHeaderForwardRef
