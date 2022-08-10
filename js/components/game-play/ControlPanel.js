/* global WebSocket */
import React, { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components/native';
import Config from 'react-native-config';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { NavigationEvents } from 'react-navigation';
import * as StoreReview from 'react-native-store-review';
import { Platform } from 'react-native';
import ControlButton, { CONTROL_BUTTON_SIZE, CONTROL_BUTTON_TYPE } from './ControlButton';
import GamePlayStatusBar from './GamePlayStatusBar';
import api from '../../api';
import GameResultView from '../game-result';
import PopUpWrapper from '../common/PopUpWrapper';
import InstructionPopUp from '../common/InstructionPopUp';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import {
  controlPanelBackground,
  medalGold,
  medalHourGlass,
  NotificationCircle,
  FreePlayPopUpButton
} from '../../../assets/images';
import { scale, scaleHeight, scaleWidth, heightRatio } from '../../platformUtils';

import { CMD, RET, OPERATION_TYPE, FLIP_OPERATION_TYPE } from './gamePlayUtils';
import { SOUNDS } from '../../soundUtils';
import {
  ANALYTICS_PROPERTIES,
  ANALYTICS_EVENTS,
  APP_STATE,
  PLAYER_STATUS,
  GAME_PLAY_EVENT_TIME_OUT,
  SCREENS,
  MACHINE_TYPES,
  ANALYTICS_APPSFLYER_EVENTS,
  ANALYTICS_APPSFLYER_EVENTS_PARAMETER
} from '../../constants';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';
import { UserContext } from '../../context/User.context';
import { PopupContext } from '../../context/Popup.context';
import { increaseUserProperty, setUserProperties, logEvent } from '../../amplitudeUtils';
import { popUpStrings } from '../../stringConstants';
import { color } from '../../styles';
import FreePlayPopUp from '../common/FreePlayPopUp';
import { BANNER_TYPE } from '../common/Banner';
import ControlPanelHeader from './ControlPanelHeader'
import { AFLogCustomEvent } from "../../appFlyer.utils";

const StyledModal = styled(Modal)`
  flex: 1;
  margin: 0;
`;

const ControlContainer = styled.View`
  flex: 5;
  flex-direction: row;
  align-items: stretch;
`;

const OuterPanel = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  margin-top:${scaleHeight(-15)}
`;

const Panel = styled.ImageBackground`
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
`;

const DirectionArea = styled.View`
  flex: 2;
  flex-direction: column;
  justify-content: center;
  margin-right: ${scaleWidth(-25)};
  padding-top: ${heightRatio <= 1 ? scaleHeight(Platform.OS === 'android' ? 20 : 15) : scaleHeight(15)};
`;

const SingleButtonRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin-top: ${heightRatio <= 1 ? scaleHeight(-15) : scaleHeight(Platform.OS === 'android' ? -4 : -4)}
`;

const MultiButtonRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding-horizontal: ${scale(10)};
  margin-top: ${heightRatio <= 1 ? scaleHeight(-15) : scaleHeight(-5)};
`;

const ActionArea = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-right:${scaleWidth(15)}
  padding-top: ${heightRatio <= 1 ? scaleHeight(10) : scaleHeight(20)};
`;

const TextWrapper = styled(Text)`
  margin-horizontal: ${scale(28)};
  margin-top: ${({ marginTop }) => (marginTop ? scaleHeight(marginTop) : 0)};
`;

const ControlPanel = ({
  navigation,
  onOutOnTokenPress,
  machineData,
  flipCamera,
  playerStatus,
  setPlayerStatus,
  handleError,
  onUpdateQueue,
  setIsMachineNotAvailablePopUp,
  shouldStartGame,
  setShouldStartGame,
  setShowQuitAlert,
  showQuitAlert,
  showSideVideo,
  onPressBuyToken,
  hideHeaderRef,
  challengeId,
  // useFreePlay,
  challengeIndex,
  selectedChallenge,
}) => {

  const [controlWebsocket, setControlWebsocket] = useState(null);
  const [gameRoundData, setGameRoundData] = useState(null);
  const [gameSessionId, setGameSessionId] = useState(null);
  const [showGameResult, setShowGameResult] = useState(false);
  const [isPlayButtonPressed, setIsPlayButtonPressed] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [playerPrizeId, setPlayerPrizeId] = useState(null);
  const [hasControlTouched, setHasControlTouched] = useState(false);
  const [ufoStepsCount, setUfoStepsCount] = useState(0);
  const [gameStatus, setGameStatus] = useState({ queuePosition: 0, queueLength: 0 });
  const [yAxis, setYAxis] = useState(null)
  const [isUseFreePlay, setIsUseFreePlay] = useState(false)


  const [showFreePlayPopUp, setShowFreePlayPopUp] = useState(false) 
  const { isUserLoggedIn, profilePicture, tokens, isVip, fetchPoints, getFreePlay, FreePlayPopUpScreen, machinesSocketBaseUrl } = useContext(UserContext);
  const { setIsBecomeVipPopUpShown, setIsCreateAccountPopUpShown, displayRequestError } = useContext(PopupContext);
  const { appState, pauseBackgroundMusic, playSoundEffect, playMusic } = useContext(
    BackgroundMusicContext
  );
  const { tokensCost, machineId, gameDuration, prize, isFree, machineTypes, socketSubDomain } = machineData;
  const { helpText } = machineTypes;
  const roomEnteredTracking = useRef(null);
  const gameStartTracking = useRef(null);
  const gameResultTracking = useRef(null);
  const grabActionTracking = useRef(null);
  const hideHeader = useRef(null);

const machineType = machineData?.machineTypes?.typeCode;

  const amplitudeTracking = isWon => {
    if (isWon) {
      logEvent(ANALYTICS_EVENTS.GAME_WON, {
        [ANALYTICS_PROPERTIES.MACHINE_ID]: gameRoundData.machineId,
        [ANALYTICS_PROPERTIES.PRIZE_ID]: gameRoundData.prizeId
      });
      increaseUserProperty(ANALYTICS_PROPERTIES.PLAYER_WINS_COUNT);
    } else {
      logEvent(ANALYTICS_EVENTS.GAME_LOST, {
        [ANALYTICS_PROPERTIES.MACHINE_ID]: gameRoundData.machineId,
        [ANALYTICS_PROPERTIES.PRIZE_ID]: gameRoundData.prizeId
      });
      increaseUserProperty(ANALYTICS_PROPERTIES.PLAYER_LOSE_COUNT);
    }
  };

  const appsFlyerTracking = isWon => {
    const {gameRoundId, machineId ,prizeId, tokensCost, } = gameRoundData;
    const {machineTypes, prize, isVip} = machineData;
    const {name} = machineTypes;
    const {category, ticketsValue} = prize;
    AFLogCustomEvent(ANALYTICS_APPSFLYER_EVENTS.GAME_PLAYED, {
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.GAME_ROUND_ID]: gameRoundId,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.TOKEN_COST]: tokensCost,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.PRIZE_ID]: prizeId,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.PRIZE_NAME]: prize.name,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.MACHINE_ID]: machineId,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.MACHINE_LOCATION]: showSideVideo ? 
      ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.MACHINE_LOCATION.SIDE :
      ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.MACHINE_LOCATION.TOP,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.IS_VIP]: isVip,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.MACHINE_TYPE]: name,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.PRIZE_CATEGORY]: category.name
    });
    if(isWon){
      AFLogCustomEvent(ANALYTICS_APPSFLYER_EVENTS.GAME_WON, {
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.GAME_ROUND_ID]: gameRoundId,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.TOKEN_COST]: tokensCost,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.PRIZE_ID]: prizeId,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.PRIZE_NAME]: prize.name,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.MACHINE_ID]: machineId,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.MACHINE_LOCATION]: showSideVideo ? 
        ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.MACHINE_LOCATION.SIDE :
        ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.MACHINE_LOCATION.TOP,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.IS_VIP]: isVip,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.MACHINE_TYPE]: name,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.PRIZE_CATEGORY]: category.name
      });
    }
  };

  const submitAppStoreReview = () => {
    if (StoreReview.isAvailable) {
      StoreReview.requestReview();
    }
  };

  const getProfileInfo = async () => {
    const result = await api.getProfileInfo()
    const {
      gamesWon
    } = result.data;

    if (gamesWon === 2) {
      await submitAppStoreReview();
    }
  }

  const detectWebSocketConnection = (time = 10000) => {
    return setTimeout(() => {
      setPlayerStatus(PLAYER_STATUS.WATCHING);
      setIsMachineNotAvailablePopUp(true);
    }, time);
  };

  useEffect(() => {
    if(!isPlayButtonPressed) return
    if(gameStatus.queuePosition > 2){
      return hideHeader.current.hideAdComponent(true)
    } else {
      hideHeader.current.hideAdComponent(false)
    }
  }, [gameStatus.queuePosition])

  const startPlaying = async sessionId => {
    if (controlWebsocket) {
      setPlayerStatus(PLAYER_STATUS.PLAYING);
      controlWebsocket.send(CMD.START_GAME(sessionId));
      gameStartTracking.current = detectWebSocketConnection(GAME_PLAY_EVENT_TIME_OUT.GAME_START);
      gameResultTracking.current = detectWebSocketConnection(
        (machineData?.machineTypes?.typeCode === MACHINE_TYPES.UFO 
          || machineData?.machineTypes?.typeCode === MACHINE_TYPES.UFO_TWO 
          || machineData?.machineTypes?.typeCode === MACHINE_TYPES.CUTTER) ?
          GAME_PLAY_EVENT_TIME_OUT.UFO_START_PLAYING_TO_GAME_RESULT :
          GAME_PLAY_EVENT_TIME_OUT.START_PLAYING_TO_GAME_RESULT
      );

      // Track Analytics
      let eventProps = {
        [ANALYTICS_PROPERTIES.PRIZE_ID]: gameRoundData.prizeId,
        [ANALYTICS_PROPERTIES.MACHINE_ID]: gameRoundData.machineId,
        [ANALYTICS_PROPERTIES.GAME_TOKEN_COST]: gameRoundData.tokensCost
      };
      if (!isUserLoggedIn) {
        // TODO handle this update on exit for when the user is refunded
        setUserProperties({ [ANALYTICS_PROPERTIES.PLAYER_TOKEN_AMOUNT]: 0 });
        eventProps = { ...eventProps, [ANALYTICS_PROPERTIES.ANONYMOUS_STATUS]: true };
      } else {
        setUserProperties({ [ANALYTICS_PROPERTIES.PLAYER_TOKEN_AMOUNT]: tokens });
        eventProps = { ...eventProps, [ANALYTICS_PROPERTIES.ANONYMOUS_STATUS]: false };
      }
      logEvent(ANALYTICS_EVENTS.GAME_PLAYED, eventProps);
      increaseUserProperty(ANALYTICS_PROPERTIES.PLAYER_PLAY_COUNT);
    }
  };

  const logGameRoundEvent = (_gameRoundId) => {
    logEvent(ANALYTICS_EVENTS.GAME_ROUND, {
      [ANALYTICS_PROPERTIES.GAME_ROUND_ID]: _gameRoundId
    });
  }

  if (controlWebsocket) {
    controlWebsocket.onmessage = e => {
      const data = JSON.parse(e.data);
      const { ret } = data;
      switch (ret) {
        case RET.GAME_START:
          clearTimeout(gameStartTracking.current);
          fetchPoints();
          hideHeader.current.hideComponents();
          hideHeaderRef();
          logGameRoundEvent(data?.gameRoundId);
          break;
        case RET.ROOM_ENTERED: {
          const { queuePosition, queueLength } = data;
          onUpdateQueue(data);
          clearTimeout(roomEnteredTracking.current);
          setGameSessionId(data.gameSessionId);
          setGameStatus({ queuePosition, queueLength });
          break;
        }
        case RET.STATUS_UPDATE: {
          const { queuePosition, queueLength } = data;
          // disabling queue info update when counting down because
          // sometimes we receive status_update command right after
          // next_player command and this causes component to re-render and therefore lose countdown
          if (playerStatus !== PLAYER_STATUS.NEXT_PLAYER) {
            onUpdateQueue(data);
          }
          setGameStatus({ queuePosition, queueLength });
          break;
        }
        case RET.NEXT_PLAYER: {
          setShowQuitAlert(false);
          onUpdateQueue(data);
          setGameStatus(data);
          setIsPlayButtonPressed(false);
          setPlayerStatus(PLAYER_STATUS.NEXT_PLAYER);
          break;
        }
        case RET.GAME_RESULT:
          getProfileInfo()
          clearTimeout(gameResultTracking.current);
          clearTimeout(grabActionTracking.current);
          amplitudeTracking(data.won);
          appsFlyerTracking(data.won);
          setPlayerPrizeId(data.playerPrizeId);
          if(machineType === MACHINE_TYPES.CUTTER || machineType === MACHINE_TYPES.DUNK_TANK){
          setTimeout(() => {
            setPlayerStatus(PLAYER_STATUS.GAME_ENDED);
            setIsGameWon(data.won);
            setShowGameResult(true);
          }, 5000);
          }
          else if(machineType === MACHINE_TYPES.KEYMASTER){
            setTimeout(() => {
              setPlayerStatus(PLAYER_STATUS.GAME_ENDED);
              setIsGameWon(data.won);
              setShowGameResult(true);
            }, 9000);
          }
          else if(machineType === MACHINE_TYPES.CLAW_TWO){
            setTimeout(() => {
              setPlayerStatus(PLAYER_STATUS.GAME_ENDED);
              setIsGameWon(data.won);
              setShowGameResult(true);
            }, 15000);
          }
          else{
          setPlayerStatus(PLAYER_STATUS.GAME_ENDED);
          setIsGameWon(data.won);
          setShowGameResult(true);
          }
          break;
        case RET.INVALID:
          handleError(data?.errorCode);
          break;
        default:
          break;
      }
    };

    controlWebsocket.onerror = () => {
      handleError();
    };
  }

  const addViewer = async () => {
    if (machineId) {
      try {
        await api.postMachineViewer(machineId,prize.prizeId);
      } catch (error) {
        // fail silently
      }
    }
  };

  const deleteViewer = async () => {
    if (machineId) {
      try {
        await api.deleteMachineViewer(machineId);
      } catch (error) {
        // fail silently
      }
    }
  };

  useEffect(() => {
    const { machineTypes: { typeCode } } = machineData
    if ((typeCode === MACHINE_TYPES.UFO || typeCode === MACHINE_TYPES.UFO_TWO || typeCode === MACHINE_TYPES.CUTTER || typeCode === MACHINE_TYPES.DUNK_TANK) && !showSideVideo && playerStatus === PLAYER_STATUS.GAME_ENDED) {
      setTimeout(() => {
        flipCamera();
      }, 1000);
    } else if ((typeCode === MACHINE_TYPES.KEYMASTER) && !showSideVideo && playerStatus === PLAYER_STATUS.GAME_ENDED) {
      setTimeout(() => {
        flipCamera();
      }, 6000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineData, showSideVideo, playerStatus]);

  useEffect(() => {
    if (appState === APP_STATE.ACTIVE) {
      addViewer();
    } else if (appState === APP_STATE.BACKGROUND) {
      deleteViewer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  useEffect(() => {
    pauseBackgroundMusic();
    return () => playMusic(SOUNDS.LOBBY_BACKGROUND_MUSIC);
  }, [pauseBackgroundMusic, playMusic]);

  useEffect(() => {
    if (shouldStartGame && playerStatus === PLAYER_STATUS.NEXT_PLAYER) {
      startPlaying(gameSessionId);
      setShouldStartGame(false);
    } else if (playerStatus === PLAYER_STATUS.GAME_ENDED) {
      setHasControlTouched(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldStartGame, playerStatus]);

  const cleanUpGamePlay = async (exitingGamePlay = false) => {
    if (exitingGamePlay) {
      deleteViewer();
    }

    if (controlWebsocket) {
      if (gameSessionId) {
        controlWebsocket.send(CMD.EXIT_ROOM(gameSessionId));
      }
      controlWebsocket.close();
      setControlWebsocket(null);
    }
  };

  const enterQueue = async (isFreePlay) => {
    const baseURL = machinesSocketBaseUrl ?
      machinesSocketBaseUrl.split("//") : Config.MACHINES_SOCKET_BASE_URL.split("//");
    const serverSocketUrl = `${baseURL[0]}//${socketSubDomain}${baseURL[1]}`;
    const webSocket = new WebSocket(serverSocketUrl);
    setControlWebsocket(webSocket);

    webSocket.onopen = async () => {
      try {
        const res = await api.postGameRounds(machineId, prize.prizeId, isFreePlay, challengeId);
          if (res.status === 201 && res.data) {
            const { data } = res;
            setGameRoundData(data);
            webSocket.send(await CMD.ENTER_ROOM(data.gameRoundId, profilePicture));
            roomEnteredTracking.current = detectWebSocketConnection(GAME_PLAY_EVENT_TIME_OUT.ROOM_ENTERED);
            setPlayerStatus(PLAYER_STATUS.IN_QUEUE);
            await fetchPoints();
            // enter machine queue analytics;
            logEvent(ANALYTICS_EVENTS.ENTERED_MACHINE_QUEUE, {
              [ANALYTICS_PROPERTIES.MACHINE_ID]: machineId
            });
          }  
      } catch (error) {
        setPlayerStatus(PLAYER_STATUS.WATCHING);
        setIsPlayButtonPressed(false);
        displayRequestError(error.message);
      }
    };
  };

  const handleStartGame = async (isFreePlay) => {
    playSoundEffect(SOUNDS.PLAY_GRAB_BUTTON);

    // First to check if the non VIP user has won before
    if (!isVip) {
      try {
        const res = await api.getProfileInfo();
        if (res.status === 200 && res.data) {
          const { gamesWon } = res.data;
          if (gamesWon && gamesWon > 0) {
            // if (!isUserLoggedIn) {
            //   setIsCreateAccountPopUpShown(true);
            // } else
            if (tokens < tokensCost && !isFreePlay) {
              setIsBecomeVipPopUpShown(true);
            } else {
              await enterQueue(isFreePlay);
              return;
            }
          } else {
            await enterQueue(isFreePlay);
            return;
          }
        }
      } catch (error) {
        displayRequestError(error.message);
      }
    } else if (tokens < tokensCost && !isFreePlay) {
      onOutOnTokenPress();
    } else {
      await enterQueue(isFreePlay);
      return;
    }
    setIsPlayButtonPressed(false);
  };

  const onPlayPress = async () => {
    setIsPlayButtonPressed(true);
    await FreePlayPopUpScreen()
    if (isPlayButtonPressed) {
      return;
    }
    if (getFreePlay > 0) {
      setShowFreePlayPopUp(true)
    }
    else {
      handleStartGame(false);
    }
  };

  const grab = () => {
    if (controlWebsocket) {
      playSoundEffect(SOUNDS.PLAY_GRAB_BUTTON);
      controlWebsocket.send(CMD.OPERATE(gameSessionId, OPERATION_TYPE.GRAB));
      grabActionTracking.current = detectWebSocketConnection(machineData?.machineTypes?.typeCode === MACHINE_TYPES.UFO ||
        machineData?.machineTypes?.typeCode === MACHINE_TYPES.UFO_TWO ?
        GAME_PLAY_EVENT_TIME_OUT.UFO_GRAB_TO_GAME_RESULT :
        GAME_PLAY_EVENT_TIME_OUT.GRAB_TO_GAME_RESULT);
      clearTimeout(gameResultTracking.current);
      setHasControlTouched(true);
    }
    setPlayerStatus(PLAYER_STATUS.GAME_ENDED);
  };

  const move = direction => {
    if (controlWebsocket) {
      controlWebsocket.send(CMD.OPERATE(gameSessionId, direction));
      setHasControlTouched(true);
    }
  };
  const UfoPressIn = async () => {
    playSoundEffect(SOUNDS.RIGHT_BUTTON);
    if (ufoStepsCount === 0) {
      setUfoStepsCount(1);
      if(machineData?.machineTypes?.typeCode === MACHINE_TYPES.CUTTER){
        move(showSideVideo ? OPERATION_TYPE.RIGHT : FLIP_OPERATION_TYPE.LEFT);
      }
      else{
      move(showSideVideo ? OPERATION_TYPE.RIGHT : FLIP_OPERATION_TYPE.RIGHT);
      }
    }

    if (ufoStepsCount === 2) {
      setUfoStepsCount(3);
      if(machineData?.machineTypes?.typeCode === MACHINE_TYPES.CUTTER){
      move(showSideVideo ? OPERATION_TYPE.RIGHT : FLIP_OPERATION_TYPE.LEFT);
      }
      else if(machineData?.machineTypes?.typeCode === MACHINE_TYPES.DUNK_TANK){
        move(showSideVideo ? OPERATION_TYPE.FORWARD : OPERATION_TYPE.FORWARD);
      }
      else if(machineData?.machineTypes?.typeCode === MACHINE_TYPES.KEYMASTER){
        move(showSideVideo ? OPERATION_TYPE.FORWARD : OPERATION_TYPE.FORWARD);
      }
      else if(machineData?.machineTypes?.typeCode === MACHINE_TYPES.UFO_TWO){
        move(showSideVideo ? OPERATION_TYPE.LEFT : FLIP_OPERATION_TYPE.LEFT);
      }
      else{
        move(showSideVideo ? OPERATION_TYPE.RIGHT : FLIP_OPERATION_TYPE.RIGHT);
      }
    }
  }

  const ufoTimerOut = async () => {
    if (ufoStepsCount === 1) {
      move(OPERATION_TYPE.STOP);
      move(showSideVideo ? FLIP_OPERATION_TYPE.RIGHT : OPERATION_TYPE.RIGHT);
      setTimeout(() => {
        move(OPERATION_TYPE.STOP);
        grab(); 
      }, 1);
    }
    if (ufoStepsCount === 2) {
      move(showSideVideo ? FLIP_OPERATION_TYPE.RIGHT : OPERATION_TYPE.RIGHT);
      setTimeout(() => {
        move(OPERATION_TYPE.STOP);
        grab();
      }, 1);
    }
    if (ufoStepsCount === 3) {
      move(OPERATION_TYPE.STOP);
      grab();
    }
    setUfoStepsCount(0);
  }
  const ufoMove = () => {
    if (ufoStepsCount === 1) {
      setUfoStepsCount(2);
      move(OPERATION_TYPE.STOP);
      setTimeout(() => {
        flipCamera();
      }, 1000);
    } else if (ufoStepsCount === 3) {
      move(OPERATION_TYPE.STOP);
      grab();
      setUfoStepsCount(0);
    }

  }

  const renderQuitMidGamePopup = () => {
    const { navigate } = navigation;
    const popUpInfo = {
      quitMidGameWithRefund: {
        icon: medalGold,
        bannerLabel: popUpStrings.leavingSoSoon,
        popupMessage: popUpStrings.leaveAndRefund
      },
      quitMidGameWithoutRefund: {
        icon: medalHourGlass,
        bannerLabel: popUpStrings.givingUp,
        popupMessage: popUpStrings.leaveAndForfeit
      },
      quitInQueue: {
        icon: medalHourGlass,
        bannerLabel: popUpStrings.leavingSoSoon,
        popupMessage: popUpStrings.leaveInQueue
      }
    };
    let info;
    if (playerStatus === PLAYER_STATUS.IN_QUEUE) {
      info = popUpInfo.quitInQueue;
    } else {
      info = hasControlTouched ? popUpInfo.quitMidGameWithoutRefund : popUpInfo.quitMidGameWithRefund;
    }



    return (
      <InstructionPopUp
        isVisible={showQuitAlert}
        buttonText={popUpStrings.yesLeave}
        bannerLabel={info.bannerLabel}
        bannerType={BANNER_TYPE.NORMAL}
        icon={info.icon}
        secondaryButtonOnPress={() => setShowQuitAlert(false)}
        onPress={async () => {
          await cleanUpGamePlay(true)
          setShowQuitAlert(false);
          navigate(SCREENS.GAME_ROOM);
        }}
      >
        <Text size={SIZE.SMALL} color={color.grayBlack}>
          {popUpStrings.areYouSure}
        </Text>
        <TextWrapper
          alignCenter
          marginTop={16}
          fontFamily={FONT_FAMILY.REGULAR}
          size={SIZE.SMALL}
          color={color.grayBlack}
        >
          {info.popupMessage}
        </TextWrapper>
      </InstructionPopUp>
    );
  };
  const handleUseLater = () => {
    setIsUseFreePlay(false)
    setShowFreePlayPopUp(false)
    const timer = Platform.OS === 'ios' ? 500 : 100;
    setTimeout(() => {
      handleStartGame(false)
    }, timer);
  }
  const handleOnPressFreePlay = () => {
    setShowFreePlayPopUp(false)
    setIsUseFreePlay(true)
    const timer = Platform.OS === 'ios' ? 500 : 100;
    setTimeout(() => {
      handleStartGame(true)
    }, timer);
  }
  return (
    <>
    <ControlPanelHeader 
      yAxis={yAxis} 
      prizeImageUrl={prize.imageUrl} 
      tokensCost={tokensCost}
      isFree={isFree}
      helpText={helpText}
      ref={hideHeader}
      />
    <PopUpWrapper>
      <NavigationEvents onWillBlur={() => cleanUpGamePlay(true)} />
      <ControlContainer   
        onLayout={event => {
              const { y } = event.nativeEvent.layout;
              setYAxis(y);
        }}>
          <FreePlayPopUp
            isVisible={showFreePlayPopUp}
            useLater={handleUseLater}
            buttonText={popUpStrings.goToStore}
            bannerLabel={popUpStrings.outOfToken}
            icon={FreePlayPopUpButton}
            notificationIcon={NotificationCircle}
            textButtonLabel={popUpStrings.useLater}
            onPress={handleOnPressFreePlay}
          />
        <OuterPanel>
          <Panel source={controlPanelBackground} resizeMode="stretch">
            { machineType === MACHINE_TYPES.UFO &&  <>
                <DirectionArea>
                  <SingleButtonRow>
                    <ControlButton
                      disabled={playerStatus !== PLAYER_STATUS.PLAYING}
                      size={CONTROL_BUTTON_SIZE.XLARGE}
                      type={ (machineType === MACHINE_TYPES.CUTTER && !showSideVideo) ? CONTROL_BUTTON_TYPE.LEFT:CONTROL_BUTTON_TYPE.RIGHT}
                      pressInAction={() => {
                        UfoPressIn()

                      }}
                      pressOutAction={ufoMove}
                    />
                  </SingleButtonRow>
                </DirectionArea>
                <ActionArea>
                  <ControlButton
                    disabled={
                      isPlayButtonPressed ||
                      (playerStatus !== PLAYER_STATUS.WATCHING && playerStatus !== PLAYER_STATUS.PLAYING) ||
                      playerStatus === PLAYER_STATUS.PLAYING
                    }
                    size={CONTROL_BUTTON_SIZE.LARGE}
                    type={CONTROL_BUTTON_TYPE.PLAY}
                    pressInAction={onPlayPress}
                  />
                </ActionArea>
              </> }
              { machineType === MACHINE_TYPES.UFO_TWO &&  <>
                <DirectionArea>
                  <SingleButtonRow>
                    <ControlButton
                      disabled={playerStatus !== PLAYER_STATUS.PLAYING}
                      size={CONTROL_BUTTON_SIZE.XLARGE}
                      type={ (machineType === MACHINE_TYPES.UFO_TWO && !showSideVideo) ? CONTROL_BUTTON_TYPE.RIGHT : CONTROL_BUTTON_TYPE.RIGHT}
                      pressInAction={() => {
                        UfoPressIn()

                      }}
                      pressOutAction={ufoMove}
                    />
                  </SingleButtonRow>
                </DirectionArea>
                <ActionArea>
                  <ControlButton
                    disabled={
                      isPlayButtonPressed ||
                      (playerStatus !== PLAYER_STATUS.WATCHING && playerStatus !== PLAYER_STATUS.PLAYING) ||
                      playerStatus === PLAYER_STATUS.PLAYING
                    }
                    size={CONTROL_BUTTON_SIZE.LARGE}
                    type={CONTROL_BUTTON_TYPE.PLAY}
                    pressInAction={onPlayPress}
                  />
                </ActionArea>
              </> }
              { machineType === MACHINE_TYPES.CUTTER &&  <>
                <DirectionArea>
                  <SingleButtonRow>
                    <ControlButton
                      disabled={playerStatus !== PLAYER_STATUS.PLAYING}
                      size={CONTROL_BUTTON_SIZE.XLARGE}
                      type={ (machineType === MACHINE_TYPES.CUTTER && !showSideVideo) ? CONTROL_BUTTON_TYPE.LEFT:CONTROL_BUTTON_TYPE.RIGHT}
                      pressInAction={() => {
                        UfoPressIn()

                      }}
                      pressOutAction={ufoMove}
                    />
                  </SingleButtonRow>
                </DirectionArea>
                <ActionArea>
                  <ControlButton
                    disabled={
                      isPlayButtonPressed ||
                      (playerStatus !== PLAYER_STATUS.WATCHING && playerStatus !== PLAYER_STATUS.PLAYING) ||
                      playerStatus === PLAYER_STATUS.PLAYING
                    }
                    size={CONTROL_BUTTON_SIZE.LARGE}
                    type={CONTROL_BUTTON_TYPE.PLAY}
                    pressInAction={onPlayPress}
                  />
                </ActionArea>
              </> }
              { machineType === MACHINE_TYPES.DUNK_TANK &&  <>
                <DirectionArea>
                  <SingleButtonRow>
                    <ControlButton
                      disabled={playerStatus !== PLAYER_STATUS.PLAYING}
                      size={CONTROL_BUTTON_SIZE.XLARGE}
                      type={ (machineType === MACHINE_TYPES.DUNK_TANK && !showSideVideo) ? CONTROL_BUTTON_TYPE.UP:CONTROL_BUTTON_TYPE.RIGHT}
                      pressInAction={() => {
                        UfoPressIn()

                      }}
                      pressOutAction={ufoMove}
                    />
                  </SingleButtonRow>
                </DirectionArea>
                <ActionArea>
                  <ControlButton
                    disabled={
                      isPlayButtonPressed ||
                      (playerStatus !== PLAYER_STATUS.WATCHING && playerStatus !== PLAYER_STATUS.PLAYING) ||
                      playerStatus === PLAYER_STATUS.PLAYING
                    }
                    size={CONTROL_BUTTON_SIZE.LARGE}
                    type={CONTROL_BUTTON_TYPE.PLAY}
                    pressInAction={onPlayPress}
                  />
                </ActionArea>
              </> }
              { machineType === MACHINE_TYPES.KEYMASTER &&  <>
                <DirectionArea>
                  <SingleButtonRow>
                    <ControlButton
                      disabled={playerStatus !== PLAYER_STATUS.PLAYING}
                      size={CONTROL_BUTTON_SIZE.XLARGE}
                      type={ (machineType === MACHINE_TYPES.KEYMASTER && !showSideVideo) ? CONTROL_BUTTON_TYPE.UP:CONTROL_BUTTON_TYPE.RIGHT}
                      pressInAction={() => {
                        UfoPressIn()

                      }}
                      pressOutAction={ufoMove}
                    />
                  </SingleButtonRow>
                </DirectionArea>
                <ActionArea>
                  <ControlButton
                    disabled={
                      isPlayButtonPressed ||
                      (playerStatus !== PLAYER_STATUS.WATCHING && playerStatus !== PLAYER_STATUS.PLAYING) ||
                      playerStatus === PLAYER_STATUS.PLAYING
                    }
                    size={CONTROL_BUTTON_SIZE.LARGE}
                    type={CONTROL_BUTTON_TYPE.PLAY}
                    pressInAction={onPlayPress}
                  />
                </ActionArea>
              </> }
              { !(machineType === MACHINE_TYPES.UFO || machineType === MACHINE_TYPES.UFO_TWO || machineType === MACHINE_TYPES.CUTTER || machineType === MACHINE_TYPES.DUNK_TANK || machineType === MACHINE_TYPES.KEYMASTER)
                &&  <>
                <DirectionArea>
                  <SingleButtonRow>
                    <ControlButton
                      shrinkTop={false}
                      disabled={playerStatus !== PLAYER_STATUS.PLAYING}
                      size={CONTROL_BUTTON_SIZE.SMALL}
                      type={CONTROL_BUTTON_TYPE.UP}
                      pressInAction={() => {
                        playSoundEffect(SOUNDS.UP_BUTTON);
                        move(showSideVideo ? OPERATION_TYPE.BACKWARD : FLIP_OPERATION_TYPE.BACKWARD);
                      }}
                      pressOutAction={() => {
                        move(OPERATION_TYPE.STOP);
                      }}
                    />
                  </SingleButtonRow>
                  <MultiButtonRow>
                    <ControlButton
                      disabled={playerStatus !== PLAYER_STATUS.PLAYING}
                      size={CONTROL_BUTTON_SIZE.SMALL}
                      type={CONTROL_BUTTON_TYPE.LEFT}
                      pressInAction={() => {
                        playSoundEffect(SOUNDS.LEFT_BUTTON);
                        move(showSideVideo ? OPERATION_TYPE.LEFT : FLIP_OPERATION_TYPE.LEFT);
                      }}
                      pressOutAction={() => {
                        move(OPERATION_TYPE.STOP);
                      }}
                    />
                    <ControlButton
                      disabled={playerStatus !== PLAYER_STATUS.PLAYING}
                      size={CONTROL_BUTTON_SIZE.SMALL}
                      type={CONTROL_BUTTON_TYPE.RIGHT}
                      pressInAction={() => {
                        playSoundEffect(SOUNDS.RIGHT_BUTTON);
                        move(showSideVideo ? OPERATION_TYPE.RIGHT : FLIP_OPERATION_TYPE.RIGHT);
                      }}
                      pressOutAction={() => {
                        move(OPERATION_TYPE.STOP);
                      }}
                    />
                  </MultiButtonRow>
                  <SingleButtonRow>
                    <ControlButton
                      shrinkTop={heightRatio <= 1}
                      disabled={playerStatus !== PLAYER_STATUS.PLAYING}
                      size={CONTROL_BUTTON_SIZE.SMALL}
                      type={CONTROL_BUTTON_TYPE.DOWN}
                      pressInAction={() => {
                        playSoundEffect(SOUNDS.DOWN_BUTTON);
                        move(showSideVideo ? OPERATION_TYPE.FORWARD : FLIP_OPERATION_TYPE.FORWARD);
                      }}
                      pressOutAction={() => {
                        move(OPERATION_TYPE.STOP);
                      }}
                    />
                  </SingleButtonRow>
                </DirectionArea>
                <ActionArea>
                  <ControlButton
                    disabled={
                      isPlayButtonPressed ||
                      (playerStatus !== PLAYER_STATUS.WATCHING && playerStatus !== PLAYER_STATUS.PLAYING)
                    }
                    size={CONTROL_BUTTON_SIZE.LARGE}
                    type={playerStatus === PLAYER_STATUS.PLAYING ?
                      CONTROL_BUTTON_TYPE.GRAB : CONTROL_BUTTON_TYPE.PLAY}
                    pressInAction={playerStatus === PLAYER_STATUS.PLAYING ? grab : onPlayPress}
                  />
                </ActionArea>
              </>
              }
          </Panel>
        </OuterPanel>
      </ControlContainer>
      <GamePlayStatusBar
        playerStatus={playerStatus}
        flipCamera={flipCamera}
        time={machineData?.machineTypes?.typeCode === MACHINE_TYPES.UFO 
            || machineData?.machineTypes?.typeCode === MACHINE_TYPES.UFO_TWO 
          ? gameDuration - GAME_PLAY_EVENT_TIME_OUT.UFO_DURATION_BUFFER
          : gameDuration
        }
        machineData={machineData}
        onPlayPress={onPlayPress}
        navigation={navigation}
        queuePosition={gameStatus.queuePosition}
        onTimerEnd={() => {
          if ((machineData?.machineTypes?.typeCode === MACHINE_TYPES.UFO || 
            machineData?.machineTypes?.typeCode === MACHINE_TYPES.UFO_TWO || 
            machineData?.machineTypes?.typeCode === MACHINE_TYPES.CUTTER)) {
            ufoTimerOut()
          }
          setPlayerStatus(PLAYER_STATUS.GAME_ENDED);
          setShowQuitAlert(false);


        }}
        onPressBuyToken={onPressBuyToken}
      />
      {renderQuitMidGamePopup()}
      <StyledModal isVisible={showGameResult}>
        <GameResultView
          isGameWon={isGameWon}
          playerPrizeId={playerPrizeId}
          navigation={navigation}
          gameRoundData={gameRoundData}
          machineData={machineData}
          queueLength={gameStatus.queueLength}
          playerStatus={playerStatus}
          setPlayerStatus={setPlayerStatus}
          setShowGameResult={setShowGameResult}
          cleanUpGamePlay={cleanUpGamePlay}
          isUseFreePlay={isUseFreePlay}
          goBackToGame={async (isFreePlay) => {
            if (playerStatus === PLAYER_STATUS.WATCHING) {
              await enterQueue(isFreePlay);
            } else {
              setPlayerStatus(PLAYER_STATUS.NEXT_PLAYER);
            }
            playMusic(SOUNDS.GAME_PLAY_MUSIC);
            setIsGameWon(false);
            setShowGameResult(false);
          }}
          exitQueue={() => {
            cleanUpGamePlay();
            setPlayerStatus(PLAYER_STATUS.WATCHING);
          }}
          challengeIndex={challengeIndex}
          selectedChallenge={selectedChallenge}
        />
      </StyledModal>
    </PopUpWrapper>
    </>
  );
};

ControlPanel.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired,
  flipCamera: PropTypes.func.isRequired,
  onOutOnTokenPress: PropTypes.func.isRequired,
  machineData: PropTypes.shape({
    socketSubDomain: PropTypes.string.isRequired,
    isFree: PropTypes.bool.isRequired,
    macAddress: PropTypes.string.isRequired,
    gameDuration: PropTypes.number.isRequired,
    machineId: PropTypes.number.isRequired,
    tokensCost: PropTypes.number.isRequired,
    viewStreamAccount: PropTypes.string.isRequired,
    viewStreamId1: PropTypes.string.isRequired,
    viewStreamId2: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    machineTypes: PropTypes.shape({
      typeCode: PropTypes.number.isRequired,
      helpText: PropTypes.string.isRequired
    }),
    prize: PropTypes.shape({
      prizeId: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired
    }).
      isRequired,
  }).isRequired,
  playerStatus: PropTypes.string.isRequired,
  setPlayerStatus: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  onUpdateQueue: PropTypes.func.isRequired,
  setIsMachineNotAvailablePopUp: PropTypes.func.isRequired,
  shouldStartGame: PropTypes.bool.isRequired,
  setShouldStartGame: PropTypes.func.isRequired,
  showQuitAlert: PropTypes.bool.isRequired,
  setShowQuitAlert: PropTypes.func.isRequired,
  showSideVideo: PropTypes.bool.isRequired,
  onPressBuyToken: PropTypes.func.isRequired,
  hideHeaderRef: PropTypes.func.isRequired
  // useFreePlay: PropTypes.bool.isRequired,

};

export default ControlPanel;
