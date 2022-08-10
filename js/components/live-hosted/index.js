import React, { Component, createRef } from 'react';
import { View, Platform, FlatList, TextInput, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import Config from 'react-native-config';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions, StackActions } from 'react-navigation';
import InCallManager from 'react-native-incall-manager';
import {
  ScatteredCircleBackGround,
  comment,
  share_button,
  question_icon
} from '../../../assets/images';
import { heightRatio, scale, scaleHeight, scaleWidth, getWindowWidth, getWindowHeight } from '../../platformUtils';
import { color, buttonColor } from '../../styles';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import ActionSheet from 'react-native-actions-sheet';
import NewLifePopUp from './NewLifePopUp';
import Header from './Header';
import TokenToPlay from './TokenToPlay';
import Comments from './Comments';
import MiddleIcon from './MiddleIcon';
import RightIcon from './RightIcon';
import { liveHostedStrings } from '../../stringConstants';
import { LOCAL_STORAGE_NAME, SCREENS } from '../../constants';
import LiveHostedJoinPopUp from './LiveHostedJoinPopUp';
import { createMillicastClient } from '../millicast/client';
import { sideStreamConfig } from '../millicast/config';
import { RTCView } from 'react-native-webrtc';
import { CMD, RET } from './Utils';
import { UserContext } from "../../context/User.context";
import { BackgroundMusicContext } from "../../context/BackgroundMusic.context";
import Countdown from '../game-play/Countdown';
import { displayError, convertToSeconds } from '../../utils';
import api from '../../api';
import EliminatedPopUp from "./EliminatedPopUp";
import { SOUNDS } from '../../soundUtils';
import { congratsYouWonAnimation } from '../../../assets/animations';

const GameContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${color.white};
`;
const Background = styled.ImageBackground`
  height: 100%;
  width: 100%;
`;
const Container = styled.View`
  position:absolute;
`;
const BottomBar = styled.View`
  padding-horizontal: ${scaleWidth(20)};
  height: ${scale(75)};
  background-color: ${color.white};
  width: 100%;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;
