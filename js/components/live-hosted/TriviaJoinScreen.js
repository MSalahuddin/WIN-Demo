import React, { useEffect, useState, useContext, useRef } from 'react';
import styled from 'styled-components/native';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import { NavigationActions, StackActions } from 'react-navigation';
import { coin, ScatteredCircleBackGround, triviaNewBackground, liveTriviaLogo } from '../../../assets/images';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import { scale, scaleHeight, scaleWidth } from '../../platformUtils';
import { color } from '../../styles';
import Timer from './Timer';
import { liveHostedStrings } from '../../stringConstants';
import { SCREENS, LOCAL_STORAGE_NAME } from '../../constants';
import { UserContext } from "../../context/User.context";
import { CMD, RET } from './Utils';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { convertToSeconds } from "../../utils";
import BottomNavigator from '../game-room/BottomBar';
import { Platform } from 'react-native';
const ParentBackground = styled.ImageBackground`
height: 100%;
width: 100%;
`;
const Background = styled.ImageBackground`
height: ${Platform.OS === "android" ? "80%" : "75%"};
width: 100%;
margin-top: ${Platform.OS === "android" ? "20%" : "25%"};
align-items: center;
`;
const TriviaStartInText = styled(Text)`
text-align: center;
margin-top: ${Platform.OS === "android" ? scaleHeight(40) : scaleHeight(40)};
`;
const Logo = styled.Image`
height: ${scale(150)};
width: ${scale(500)};
align-self: center;
margin-vertical:${Platform.OS === "android" ? scaleHeight(0) : scaleHeight(10)}
`;
const TitleText = styled(Text)`
text-align: center;
margin-vertical: ${Platform.OS === "android" ? scaleHeight(0) : scaleHeight(10)}
`;
const TicketText = styled(Text)`
text-align: center;
`;
const ButtonText = styled(Text)``;
const ButtonWrapper = styled.TouchableOpacity`
background-color: ${color.white};
border-radius: ${scale(50)};
height: ${Platform.OS === "android" ? scaleHeight(55) : scaleHeight(45)}
width: ${scaleWidth(260)}
margin-top: ${scaleHeight(15)};
flex-direction: row;
align-items: center;
justify-content: center;
`;
const ButtonIcon = styled.Image`
margin-left: ${scale(10)};
align-self: center;
`;
const RandomText = styled(Text)`
text-decoration: underline;
text-align: center;
margin-vertical: ${scale(20)};
`;
const TimerContainer = styled.View`
background-color: ${color.dustyGray}
width: ${scaleWidth(150)};
height: ${Platform.OS === "android" ? scaleHeight(50) : scaleHeight(40)};
border-radius: ${scale(50)};
margin-vertical: ${scale(10)};
`;
const TriviaJoinScreen = ({ navigation }) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [controlChatWebsocket, setControlChatWebsocket] = useState(null);
  const [controlWebsocket, setControlWebsocket] = useState(null);
  const [isTriviaPlayer, setIsTriviaPlayer] = useState(false);
  const [isTriviaWatcher, setIsTriviaWatcher] = useState(false);
  const [isTriviaStarted, setIsTriviaStarted] = useState(false);
  const { playerId } = useContext(UserContext);
  const pingChatWebSocketIntervalRef = useRef(null);
  const pingWebSocketIntervalRef = useRef(null);

  const { item } = navigation.state.params;
  const getRemainingTimeInSec = async () => {
    const {remainingDays, remainingHour, remainingMinutes, remainingSecounds} = item;
    const numberOfSec = convertToSeconds(remainingDays, remainingHour, remainingMinutes, remainingSecounds);
    setRemainingTime(numberOfSec);
  };
  const getPlayerState = async () => {
    let triviaWatcher = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.TRIVIA_WATCHER);
    let triviaPlayer = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.TRIVIA_PLAYER);
    triviaWatcher = await JSON.parse(triviaWatcher);
    triviaPlayer = await JSON.parse(triviaPlayer);
    if (triviaPlayer !== null) {
      setIsTriviaPlayer(triviaPlayer?.active);
      setIsTriviaWatcher(false);
    } else if (triviaWatcher !== null)
      setIsTriviaWatcher(triviaWatcher?.active);
  }
  useEffect(() => {
    getRemainingTimeInSec();
    setSocketConnection();
    getPlayerState();
    return () => cleanSocketListner();
  }, []);

  const cleanSocketListner = async () => {
    if (controlChatWebsocket || controlWebsocket) {
      controlChatWebsocket.close();
      controlWebsocket.close();
      setControlChatWebsocket(null);
      setControlWebsocket(null);
      clearInterval(pingChatWebSocketIntervalRef.current);
      clearInterval(pingWebSocketIntervalRef.current);
    }
  };

  handleTriviaEnded = async () => {
    try {
      await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.TRIVIA_WATCHER);
      await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.TRIVIA_PLAYER);
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: SCREENS.DIGITAL_GAME_ROOM })],
      });
      this.props.navigation.dispatch(resetAction);
    } catch (error) {
    }
  };

  const setSocketConnection = () => {
    const serverChatSocketUrl = `${Config.TRIVIA_SOCKET_URL}/LiveHostedChatWebsocket`;
    const serverSocketUrl = `${Config.TRIVIA_SOCKET_URL}/LiveHostedWebsocket`;
    const chatWebSocket = new WebSocket(serverChatSocketUrl);
    const webSocket = new WebSocket(serverSocketUrl);
    setControlChatWebsocket(chatWebSocket);
    setControlWebsocket(webSocket);
    chatWebSocket.onopen = async () => {
      chatWebSocket.send(await CMD.ADD_WATCHER(item?.triviaId, playerId));
      chatWebSocket.send(await CMD.GET_TRIVIA_SESSION({ triviaId: item?.triviaId, playerId }));
      pingChatWebSocketIntervalRef.current = setInterval(async () => {
        chatWebSocket.send(await CMD.TRIVIA_CONNECTION_PING());
      }, 15000);
    };
    webSocket.onopen = async () => {
      pingWebSocketIntervalRef.current = setInterval(async () => {
        webSocket.send(await CMD.TRIVIA_CONNECTION_PING());
      }, 15000);
    };
  }
  if (controlChatWebsocket) {
    controlChatWebsocket.onmessage = async e => {
      const data = JSON.parse(e.data);
      const { ret } = data;
      switch (ret) {
        case RET.VIEWER:
          await AsyncStorage.setItem(LOCAL_STORAGE_NAME.TRIVIA_WATCHER, JSON.stringify({ active: true }));
          break;
        case RET.GAME_START:
          setIsTriviaStarted(data?.isGameStarted);
          data?.isGameStarted && setRemainingTime(null)
          getPlayerState();
          break;
        case RET.TRIVIA_END:
          if (data?.isGameEnded) {
            this.handleTriviaEnded();
          }
          break;
        default:
          break;
      }
    };
    controlChatWebsocket.onerror = (error) => {
      // this.handleError();
    };
  };
  if (controlWebsocket) {
    controlWebsocket.onmessage = async e => {
      const data = JSON.parse(e.data);
      const { ret } = data;
      switch (ret) {
        case RET.GAME_JOINED:
          await AsyncStorage.setItem(LOCAL_STORAGE_NAME.TRIVIA_PLAYER, JSON.stringify({ active: true }));
          break;
        default:
          break;
      }
    };
    controlWebsocket.onerror = (error) => {
      // this.handleError();
    };
  };
  const handleAddWatch = async () => {
    controlChatWebsocket.send(await CMD.ADD_WATCHER(item?.triviaId, playerId));
  }
  const joinTrivia = async () => {
    if (!isTriviaStarted) {
      controlWebsocket.send(await CMD.ENTER_ROOM(item?.triviaId, item?.tokensCost, playerId))
    } else {
      cleanSocketListner();
      navigation.navigate(SCREENS.LIVE_HOSTED, { item });
    }
  };

  return (
    <ParentBackground source={ScatteredCircleBackGround} resizeMode="stretch">
      <Background source={triviaNewBackground} resizeMode="stretch">
        <TriviaStartInText aligncenter fontFamily={FONT_FAMILY.MEDIUM} size={SIZE.LARGE} color={color.white}>
          {liveHostedStrings.beginsIn}
        </TriviaStartInText>
        { isTriviaStarted &&
          <TimerContainer>
            <Timer remainingTimeInSec={0} />
          </TimerContainer>
        }
        {
          remainingTime && <TimerContainer>
            <Timer remainingTimeInSec={remainingTime} />
          </TimerContainer>
        }
        <Logo source={liveTriviaLogo} resizeMode="contain" />
        <TitleText aligncenter fontFamily={FONT_FAMILY.BOLD} size={SIZE.XXXLARGE} color={color.white}>
          {liveHostedStrings.win}
        </TitleText>
        <TicketText
          isUppercase={true}
          aligncenter
          fontFamily={FONT_FAMILY.BOLD}
          size={SIZE.LARGEST}
          color={color.white}
        >
          {`${item?.ticketPrizeAmount} ${liveHostedStrings.tickets}`}
        </TicketText>
        <ButtonWrapper onPress={() => joinTrivia()}>
          <ButtonText
            size={SIZE.LARGE}
            color={color.black}
            fontFamily={FONT_FAMILY.BOLD}
            marginTop={Platform.OS === 'ios' ? 10 : 0}
            marginHorizontal={20}
            alignCenter
          >
            {isTriviaStarted ?
              isTriviaPlayer ?
                `${liveHostedStrings.enter}` :
                `${liveHostedStrings.watch}` :
              `${liveHostedStrings.join} ${item?.tokensCost}`
            }
          </ButtonText>
          {!isTriviaStarted && <ButtonIcon source={coin} resizeMode="contain" />}
        </ButtonWrapper>
        {!isTriviaStarted && <TouchableOpacity disabled={isTriviaPlayer || isTriviaWatcher} onPress={() => handleAddWatch()}>
          <RandomText aligncenter fontFamily={FONT_FAMILY.MEDIUM} size={SIZE.NORMAL} color={color.white}>
            {liveHostedStrings.watch}
          </RandomText>
        </TouchableOpacity>}
      </Background>
      <BottomNavigator
        navigation={navigation}
        setLoader={() => {
          setIsLoading(true);
        }}
        dismissLoader={() => {
          setIsLoading(false);
        }}
      />
    </ParentBackground>
  );
};
TriviaJoinScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        item: PropTypes.shape(),
      })
    })
  }).isRequired
};
export default TriviaJoinScreen;