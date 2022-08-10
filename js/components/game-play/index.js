import React, { Component, createRef  } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { RTCView } from 'react-native-webrtc';
import axios from 'axios';

import ControlPanel from './ControlPanel';
import Countdown from './Countdown';
import GamePlayHeader from './GamePlayHeader';
import LoadingScreen from '../common/LoadingScreen';
import InstructionPopUp from '../common/InstructionPopUp';
import Text, { SIZE } from '../common/Text';
import QuickTokenRefill from '../common/QuickTokenRefill';
import api from '../../api';
import { createMillicastClient } from '../millicast/client';
import { sideStreamConfig, topStreamConfig } from '../millicast/config';
import { color } from '../../styles';
import { medalCoin, medalError } from '../../../assets/images';
import { popUpStrings, landingStrings } from '../../stringConstants';
import { SCREENS, PLAYER_STATUS, URLS } from '../../constants';
import { SOUNDS } from '../../soundUtils';
import { PopupContext } from '../../context/Popup.context';


import { scale } from '../../platformUtils';
import OopsPopUp from './OopsPopUp';

const GameContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${color.gameBackground};
`;

const HeaderContainer = styled.View`
  position: absolute;
  left: 0;
  right: 0;
`;

const Video = styled(RTCView)`
  flex: 1;
`;

const LoadingContainer = styled.View`
  align-items: center;
  flex: 1;
  justify-content: center;
`;

const VideoContainer = styled.View`
  flex: 11;
`;

const TextWrapper = styled(Text)`
  margin-horizontal: ${scale(28)};