const LeftIconsContainer = styled.View``;
const CommentIconContainer = styled.TouchableOpacity``;
const CommentIcon = styled.Image`
  height: ${scale(60)};
  width: ${scale(60)};
`;
const QuestionIconContainer = styled.TouchableOpacity`
  position: relative;
  align-items: center;
  justify-content: center;
  height: ${scale(60)};
  width: ${scale(60)};
  border-radius: ${scale(30)};
  border-width: ${scale(4)};
  border-color: ${color.questionMarkIcon};
`;
const QuestionMarkTextWrapper = styled.View`
  position: absolute;
  top: ${scale(-8)};
  left: ${scale(-8)};
  height: ${scale(25)};
  width: ${scale(25)};
  align-items: center;
  justify-content: center;
  background-color: ${color.questionMarkIcon};
  border-radius: ${scale(25)};
`
const QuestionMarkText = styled(Text)`
margin-top: ${Platform.OS === 'ios' ? scale(10) : 0};
`
const QuestionIconText = styled(Text)``;
const LastThreeSecContainer = styled.View`
  margin-vertical: ${scale(90)};
  align-items: center;
  justify-content: center;
`;
const LastThreeSec = styled.Image`
width: ${scale(150)}
height: ${scale(150)}
`;
const ShareIcon = styled.Image`
height: ${scale(35)}
width: ${scale(35)}
`;
const ShareIconText = styled(Text)`
margin-vertical: ${scale(2)}`;
const Winners = styled(ActionSheet)``;
const WinnerActionSheetContainer = styled.View`
margin-horizontal:${scaleWidth(50)}
margin-vertical:${scaleHeight(10)}
align-items: center;
justify-content: center;
`;
const ContestQuestion = styled(ActionSheet)``;
const ActionSheetContainer = styled.View`
margin-horizontal:${scaleWidth(50)}
margin-vertical:${scaleHeight(10)}
align-items: center;
justify-content: center;
`;
const AnswerResultHeadingTag = styled.View`
  height: ${scale(40)};
  width: ${scale(150)};
  position: absolute;
  top: ${scale(-68)}
  border-Top-Right-Radius: ${scale(20)};
  border-Top-Left-Radius: ${scale(20)};
  background-Color: ${({ backgroundColor }) => backgroundColor};
  align-items: center;
  justify-content: center;
`;
const AnswerResultHeadingText = styled(Text)`
`;
const CommentActionSheet = styled(ActionSheet)``;
const Question = styled(Text)`
  text-align: center;
  justify-content: center;
`;
const OptionContainer = styled.TouchableOpacity`
border-Color: ${({ isSelectedAns }) => (isSelectedAns ? color.gameCardGradient1 : color.disabledButtonBorderColor)};
margin-vertical: ${scaleHeight(5)}
border-width: ${scale(3)};
width: ${scaleWidth(300)}
height: ${scaleHeight(50)}
border-radius: ${scale(50)}
text-align: center;
justify-content: center;
`;
const OptionContainerForAnswerResult = styled.View`
  border-Color: ${color.disabledButtonBorderColor};
  margin-vertical: ${scaleHeight(5)};
  border-width: ${scale(3)};
  width: ${scaleWidth(300)};
  height: ${scaleHeight(50)};
  border-radius: ${scale(50)};
  justify-content: center;
  position: relative;
`;
const OptionTextContainer = styled.View`
  border-Color: ${({ borderColor }) => borderColor};
  background-Color: ${({ backgroundColor }) => backgroundColor};
  border-width: ${({ width }) => width > 0 ? scale(3) : 0};
  border-radius: ${({ width }) => width > 0 ? scale(50) : 0};
  border-top-right-radius: ${({ borderRadius }) => scale(borderRadius)};
  border-bottom-right-radius: ${({ borderRadius }) => scale(borderRadius)};
  margin-vertical: ${({ width }) => width > 0 ? scaleHeight(5) : 0};
  justify-content: center;
  position: absolute;
  height: ${({ width }) => width > 0 ? scaleHeight(50) : 0};
  width: ${({ width }) => `${width + 2}%` || 0};
  left:${scale(-3)};
`;
const OptionText = styled(Text)``;
const OptionResultText = styled(Text)`
  margin-left: ${scale(16)};
  margin-right: ${scale(45)};
`;
const OptionPercentageText = styled(Text)`
  position: absolute;
  right: ${scale(10)}
`;
const WinnerContainer = styled.View`
  margin-top: ${scale(12)};
  margin-horizontal: ${scaleWidth(35)};
`;
const ImageIcon = styled.Image`
  border-color: ${color.white};
  background-color: ${color.white};
  border-radius: ${scale(34)};
  border-width: 2;
  height: ${scale(60)};
  width: ${scale(60)};
`;
const ImageIconContainer = styled.View`
  flex-direction: row;
  position: absolute;
  top: ${-scaleHeight(45)};
  margin-horizontal: ${-scaleWidth(15)};
`;
const WinnerTextWrapper = styled(Text)`
width: ${scaleWidth(105)}
height: ${scaleHeight(100)}
text-align: center;
top: ${Platform.OS !== 'android' ? scaleHeight(25) : scaleHeight(15)};
`;
const WinnerTextContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-left: 9;
  width: ${scaleWidth(250)};
`;
const WinnerTitle = styled(Text)`
  text-align: center;
`;

const Video = styled(RTCView)`
  flex: 1;
`;

const VideoContainer = styled.View`
  flex: 11;
`;

const LoadingContainer = styled.View`
  align-items: center;
  flex: 1;
  justify-content: center;
`;
const CommentContainer = styled.View`
  align-items: flex-end;
  position: absolute;
  width: ${getWindowWidth() * 0.7};
  height: ${getWindowHeight() * 0.2};
  bottom: ${scale(120)};
`;
const ShareIconContainer = styled.View`
position: absolute;
right:${scale(15)}
bottom:${scale(200)}`;

const WinnerContainerRow = styled.View`
  border-right-width: ${scaleWidth(16)};
  border-top-width: ${scaleHeight(38)};
  border-right-color: transparent;
  background-color: transparent;
  width: ${scaleWidth(320)};
  border-top-color: ${color.prizePopupCardTextBackground};
  margin-vertical: ${scaleHeight(5)};
`;
class LiveHosted extends Component {
  constructor(props) {
    super(props);
    this.ActionSheetRef = createRef();
    this.ActionSheetRef1 = createRef();
    this.ActionSheetRef2 = createRef();
    this.answerResultRef = createRef();
    this.commentRef = createRef();
    this.pingChatWebSocketIntervalRef = createRef();
    this.pingWebSocketIntervalRef = createRef();
    this.congratsAnimationRef = createRef();
    this.state = {
      selectedOption: null,
      isVisibleNewLifePopUp: false,
      isVisibleJoinPopUp: false,
      controlWebsocket: null,
      controlChatWebsocket: null,
      shouldStartGame: true,
      watchers: 0,
      trivia: props.navigation.state?.params?.item,
      question: null,
      selectedAnswer: null,
      answerResult: null,
      comments: [],
      comment: null,
      remainingTime: null,
      isTriviaPlayer: false,
      isTriviaWatcher: false,
      showEleminatedPopup: false,
      noOfTotalQuestion: 0,
      isWinnerVisible: false,
      triviaWinners: null,
      isTriviaStarted: false,
      isEleminated: false,
      lastSelectedQuestionNo: 0,
      isCongratsAnimationStart: false,
      shouldEndTime: false
    };
    this.side = sideStreamConfig(props.navigation.state?.params?.item?.accountId, props.navigation.state?.params?.item?.streamId);
    this.millicastClientSide = createMillicastClient(this.side);
  }

  async componentDidMount() {
    const { pauseBackgroundMusic } = this.props.backgroundMusicContext;
    InCallManager.start();
    InCallManager.setForceSpeakerphoneOn(true)
    pauseBackgroundMusic();
    this.getRemainingTimeInSec();
    await this.getPlayerState();
    this.joinTrivia();
    this.getTriviaById();
    try {
      const connectionSide = await this.connectToVideoStream(this.millicastClientSide, this.side);
      this.setState({
        connectionSide,
        isLoadingVideo: false
      }, () => { this.connectionListener() });
    } catch (error) {
      this.handleError();
    }
  };

  getTriviaById = async () => {
    const { trivia } = this.state;
    try {
      const triviaById = await api.getTriviaById(trivia?.triviaId);
      if (triviaById.data.success) {
        this.setState({
          noOfTotalQuestion: triviaById?.data?.data?.triviaQuestions?.length ? triviaById?.data?.data?.triviaQuestions?.length : 0,
        })
      }
    } catch (error) {
      // fail silently
    }
  }

  getRemainingTimeInSec = async () => {
    const { trivia } = this.state;
    const { remainingDays, remainingHour, remainingMinutes, remainingSecounds } = trivia;
    const numberOfSec = convertToSeconds(remainingDays, remainingHour, remainingMinutes, remainingSecounds);
    this.setState({ remainingTime: numberOfSec })
  };

  startGame = async () => {
    this.setState({ isVisibleJoinPopUp: true });
  }

  componentWillUnmount() {
    const { playMusic } = this.props.backgroundMusicContext;
    InCallManager.setForceSpeakerphoneOn(false);
    InCallManager.stop();
    playMusic(SOUNDS.LOBBY_BACKGROUND_MUSIC);
    if (Platform.OS === 'android') {
      clearInterval(this.connectionListenerInterval)
    }
    const { connectionSide } = this.state;
    this.stopVideo(connectionSide);
    this.cleanSocketListner();
    this.setState({
      isLoadingVideo: false,
      connectionSide: null,
    });
  };

  cleanSocketListner = async () => {
    const { controlChatWebsocket, controlWebsocket } = this.state;
    if (controlChatWebsocket || controlWebsocket) {
      controlChatWebsocket.close();
      controlWebsocket.close();
      this.setState({ controlChatWebsocket: null, controlWebsocket: null });
      clearInterval(this.pingChatWebSocketIntervalRef.current);
      clearInterval(this.pingWebSocketIntervalRef.current);
    }
  };

  clearControlSocket = () => {
    const { controlWebsocket } = this.state;
    controlWebsocket.close();
    this.setState({ controlWebsocket: null })
  }

  getPlayerState = async () => {
    let triviaWatcher = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.TRIVIA_WATCHER);
    let triviaPlayer = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.TRIVIA_PLAYER);
    triviaWatcher = await JSON.parse(triviaWatcher);
    triviaPlayer = await JSON.parse(triviaPlayer);
    if (triviaPlayer !== null) {
      this.setState({ isTriviaPlayer: true, isTriviaWatcher: false });
    } else if (triviaWatcher !== null) {
      this.setState({ isTriviaWatcher: true });
    }
  };

  joinTrivia = () => {
    const { trivia, isTriviaPlayer } = this.state;
    const { playerId } = this.props.userContext;
    const serverSocketUrl = `${Config.TRIVIA_SOCKET_URL}/LiveHostedWebsocket`;
    const chatServerSocketUrl = `${Config.TRIVIA_SOCKET_URL}/LiveHostedChatWebsocket`;
    const webSocket = new WebSocket(serverSocketUrl);
    const chatWebSocket = new WebSocket(chatServerSocketUrl);
    this.setState({ controlWebsocket: webSocket, controlChatWebsocket: chatWebSocket });

    webSocket.onopen = async () => {
      isTriviaPlayer && webSocket?.send(await CMD.ENTER_ROOM(trivia?.triviaId, trivia?.tokensCost, playerId));
      this.pingWebSocketIntervalRef.current = setInterval(async () => {
        webSocket.send(await CMD.TRIVIA_CONNECTION_PING());
      }, 15000);
    };

    chatWebSocket.onopen = async () => {
      const { playerId } = this.props.userContext;
      const { trivia } = this.state;
      chatWebSocket.send(await CMD.ADD_WATCHER(trivia?.triviaId, playerId));
      chatWebSocket.send(await CMD.GET_TRIVIA_SESSION({ triviaId: trivia?.triviaId, playerId }));
      this.pingChatWebSocketIntervalRef.current = setInterval(async () => {
        chatWebSocket.send(await CMD.TRIVIA_CONNECTION_PING());
      }, 15000);
    };
  };

  connectToVideoStream = async (client, clientConfig) => {
    if (!this.iceServers) {
      this.iceServers = await client.getIceServers();
    }
    const { viewerStreamAccountId, viewerStreamId } = clientConfig;
    const wsUrl = await client.viewDirector(viewerStreamAccountId, viewerStreamId);
    const isAudio = true;
    const connection = await client.viewStream(wsUrl, viewerStreamId, this.iceServers, isAudio);

    return connection;
  };

  stopVideo = connection => {
    if (connection) {
      connection.pc.close();
      connection.ws.close();
    }
  };

  connectionListener = async () => {
    if (Platform.OS === 'android') {
      // listening connection if it gets disconnected then reconnects it.
      const { connectionSide } = this.state;
      this.connectionListenerInterval = setInterval(async () => {
        if ((connectionSide && connectionSide.pc.iceConnectionState === 'disconnected')) {
          if (this.reconnectingInProgress) {
            this.reconnectingInProgress = false
            await this.reconnect()
          }
        }
      }, 1000);
    }
  };

  reconnect = async () => {
    setTimeout(async () => {
      try {
        const connectionSide = await this.connectToVideoStream(this.millicastClientSide, this.side);
        this.setState({
          connectionSide,
          // reconnecting: false
        }, () => {
          this.reconnectingInProgress = true
        });
      }
      catch (e) {
        // fall silently
      }
    }, 2500)
  };

  handleError = (errorCode = null) => { };

  setShouldStartGame = (shouldStartGame) => {
    console.log("🚀 ~ file: index.js ~ line 467 ~ LiveHosted ~ shouldStartGame", shouldStartGame)
    this.setState({ shouldStartGame });
  };

  setShouldEndTime = (shouldEndTime) => {
    console.log("🚀 ~ file: index.js ~ line 471 ~ LiveHosted ~ shouldEndTime", shouldEndTime)
    this.setState({ shouldEndTime });
  }

  handleJoinTrivia = async () => {
    try {
      const { controlWebsocket, trivia } = this.state;
      const { playerId } = this.props.userContext;
      controlWebsocket?.send(await CMD.ENTER_ROOM(trivia?.triviaId, trivia?.tokensCost, playerId));
    } catch (error) {
    }
  };

  sendMessage = async () => {
    const { controlChatWebsocket, trivia, comment } = this.state;
    const { playerId, userName, profilePicture } = this.props.userContext;
    const commentData = {
      message: comment,
      playerId: playerId,
      profileImageURL: profilePicture,
      username: userName
    }
    this.handleTriviaComment(commentData);
    this.setState({ comment: "" });
    controlChatWebsocket.send(await CMD.SEND_MESSAGE({
      triviaId: trivia?.triviaId,
      playerId,
      username: userName,
      profileImageURL: profilePicture,
      message: comment
    }));
  };

  handleTriviaComment = (data) => {
    const { comments } = this.state;
    let commentsData = {
      message: data?.message,
      playerId: data?.playerId,
      profileImageURL: data?.profileImageURL,
      username: data?.username
    }
    this.setState({ comments: [...comments, { ...commentsData }] }, () => {
      this.commentRef.current.scrollToEnd({ animating: true });
    })
  };

  onPressAnswer = async ({ item }) => {
    this.setState({ selectedAnswer: item });
    const { question, trivia, controlWebsocket } = this.state;
    const { Question, QuestionNo } = question;
    const { playerId } = this.props.userContext;
    const { TriviaQuestionsId, TriviaAnswersId } = item;
    const questionObj = {
      triviaQuestionId: TriviaQuestionsId,
      questionNo: QuestionNo,
      question: Question,
      answerId: TriviaAnswersId,
      triviaId: trivia?.triviaId,
    };
    controlWebsocket.send(await CMD.ANSWER_QUESTION({
      triviaId: trivia?.triviaId,
      playerId,
      question: questionObj
    }));
  };

  handleTriviaAnswerResult = async (ansPercentageList) => {
    const { question, selectedAnswer, noOfTotalQuestion, isEleminated } = this.state;
    const triviaAnswersPercentageFiltered = question?.TriviaAnswers?.map(ans => {
      const filteredAnswer = ansPercentageList?.find(ansPercentage => ansPercentage?.AnswerId === ans?.TriviaAnswersId)
      return {
        ...ans,
        AnswerAttemptPercentage: filteredAnswer ? filteredAnswer?.AnswerAttemptPercentage : '0'
      }
    });

    const answerResult = question;
    answerResult.TriviaAnswers = triviaAnswersPercentageFiltered;

    this.setState({ answerResult, question: null, lastSelectedQuestionNo: answerResult?.QuestionNo }, () => {
      this.answerResultRef.current?.setModalVisible();
      if (!isEleminated) this.setState({ isEleminated: !selectedAnswer?.IsCorrect }, () => {
        if (!selectedAnswer?.IsCorrect) {
          this.concludeTrivia();
        }
      });
      setTimeout(() => {
        this.setState({
          answerResult: null,
          showEleminatedPopup: !isEleminated && !selectedAnswer?.IsCorrect
        });
        this.answerResultRef.current?.setModalVisible(false);
      }, 3000);
    });

    setTimeout(() => {
      if (noOfTotalQuestion === answerResult?.QuestionNo) {
        this.concludeTrivia();
      }
    }, 4000)
  };

  getTriviaWinners = async () => {
    const { trivia, isEleminated } = this.state;
    try {
      const triviaWinners = await api.getTriviaWinners(trivia?.triviaId);
      if (triviaWinners.data.success) {
        this.setState({
          triviaWinners: triviaWinners.data.data,
          selectedAnswer: null,
          answerResult: null,
        }, () => {
          this.answerResultRef.current?.setModalVisible(false);
          if (isEleminated) {
            this.ActionSheetRef1.current?.setModalVisible(true);
          }
        })
      }
    } catch (error) {
      // fail silently
    }
  }

  concludeTrivia = async () => {
    const { trivia, answerResult, controlWebsocket, isEleminated } = this.state;
    const { playerId } = this.props.userContext;
    try {
      controlWebsocket.send(await CMD.CONCLUDE_TRIVIA_SESSION({
        triviaId: trivia?.triviaId,
        playerId,
        isWinner: !isEleminated,
        ticketAmount: trivia?.ticketPrizeAmount,
        questionNo: answerResult?.QuestionNo,
        isOptOut: false
      }));
    } catch (error) {
      // fail silently
    }
  }

  handleTriviaEnded = async () => {
    try {
      await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.TRIVIA_WATCHER);
      await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.TRIVIA_PLAYER);
      await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.TRIVIA_ELIMINATED);
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: SCREENS.DIGITAL_GAME_ROOM })],
      });
      this.props.navigation.dispatch(resetAction);
    } catch (error) {
    }
  };

  onCongratsAnimationFinish = () => {
    SOUNDS.CONGRATS_YOU_WON_MUSIC.stop();
    this.congratsAnimationRef.current.pause();
    this.setState({ isCongratsAnimationStart: false });
    this.ActionSheetRef1.current?.setModalVisible(true);
  };

  removePlayer = async () => {
    await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.TRIVIA_PLAYER);
  }


  renderOptions = () => {
    const { question, selectedAnswer, isEleminated, shouldEndTime } = this.state;
    return (
      <FlatList
        data={question?.TriviaAnswers}
        renderItem={({ item, index }) => {
          return (
            <>
              <OptionContainer
                disabled={selectedAnswer || isEleminated || shouldEndTime}
                isSelectedAns={selectedAnswer?.TriviaAnswersId === item?.TriviaAnswersId}
                onPress={() => this.onPressAnswer({ item, index })}
              >
                <OptionText alignCenter color={color.black} fontFamily={FONT_FAMILY.BOLD} size={SIZE.SMALL}>
                  {item?.Answer}
                </OptionText>
              </OptionContainer>
            </>
          );
        }}
      />
    );
  };

  getAnswerResultStyle = (item) => {
    const { selectedAnswer } = this.state;
    const width = Math.round(item?.AnswerAttemptPercentage) > 0 ? Math.round(item?.AnswerAttemptPercentage) : 0;
    let borderColor; let backgroundColor; let borderRadius; let textColor;
    if (item?.IsCorrect && item?.TriviaAnswersId === selectedAnswer?.TriviaAnswersId) {
      borderColor = color.profilegradientCircleCurrent2;
      backgroundColor = color.profilegradientCircleCurrent2;
      borderRadius = 50;
      textColor = color.white;
    } else if (item?.IsCorrect && item?.TriviaAnswersId !== selectedAnswer?.TriviaAnswersId) {
      borderColor = color.profilegradientCircleCurrent2;
      backgroundColor = color.transparent;
      borderRadius = 50;
      textColor = color.black;
    } else if (!item?.IsCorrect && item?.TriviaAnswersId === selectedAnswer?.TriviaAnswersId) {
      borderColor = buttonColor.RED.inner;
      backgroundColor = buttonColor.RED.inner;
      borderRadius = 50;
      textColor = color.white;
    } else {
      borderColor = color.disabledButtonBorderColor;
      backgroundColor = color.disabledButtonBorderColor;
      borderRadius = 0;
      textColor = color.black;
    }
    return { borderColor, backgroundColor, width, borderRadius, textColor };
  }

  renderOptionsForAnswerResult = () => {
    const { answerResult } = this.state;
    return (
      <FlatList
        data={answerResult?.TriviaAnswers}
        renderItem={({ item }) => {
          const answerResultStyle = this.getAnswerResultStyle(item);
          return (
            <OptionContainerForAnswerResult>
              <OptionTextContainer
                borderColor={answerResultStyle?.borderColor}
                backgroundColor={answerResultStyle?.backgroundColor}
                width={answerResultStyle.width}
                borderRadius={answerResultStyle?.borderRadius} />
              <OptionResultText color={answerResultStyle.textColor} fontFamily={FONT_FAMILY.BOLD} size={SIZE.SMALL}>
                {item?.Answer}
              </OptionResultText>
              <OptionPercentageText color={color.disabledButtonBorderColor} fontFamily={FONT_FAMILY.MEDIUM} size={SIZE.XSMALL}>
                {`${Math.round(item?.AnswerAttemptPercentage)}%`}
              </OptionPercentageText>
            </OptionContainerForAnswerResult>
          );
        }}
      />
    );
  };

  renderVideo = () => {
    const { isLoadingVideo, connectionSide } = this.state;

    if (isLoadingVideo) {
      return (
        <LoadingContainer>
          <ActivityIndicator />
        </LoadingContainer>
      );
    }

    if (connectionSide) {
      return <Video streamURL={connectionSide.stream.toURL()} objectFit="cover" />;
    }
    return <></>;
  };

  renderBottomBar = () => {
    const {
      trivia,
      question,
      remainingTime,
      answerResult,
      isTriviaPlayer,
      noOfTotalQuestion,
      isTriviaStarted
    } = this.state;
    return (
      <BottomBar>
        <LeftIconsContainer>
          {(!!noOfTotalQuestion && !!question) ?
            <QuestionIconContainer>
              <QuestionMarkTextWrapper>
                <QuestionMarkText alignCenter color={color.white} fontFamily={FONT_FAMILY.BOLD} size={SIZE.LARGE}>?</QuestionMarkText>
              </QuestionMarkTextWrapper>
              <QuestionIconText alignCenter color={color.darkGrey} fontFamily={FONT_FAMILY.BOLD} size={SIZE.NORMAL}>
                {question?.QuestionNo}/{noOfTotalQuestion}
              </QuestionIconText>
            </QuestionIconContainer> :
            <CommentIconContainer
              onPress={() => {
                this.ActionSheetRef2.current?.setModalVisible();
              }}
            >
              <CommentIcon source={comment} />
            </CommentIconContainer>}
        </LeftIconsContainer>
        {!!remainingTime && <MiddleIcon
          setShouldStartGame={this.setShouldStartGame}
          showThreeDots={(answerResult || isTriviaStarted) && !question}
          timerTime={question ? trivia?.triviaQuestionDuration : remainingTime}
          question={question}
          setShouldEndTime={this.setShouldEndTime}
        />
        }
        <RightIcon
          isTriviaPlayer={isTriviaPlayer}
          startGame={this.startGame}
          isTriviaStarted={isTriviaStarted} />
      </BottomBar>
    )
  };

  render() {
    const {
      controlWebsocket,
      controlChatWebsocket,
      watchers,
      trivia,
      question,
      answerResult,
      selectedAnswer,
      showEleminatedPopup,
      isTriviaPlayer,
      triviaWinners,
      noOfTotalQuestion,
      isTriviaStarted,
      lastSelectedQuestionNo,
      isEleminated,
      isCongratsAnimationStart,
      shouldEndTime,
      shouldStartGame,
    } = this.state;

    const { playMusic } = this.props.backgroundMusicContext;
    const { playerId } = this.props.userContext;
    // chat socket listner
    if (controlChatWebsocket) {
      controlChatWebsocket.onmessage = async e => {
        const data = JSON.parse(e.data);
        const { ret } = data;
        switch (ret) {
          case RET.VIEWER:
            this.setState({ watchers: data?.viewerCount });
            break;
          case RET.GAME_START:
            this.setState({ isTriviaStarted: data?.isContestStarted });
            break;
          case RET.TRIVIA_CHAT:
            playerId != data?.playerId && this.handleTriviaComment(data);
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
        this.handleError();
      };
    };

    if (controlWebsocket) {
      controlWebsocket.onmessage = e => {
        const data = JSON.parse(e.data);
        const { ret } = data;
        switch (ret) {
          case RET.GAME_JOINED:
            this.setState({ isVisibleJoinPopUp: false, isTriviaPlayer: true, isEleminated: data?.isEliminated }, async () => {
              await AsyncStorage.setItem(LOCAL_STORAGE_NAME.TRIVIA_PLAYER, JSON.stringify({ active: true }));
            });
            break;
          case RET.TIRVIA_QUESTION:
            this.setState({
              question: data?.Question,
              answerResult: null,
              selectedAnswer: null,
              shouldEndTime: false
            }, async () => {
              this.answerResultRef.current?.setModalVisible(false);
              this.ActionSheetRef.current?.setModalVisible(true);
            });
            break;
          case RET.ADD_TRIVIA_PLAYER_SESSION:
            if (!data.isSuccesfullyAdded) {
              this.setState({ selectedAnswer: null });
            }
            break;
          case RET.TRIVIA_ANSWERS_PERCENTAGE:
            if (data.triviaAnswersAnalysisList) {
              this.handleTriviaAnswerResult(data?.triviaAnswersAnalysisList)
            }
            break;
          case RET.TRIVIA_CONCLUDE:
            if (noOfTotalQuestion === lastSelectedQuestionNo) {
              if (!isEleminated) {
                this.setState({ isCongratsAnimationStart: true }, () => {
                  SOUNDS.CONGRATS_YOU_WON_MUSIC.play();
                  this.congratsAnimationRef.current.play();
                })
              } else if (isEleminated) {
                this.removePlayer();
              }
              this.getTriviaWinners();
            } else if (isEleminated) {
              this.removePlayer();
            }
          default:
            break;
        }
      };
      controlWebsocket.onerror = () => {
        this.handleError();
      };
    };

    return (
      <GameContainer forceInset={{ top: 'never' }}>
        <Background source={ScatteredCircleBackGround} resizeMode="stretch">
          <>
            <VideoContainer testID="game-loaded">
              {this.renderVideo()}
              {(!shouldStartGame && !shouldEndTime) && (
                <Countdown onCountdownComplete={() => this.setShouldStartGame(true)} />
              )}
            </VideoContainer>
          </>
          <Container>
            <Header watcherCount={watchers} />
          </Container>

          {isCongratsAnimationStart ? (
            <LottieView
              ref={this.congratsAnimationRef}
              source={congratsYouWonAnimation}
              resizeMode="cover"
              loop={false}
              onAnimationFinish={this.onCongratsAnimationFinish}
            />
          ) : null}

          {(question && isTriviaPlayer) && (
            <ContestQuestion
              animated
              elevation={0}
              ref={this.ActionSheetRef}
              closeOnTouchBackdrop={false}
              gestureEnabled
              closable={false}
            >
              <ActionSheetContainer>
                <Question alignCenter fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.NORMAL}>
                  {question?.Question}
                </Question>
                {this.renderOptions()}
              </ActionSheetContainer>
              {this.renderBottomBar()}
            </ContestQuestion>
          )}

          {(answerResult && isTriviaPlayer) && (
            <ContestQuestion
              animated
              elevation={0}
              ref={this.answerResultRef}
              closeOnTouchBackdrop={false}
              gestureEnabled
              closable={false}
            >
              <ActionSheetContainer>
                {selectedAnswer && !isEleminated ? (
                  <AnswerResultHeadingTag
                    backgroundColor={selectedAnswer?.IsCorrect ? color.profilegradientCircleCurrent2 : buttonColor.RED.inner}>
                    <AnswerResultHeadingText isUppercase alignCenter fontFamily={FONT_FAMILY.BOLD} size={SIZE.XLARGE} color={color.white} >
                      {selectedAnswer?.IsCorrect ? liveHostedStrings.correct : liveHostedStrings.inCorrect}
                    </AnswerResultHeadingText>
                  </AnswerResultHeadingTag>
                ) : null}
                <Question alignCenter fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.NORMAL}>
                  {answerResult?.Question}
                </Question>
                {this.renderOptionsForAnswerResult()}
              </ActionSheetContainer>
              {this.renderBottomBar()}
            </ContestQuestion>
          )}


          {triviaWinners && (
            <Winners
              elevation={0}
              ref={this.ActionSheetRef1}
              animated
              containerStyle={{}}
              closeOnTouchBackdrop={false}
              gestureEnabled
              onClose={() => { }}
            >
              <WinnerActionSheetContainer>
                <WinnerTitle fontFamily={FONT_FAMILY.BOLD} color={buttonColor.RED.inner} size={SIZE.XXXLARGE}>
                  {liveHostedStrings.winner}
                </WinnerTitle>
                <FlatList
                  data={triviaWinners}
                  renderItem={({ item }) => {
                    return (
                      <WinnerContainer>
                        <WinnerContainerRow>
                          <ImageIconContainer>
                            <ImageIcon source={{ uri: item.profileImageUrl }} resideMode="contain" />
                            <WinnerTextContainer>
                              <WinnerTextWrapper size={SIZE.SMALL} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
                                {item.userName}
                              </WinnerTextWrapper>
                            </WinnerTextContainer>
                          </ImageIconContainer>
                        </WinnerContainerRow>
                      </WinnerContainer>
                    );
                  }}
                />
              </WinnerActionSheetContainer>
            </Winners>
          )}
          {/* <ShareIconContainer>
            <ShareIcon source={share_button} resizeMode="contain" />
            <ShareIconText isUppercase={true} fontFamily={FONT_FAMILY.MEDIUM} size={SIZE.XXXSMALL} color={color.white}>
              {liveHostedStrings.share}
            </ShareIconText>
          </ShareIconContainer> */}
          <CommentContainer>
            <Comments ref={this.commentRef} commentData={this.state.comments} />
          </CommentContainer>
          {!isTriviaStarted && <TokenToPlay tokensCost={trivia?.tokensCost} />}
          {this.renderBottomBar()}
          <CommentActionSheet
            elevation={0}
            ref={this.ActionSheetRef2}
            animated
            containerStyle={{}}
            closeOnTouchBackdrop={true}
            gestureEnabled
            onClose={() => { }}
          >
            <TextInput
              style={{
                marginHorizontal: 20,
                marginBottom: scaleHeight(5),
                height: scaleHeight(40)
              }}
              placeholder={liveHostedStrings.addComment}
              placeholderTextColor={color.grayBlack}
              returnKeyType="send"
              returnKeyLabel="Send"
              enablesReturnKeyAutomaticallly={true}
              editable={true}
              keyboardType="default"
              keyboardAppearance="light"
              value={this.state.comment}
              onChangeText={value => this.setState({ comment: value })}
              onSubmitEditing={(e) => {
                this.ActionSheetRef2.current?.setModalVisible(false);
                this.sendMessage()
              }}
            />
          </CommentActionSheet>
          {/* <NewLifePopUp
        isVisible={isVisibleNewLifePopUp}
        onDissmiss={() => {
          setIsVisibleNewLifePopUp(false);
        }}
      /> */}
          <EliminatedPopUp
            isVisible={showEleminatedPopup}
            onDissmiss={() => {
              this.setState({
                showEleminatedPopup: false,
                question: null,
                selectedAnswer: null,
                answerResult: null,
              }, () => {
                this.answerResultRef?.current?.setModalVisible(false);
              });
            }}
            onBackPress={() => {
              const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: SCREENS.DIGITAL_GAME_ROOM })],
              });
              this.props.navigation.dispatch(resetAction);
            }}
            noOfTotalQuestion={noOfTotalQuestion}
            selectedQuestionNo={lastSelectedQuestionNo}
          />
          <LiveHostedJoinPopUp
            isVisible={this.state.isVisibleJoinPopUp}
            onDissmiss={() => {
              this.setState({ isVisibleJoinPopUp: false });
            }}
            onJoin={() => this.handleJoinTrivia()}
            ticketPrize={trivia?.ticketPrizeAmount}
            tokensCost={trivia?.tokensCost}
          />
        </Background>
      </GameContainer>
    );
  }
}

LiveHosted.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        item: PropTypes.shape(),
      })
    })
  }).isRequired
};

const ContextWrapper = (props) => {
  return (
    <BackgroundMusicContext.Consumer>
      {backgroundMusicContext => (
        <UserContext.Consumer>
          {userContext => (
            <LiveHosted backgroundMusicContext={backgroundMusicContext} userContext={userContext} {...props} />
          )}
        </UserContext.Consumer>
      )}

    </BackgroundMusicContext.Consumer>
  )
}

export default ContextWrapper;