`;

class GamePlay extends Component {
  // static contextType = UserContext;

  constructor(props) {
    super(props);
    const { machineData } = props.navigation.state.params;



    this.state = {
      connectionSide: null,
      connectionTop: null,
      isLoadingVideo: true,
      isOutOfTokenPopUpShown: false,
      isMachineNotAvailablePopUpShown: false,
      showSideVideo: true,
      playerStatus: PLAYER_STATUS.WATCHING,
      queueLength: 0,
      watchers: 0,
      shouldStartGame: false,
      machineNotAvailable: false,
      showQuitAlert: false,
      tokenPurchasePromt: false,
      errorCode: null,
    };
    this.iceServers = null;
    this.reconnectingInProgress = true
    this.connectionListenerInterval = null


    const { viewStreamAccount, viewStreamId1, viewStreamId2 } = machineData;

    this.side = sideStreamConfig(viewStreamAccount, viewStreamId1);
    this.top = topStreamConfig(viewStreamAccount, viewStreamId2);
    this.millicastClientSide = createMillicastClient(this.side);
    this.millicastClientTop = createMillicastClient(this.top);
    this.headerRef = createRef();
  }

  async componentDidMount() {
    const { setIsGamePlayScreen } = this.context;
    setIsGamePlayScreen(true);
    this.setState({
      isLoadingVideo: true
    });
    const machineNotAvailableTimeout = setTimeout(() => {
      this.handleError();
    }, 15000);

    try {
      const connectionSide = await this.connectToVideoStream(this.millicastClientSide, this.side);
      const connectionTop = await this.connectToVideoStream(this.millicastClientTop, this.top);
      this.setState({
        connectionSide,
        connectionTop,
        isLoadingVideo: false
      },
        () => {
          this.connectionListener()
        });
      clearTimeout(machineNotAvailableTimeout);
      const { backgroundMusicContextValue } = this.context;
      const { playMusic } = backgroundMusicContextValue;
      playMusic(SOUNDS.GAME_PLAY_MUSIC);
    } catch (error) {
      this.handleError();
    }
    await this.updateQueueInfo();
  }


  componentWillUnmount() {
    const { backgroundMusicContextValue, setIsGamePlayScreen } = this.context;
    setIsGamePlayScreen(false);
    const { playMusic } = backgroundMusicContextValue;
    if (Platform.OS === 'android') {
      clearInterval(this.connectionListenerInterval)
    }
    const { connectionSide, connectionTop } = this.state;
    this.stopVideo(connectionSide);
    this.stopVideo(connectionTop);
    this.setState({
      isLoadingVideo: false,
      connectionSide: null,
      connectionTop: null
    });
    // SOUNDS.GAME_PLAY_MUSIC.stop();
    playMusic(SOUNDS.LOBBY_BACKGROUND_MUSIC)
  }

  updateQueueInfo = async () => {
    const { navigation } = this.props;
    const { machineData, challengeId} = navigation.state.params;
    const { machineId, prize } = machineData;
    const { prizeId } = prize;
    
    
    try {
      const [machineViewerResponse, machineDetailsResponse] = await axios.all([
        api.getMachineViewer(machineId),
        api.getMachineDetails(machineId, prizeId, challengeId)
      ]);
      if (
        machineViewerResponse.status === 200 &&
        machineDetailsResponse.status === 200 &&
        machineViewerResponse.data &&
        machineDetailsResponse.data
      ) {
        const watchers = machineViewerResponse.data;
        const { queueLength } = machineDetailsResponse.data;
        this.updateQueue({ watchers, queueLength });
      }
    } catch (error) {
      const { displayRequestError } = this.context;
      displayRequestError(error.message);
    }
  };

  connectionListener = async () => {
    if (Platform.OS === 'android') {
      // listening connection if it gets disconnected then reconnects it.
      const { connectionSide, connectionTop } = this.state;
      this.connectionListenerInterval = setInterval(async () => {
        if ((connectionSide && connectionSide.pc.iceConnectionState === 'disconnected') ||
          (connectionTop && connectionTop.pc.iceConnectionState === 'disconnected')) {
          if (this.reconnectingInProgress) {
            this.reconnectingInProgress = false
            // this.setState({ reconnecting: true }, 
            // async() => {
            await this.reconnect()
            // })
          }
        }
      }, 1000);
    }
  };

  reconnect = async () => {
    setTimeout(async () => {
      try {
        const connectionSide = await this.connectToVideoStream(this.millicastClientSide, this.side);
        const connectionTop = await this.connectToVideoStream(this.millicastClientTop, this.top);
        this.setState({
          connectionSide,
          connectionTop,
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



  handleError = (errorCode = null) => {
    const { backgroundMusicContextValue } = this.context;
    const { playSoundEffect } = backgroundMusicContextValue;
    const { isLoadingVideo } = this.state;
    playSoundEffect(SOUNDS.NEGATIVE_POPUP);
    if (!isLoadingVideo) {
      this.setState({ isMachineNotAvailablePopUpShown: true });
    }
    this.setState({ machineNotAvailable: true, isLoadingVideo: false, playerStatus: PLAYER_STATUS.WATCHING, errorCode });
  };

  connectToVideoStream = async (client, clientConfig) => {
    if (!this.iceServers) {
      this.iceServers = await client.getIceServers();
    }
    const { viewerStreamAccountId, viewerStreamId } = clientConfig;
    const wsUrl = await client.viewDirector(viewerStreamAccountId, viewerStreamId);
    const connection = await client.viewStream(wsUrl, viewerStreamId, this.iceServers);

    return connection;
  };

  stopVideo = connection => {
    if (connection) {
      connection.pc.close();
      connection.ws.close();
    }
  };

  renderVideo = () => {
    const { isLoadingVideo, connectionSide, connectionTop, showSideVideo } = this.state;

    if (isLoadingVideo) {
      return (
        <LoadingContainer>
          <ActivityIndicator />
        </LoadingContainer>
      );
    }

    if (connectionSide && showSideVideo) {
      return <Video streamURL={connectionSide.stream.toURL()} objectFit="cover" />;
    }
    if (connectionTop && !showSideVideo) {
      return <Video streamURL={connectionTop.stream.toURL()} objectFit="cover" />;
    }

    return <></>;
  };

  flipCamera = () => {
    const { backgroundMusicContextValue } = this.context;
    const { playSoundEffect } = backgroundMusicContextValue;
    playSoundEffect(SOUNDS.MINOR_BUTTON);
    const { showSideVideo } = this.state;
    this.setState({ showSideVideo: !showSideVideo });
  };

  navigateToTokenStore = () => {
    SOUNDS.GAME_PLAY_MUSIC.stop();
    const { navigation } = this.props;
    const { replace } = navigation;
    this.setState({ isOutOfTokenPopUpShown: false });
    replace(SCREENS.GAME_CARD_RELOAD);
  };

  showOutOfTokenPopUp = () => {
    this.setState({ isOutOfTokenPopUpShown: true });
  };

  setIsMachineNotAvailablePopUp = isMachineNotAvailablePopUpShown => {
    this.setState({ isMachineNotAvailablePopUpShown });
  };

  updateQueue = ({ watchers, queueLength }) => {
    this.setState({ watchers, queueLength });
  };

  setPlayerStatus = playerStatus => {
    this.setState({ playerStatus });
  };

  navigateToHelp = () => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    this.setState({ isMachineNotAvailablePopUpShown: false });
    navigate(SCREENS.APP_WEB_VIEW, { url: URLS.HELP, title: landingStrings.helpAndContact });
  };

  setShouldStartGame = shouldStartGame => {
    this.setState({ shouldStartGame });
  };

  setShowQuitAlert = showQuitAlert => {
    this.setState({ showQuitAlert });
  };

  hideHeaderRef = () => {
    this.headerRef.current.hideComponents();
  }

  render() {
    const {
      isOutOfTokenPopUpShown,
      isLoadingVideo,
      playerStatus,
      watchers,
      queueLength,
      isMachineNotAvailablePopUpShown,
      shouldStartGame,
      showQuitAlert,
      showSideVideo,
      tokenPurchasePromt,
      errorCode,
    } = this.state;
    const { navigation } = this.props;
    const { navigate } = navigation;
    const { machineData, challengeId, challengeIndex, selectedChallenge } = navigation.state.params;

    return (
      <GameContainer forceInset={{ top: 'never' }}>
        {isLoadingVideo ? (
          <LoadingScreen
            isVisible={isLoadingVideo}
            animationInTiming={1}
            animationOutTiming={1}
            onModalHide={() => {
              const { machineNotAvailable } = this.state;
              if (machineNotAvailable) {
                this.setIsMachineNotAvailablePopUp(true);
              }
            }}
          />
        ) : (
          <>
            <VideoContainer testID="game-loaded">
              {this.renderVideo()}
              {!shouldStartGame && playerStatus === PLAYER_STATUS.NEXT_PLAYER && (
                <Countdown onCountdownComplete={() => this.setShouldStartGame(true)} />
              )}
            </VideoContainer>
            <ControlPanel
              playerStatus={playerStatus}
              setPlayerStatus={this.setPlayerStatus}
              navigation={navigation}
              onOutOnTokenPress={this.showOutOfTokenPopUp}
              setIsMachineNotAvailablePopUp={this.setIsMachineNotAvailablePopUp}
              machineData={machineData}
              flipCamera={this.flipCamera}
              handleError={this.handleError}
              onUpdateQueue={this.updateQueue}
              shouldStartGame={shouldStartGame}
              setShouldStartGame={this.setShouldStartGame}
              setShowQuitAlert={this.setShowQuitAlert}
              showQuitAlert={showQuitAlert}
              showSideVideo={showSideVideo}
              onPressBuyToken={() => { this.setState({ tokenPurchasePromt: true }) }}
              hideHeaderRef={this.hideHeaderRef}
              challengeId={challengeId || null}
              challengeIndex={challengeIndex}
              selectedChallenge={selectedChallenge}
            />
            <HeaderContainer>
              <GamePlayHeader
                navigation={navigation}
                playerStatus={playerStatus}
                watchers={watchers}
                queueLength={queueLength}
                machineData={machineData}
                setShowQuitAlert={this.setShowQuitAlert}
                ref={this.headerRef}
                challengeIndex={challengeIndex}
                selectedChallenge={selectedChallenge}
              />
            </HeaderContainer>

            <InstructionPopUp
              isVisible={isOutOfTokenPopUpShown}
              backdropText={popUpStrings.buyTokenToContinuePlay}
              buttonText={popUpStrings.goToStore}
              bannerLabel={popUpStrings.outOfToken}
              icon={medalCoin}
              secondaryButtonOnPress={() => this.setState({ isOutOfTokenPopUpShown: false })}
              onPress={() => this.navigateToTokenStore()}
            />
            <OopsPopUp
            isVisible={isMachineNotAvailablePopUpShown}
            onConfirmPress={() => {
              this.setState({ isMachineNotAvailablePopUpShown: false });
              navigate(SCREENS.GAME_ROOM);
            }}
            onCancelPress={this.navigateToHelp}
            onErrorMessage={errorCode ? popUpStrings.machineNotActive(errorCode) : popUpStrings.gameNotActive}
            />
            <QuickTokenRefill
              isVisible={tokenPurchasePromt}
              onPress={() => this.navigateToTokenStore()}
              onPressClose={() => this.setState({ tokenPurchasePromt: false })}
            />
          </>
        )}
      </GameContainer >
    );
  }
}

GamePlay.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        machineData: PropTypes.shape({
          viewStreamAccount: PropTypes.string.isRequired,
          viewStreamId1: PropTypes.string.isRequired,
          viewStreamId2: PropTypes.string.isRequired,
          macAddress: PropTypes.string.isRequired,
          gameDuration: PropTypes.number.isRequired,
          machineId: PropTypes.number.isRequired,
          prize: PropTypes.shape({
            prizeId: PropTypes.number.isRequired
          })
        }).isRequired
      })
    }).isRequired,
    goBack: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    pop: PropTypes.func.isRequired
  }).isRequired
};

GamePlay.contextType = PopupContext;

export default GamePlay;
