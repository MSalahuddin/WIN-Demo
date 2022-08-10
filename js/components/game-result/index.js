import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import { Animated, Platform, TurboModuleRegistry } from 'react-native';
import * as RNIap from 'react-native-iap';
import RewardSection from './RewardSection';
import PlayAgainButton from './PlayAgainButton';
import TextButton from '../common/TextButton';
import InstructionPopUp from '../common/InstructionPopUp';
import PopUpWrapper from '../common/PopUpWrapper';
import Banner, { BANNER_TYPE } from '../common/Banner';
import CountdownTimer from '../common/CountdownTimer';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import { UserContext } from '../../context/User.context';
import { PopupContext } from '../../context/Popup.context';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';
import { scaleHeight, getWindowWidth, scale, heightRatio, getWindowHeight, scaleWidth } from '../../platformUtils';
import { SOUNDS, pauseSound } from '../../soundUtils';
import { color } from '../../styles';
import { gameResultScreenStrings, gameRoomStrings, popUpStrings } from '../../stringConstants';
import {
  SCREENS,
  API_CALL_CONSTANTS,
  PLAYER_STATUS,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CUSTOMER_IO_EVENTS,
  LOCAL_STORAGE_NAME,
  ANALYTICS_APPSFLYER_EVENTS,
  ANALYTICS_APPSFLYER_EVENTS_PARAMETER,
  PRIZE_TYPE_CODE
} from '../../constants';
import {
  winningBanner,
  hourGlass,
  LostClaw,
  fallingChicken,
  sadChicken,
  happyChicken,
  medalCoin
} from '../../../assets/images';
import {
  redYellowCircleAnimation,
  starsAnimation,
  redYellowArrowAnimation,
  redBlueArrowAnimation
} from '../../../assets/animations';
import api from '../../api';
import { increaseUserProperty, logEvent, setUserProperties } from '../../amplitudeUtils';

import { AFLogCustomEvent } from '../../appFlyer.utils';
import TakeRewardButton from './TakeRewardButton';

const screenWidth = getWindowWidth();
const AnimationContainer = styled.View`
  height: 100%;
  width: 100%;
`;

const Container = styled.SafeAreaView`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WinningBannerViewContainer = styled.ImageBackground`
  width: ${screenWidth};
  height: ${(screenWidth * 112) / 344};
  position: absolute;
  top: ${heightRatio > 1 ? scaleHeight(56) : scaleHeight(20)};
`;

const BannerView = styled.ImageBackground`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  position: absolute;
  bottom: ${({ isCountDown }) => (isCountDown ? scaleHeight(Platform.OS === 'android' ? 9 : -9) : scaleHeight(7))};
  width: ${screenWidth};
`;

const BannerContainer = styled.View`
  width: ${screenWidth};
  height: ${(screenWidth * 112) / 344};
  flex-direction: row;
  position: absolute;
  justify-content: center;
  top: ${heightRatio > 1 ? scaleHeight(56) : scaleHeight(20)};
`;

const TimerBackground = styled.View`
  position: absolute;
  background-color: ${color.white};
  width: ${screenWidth / 2};
  height: ${heightRatio > 1 ? scaleHeight(36) : scaleHeight(44)};
  bottom: 0;
  border-bottom-left-radius: ${scale(10)};
  border-bottom-right-radius: ${scale(10)};
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: ${scaleHeight(30)};
  left: ${scale(10)};
  right: ${scale(10)};
  width: ${screenWidth - 2 * scale(10)};
  height: ${heightRatio > 1 ? scaleHeight(98) : scaleHeight(112)};
`;

const RewardButtonContainer = styled.View`
  position: absolute;
  bottom: ${scaleHeight(120)};
  left: ${scale(10)};
  right: ${scale(10)};
  width: ${screenWidth - 2 * scale(10)};
  height: ${heightRatio > 1 ? scaleHeight(98) : scaleHeight(112)};
`;

const FindNewGameContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: ${scaleHeight(15)};
`;

const TimerIcon = styled.Image`
  height: ${scale(24)};
  width: ${scale(24)};
`;

const InLineText = styled(Text)`
  bottom: ${Platform.OS === 'android' ? scaleHeight(-3) : scaleHeight(-8)};
  margin-left: ${scaleHeight(5)};
`;

const FallingChickenImage = styled.Image`
  width: ${scale(109)};
  height: ${scaleHeight(271)};
`;

const CountDownTimerWrapper = styled.View`
  position: absolute;
  bottom: ${Platform.OS === 'android' ? -scaleWidth(9) : scaleHeight(7)};
`;

const GameResultView = ({
  isGameWon,
  playerPrizeId,
  gameRoundData,
  machineData,
  navigation,
  playerStatus,
  setPlayerStatus,
  goBackToGame,
  queueLength,
  exitQueue,
  setShowGameResult,
  cleanUpGamePlay,
  isUseFreePlay,
  challengeIndex,
  selectedChallenge
}) => {
  const [fallingChickenPositionValue] = useState(new Animated.Value(0));
  const { setIsCreateAccountPopUpShown, setIsBecomeVipPopUpShown, displayRequestError } = useContext(PopupContext);
  const { playSoundEffect, playMusic, isMusicEnabled } = useContext(BackgroundMusicContext);
  const {
    isUserLoggedIn,
    tokens,
    fetchProfileData,
    fetchPoints,
    tickets,
    isVip,
    fetchPurchasePrompt,
    setTokensAnimation,
    setTrackingPrompt,
    getFreePlay,
    FreePlayPopUpScreen,
    setShouldRefreshGameRoom,
    shouldRefreshTokenPack
  } = useContext(UserContext);

  const [countDownComplete, setCountDownComplete] = useState(false);
  const [isRunningOutOfTime, setIsRunningOutOfTime] = useState(false);
  const [showFallingChicken, setShowFallingChicken] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isOutOfTokenPopUpShown, setOutOfTokenPopUpShown] = useState(false);
  const [showSadMascot, setShowSadMascot] = useState(true);
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);
  const [areTokenLow, setTokenLow] = useState(false);
  const [tokenPackData, setTokenPackData] = useState(null);
  const [dataPackTokenAmount, setDataPackTokenAmount] = useState(0);
  const [dataPackLocalizedPrize, setDataPackLocalizedPrize] = useState(0);
  const [iOSProductId, setiOSProductId] = useState(null);
  const [androidProductId, setandroidProductId] = useState(null);

  const { tokensCost, isFree, prizeDuration } = machineData;

  const getFreePlayData = async () => {
    await FreePlayPopUpScreen();
  };

  const getTokenCheck = () =>{
    if(tokens<tokensCost){
      setTokenLow(true);
    }
  }

  const fetchAppStoreTokens = async tokenPacks => {
    const tokenIds =
      Platform.OS === 'android'
        ? tokenPacks
            .map(({ androidProductId }) => {
              if (androidProductId === '') return null;
              return androidProductId;
            })
            .filter(Boolean)
        : tokenPacks.map(({ iOSProductId }) => iOSProductId);
    try {
      const result = await RNIap.getProducts(tokenIds);
      const tokenPacksWithIapData = tokenPacks
        .map(token => {
          const iapData = result.find(({ productId }) => {
            if (Platform.OS === 'android') {
              return productId === token.androidProductId;
            }
            return productId === token.iOSProductId;
          });
          return iapData && token?.isGameLostRefill ? { ...token, iapData } : {};
        })
        .filter(pack => pack.iapData);
      setTokenPackData(tokenPacksWithIapData);
      if (tokenPacksWithIapData[0]['bonusTokenAmount'] > 0) {
        setDataPackTokenAmount(tokenPacksWithIapData[0]['bonusTokenAmount']);
      } else {
        setDataPackTokenAmount(tokenPacksWithIapData[0]['iapData']['tokenAmount']);
      }
       setDataPackLocalizedPrize(tokenPacksWithIapData[0]['iapData']['localizedPrice']);
       setandroidProductId(tokenPacksWithIapData[0]['androidProductId']);
       setiOSProductId(tokenPacksWithIapData[0]['iOSProductId']);
    } catch (error) {
      displayRequestError(error.message);
    }
  };

  const fetchTokenPacks = async code => {
    try {
      const res = await api.getTokenPacks(code, Platform.OS === 'android');
      if (res.status === 200 && res.data) {
        await fetchAppStoreTokens(res.data);
      }
    } catch (error) {
      displayRequestError(error.message);
    }
  };

  useEffect(() => {
    if (shouldRefreshTokenPack) {
      // Token pack was successfully purchased - refresh
      fetchTokenPacks();
      fetchPoints();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRefreshTokenPack]);

  const requestPurchase = async productId => {
    try {
      await RNIap.initConnection();
      await RNIap.requestPurchase(productId, false);
      if(!countDownComplete){
        goBackToGame(isUseFreePlay);
      }
      else{
         exitQueue();
         setPlayerStatus(PLAYER_STATUS.WATCHING);
         goBackToGame(isUseFreePlay);
      }
    } catch (error) {
      onPressClose();
      // Error handled in purchase listener
    }
  };

  const onTokenPurchasePress = iOSProductId => {;
    requestPurchase(iOSProductId);
 
  };

  useEffect(() => {
    getTokenCheck();
    fetchTokenPacks();
  }, []);

  useEffect(() => {
    const soundEffect = isGameWon ? SOUNDS.GAME_WON : SOUNDS.GAME_LOST;
    if (isMusicEnabled) {
      pauseSound(SOUNDS.GAME_PLAY_MUSIC, () => {
        playSoundEffect(soundEffect, () => {
          playMusic(SOUNDS.LOBBY_BACKGROUND_MUSIC);
        });
      });
    } else {
      playSoundEffect(soundEffect);
    }
    getFreePlayData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (countDownComplete && playerStatus === PLAYER_STATUS.GAME_ENDED) {
      exitQueue();
      setPlayerStatus(PLAYER_STATUS.WATCHING);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countDownComplete, playerStatus]);

  const handleSwapForTickets = async () => {
    if (playerPrizeId) {
      try {
        await api.postSwapTickets(playerPrizeId, API_CALL_CONSTANTS.GAME_ROUND, isUserLoggedIn);
      } catch (error) {
        displayRequestError(error.message);
      }
    }
  };

  const trackSwapTickets = () => {
    const ticketsValue = machineData.prize && machineData.prize.ticketsValue;
    const updatedPlayerTickets = tickets + ticketsValue;
    // appsFlyerTracking();
    logEvent(ANALYTICS_EVENTS.SWAP_TICKETS_AFTER_WIN, {
      [ANALYTICS_PROPERTIES.TICKETS_DISPENSED]: ticketsValue,
      [ANALYTICS_PROPERTIES.PRIZE_ID]: gameRoundData.prizeId
    });
    appsFlyerTracking();
    setUserProperties({
      [ANALYTICS_PROPERTIES.PLAYER_TICKET_AMOUNT]: updatedPlayerTickets
    });
  };

  const trackPrizeKept = () => {
    logEvent(ANALYTICS_EVENTS.KEEP_PRIZE, {
      [ANALYTICS_PROPERTIES.MACHINE_ID]: machineData.machineId,
      [ANALYTICS_PROPERTIES.PRIZE_ID]: gameRoundData.prizeId
    });
    increaseUserProperty(ANALYTICS_PROPERTIES.PLAYER_WON_PRIZES_COUNT);
    api.postCustomerIo(CUSTOMER_IO_EVENTS.PRIZE_KEPT, gameRoundData.gameRoundId);
  };

  const appsFlyerTracking = isWon => {
    const { gameRoundId, prizeId } = gameRoundData;
    const { prize } = machineData;
    const { category, ticketsValue } = prize;
    AFLogCustomEvent(ANALYTICS_APPSFLYER_EVENTS.POST_WIN_SWAP, {
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.PRIZE_ID]: prizeId,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.PRIZE_NAME]: prize.name,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.PRIZE_CATEGORY]: category.name,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.TICKETS_DISPENSED]: ticketsValue,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.GAME_ROUND_ID]: gameRoundId
    });
  };

  const backToGamePlay = async () => {
    const canPlayFree = isFree && !isGameWon;
    switch (true) {
      case getFreePlay > 0: {
        if (!isUseFreePlay && tokens < tokensCost) {
          playSoundEffect(SOUNDS.NEGATIVE_POPUP);
          setOutOfTokenPopUpShown(true);
        } else {
          setAreButtonsDisabled(true);
          setShowSadMascot(false);
          setTimeout(() => {
            goBackToGame(isUseFreePlay);
          }, 1000);
        }
        break;
      }
      case !canPlayFree && tokens < tokensCost:
        playSoundEffect(SOUNDS.NEGATIVE_POPUP);
        setOutOfTokenPopUpShown(true);
        break;
      case !isGameWon:
        setAreButtonsDisabled(true);
        setShowSadMascot(false);
        setTimeout(() => {
          goBackToGame(isUseFreePlay);
        }, 1000);
        break;
      case isVip: {
        if (!areButtonsDisabled) {
          setAreButtonsDisabled(true);
          if (currentRewardIndex === 1 && gameRoundData) {
            trackSwapTickets();
            await handleSwapForTickets();
            await fetchPoints();
          } else if (currentRewardIndex === 0 && gameRoundData) {
            trackPrizeKept();
            appsFlyerTracking();
          }
          goBackToGame(isUseFreePlay);
          break;
        }
      }

      case !isUserLoggedIn:
        setIsCreateAccountPopUpShown(true);
        break;
      default:
        setIsBecomeVipPopUpShown(true);
    }
  };

  const renderBannerContent = () => {
    const countDownColor = isRunningOutOfTime ? color.pinkRed : color.green;
 
    if (!countDownComplete) {
      return (
        <CountDownTimerWrapper>
          <CountdownTimer
            time={prizeDuration}
            size={SIZE.LARGEST}
            fontFamily={FONT_FAMILY.BOLD}
            color={countDownColor}
            onTimerEnd={() => setCountDownComplete(true)}
            onFiveSecondsLeft={() => setIsRunningOutOfTime(true)}
          />
        </CountDownTimerWrapper>
      );
    }
    return (
      <>
        <TimerIcon source={hourGlass} />
        <InLineText allowFontScaling={false} color={color.whitePurple} size={SIZE.XLARGE} fontFamily={FONT_FAMILY.BOLD}>
          {`${queueLength} ${gameResultScreenStrings.inLine}`}
        </InLineText>
      </>
    );
  };

  const renderTopBanner = () => {
    if (isGameWon) {
      return (
        <WinningBannerViewContainer source={winningBanner} resizeMode="contain">
          {!isGameWon && <BannerView isCountDown={!countDownComplete}>{renderBannerContent()}</BannerView>}
        </WinningBannerViewContainer>
      );
    }
    return (
      <BannerContainer>
        {!areTokenLow && <TimerBackground />}
        <Banner
          label={gameResultScreenStrings.soClose}
          width={screenWidth - scale(20)}
          textSize={SIZE.BANNER_LARGE}
          bannerType={BANNER_TYPE.BLUE_BANNER}
        />
        {!areTokenLow && <BannerView isCountDown={!countDownComplete}>{renderBannerContent()}</BannerView>}
      </BannerContainer>
    );
  };

  useEffect(() => {
    if (isGameWon) {
      setShowFallingChicken(true);
      setShowBanner(false);
      Animated.timing(fallingChickenPositionValue, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true
      }).start(() => {
        setShowFallingChicken(false);
        setShowBanner(true);
      });
    }
  }, [fallingChickenPositionValue, isGameWon]);

  let backgroundAnimation;

  if (isGameWon) {
    backgroundAnimation = isRunningOutOfTime ? redYellowCircleAnimation : starsAnimation;
  } else {
    backgroundAnimation = redYellowCircleAnimation;
  }

  const screenHeight = getWindowHeight();
  const chickenImageHeight = scaleHeight(271);
  const chickenPositionTransform = [
    {
      translateY: fallingChickenPositionValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0 - 2 * chickenImageHeight, screenHeight + chickenImageHeight]
      })
    }
  ];

  const handleExit = async () => {
    if (!areButtonsDisabled) {
      const { prize } = machineData;
      const { prizeTokenAmount, prizeType } = prize;
      setAreButtonsDisabled(true);
      if (isGameWon && currentRewardIndex === 1) {
        trackSwapTickets();
        await handleSwapForTickets();
        await fetchProfileData();
      } else if (isGameWon && currentRewardIndex === 0) {
        trackPrizeKept();
        appsFlyerTracking();
      }
      setShowGameResult(false);

      if (prizeType.typeCode === PRIZE_TYPE_CODE.NFT) {
        setShouldRefreshGameRoom(true);
      }

      // navigation.popToTop()
      if (!!selectedChallenge && challengeIndex != 'undefine') {
        navigation.navigate(SCREENS.CHALLENGE_GAME, { challengeIndex, selectedChallenge });
      } else {
        navigation.navigate(SCREENS.GAME_ROOM);
      }
      exitQueue();
      await fetchPurchasePrompt();
      await setTrackingPrompt(true);

      //If gamewon  and prize set to token amount then prizeToken amount is
      //integer then show token animations
      if (isGameWon && prizeTokenAmount && currentRewardIndex === 0) {
        await setTokensAnimation(true);
      }
    }
  };

  const renderNewGameString = () => {
    if (areTokenLow) {
      return popUpStrings.noThanks;
    }
    if (!isGameWon) {
      if (!!selectedChallenge && challengeIndex != 'undefine') {
        return gameRoomStrings.backToChallenge;
      } else {
        return gameRoomStrings.backToGameRoom;
      }
    }
    if (currentRewardIndex === 0) {
      return gameResultScreenStrings.takePrizeAndFindNewGame;
    }

    return gameResultScreenStrings.takeTicketsAndFindNewGame;
  };

  return (
    <AnimationContainer>
      <PopUpWrapper onDismiss={() => setShowGameResult(false)}>
        <LottieView source={backgroundAnimation} autoPlay loop resizeMode="cover" />
        <Container>
          {!showFallingChicken && (
            <RewardSection
              rewardIndex={currentRewardIndex}
              setRewardIndex={setCurrentRewardIndex}
              isGameWon={isGameWon}
              lostMascot={showSadMascot ? LostClaw : LostClaw}
              machineData={machineData}
              areTokenLow={areTokenLow}
              setCountDownComplete={setCountDownComplete}
            />
          )}
        </Container>
        {showBanner && renderTopBanner()}
        {!showFallingChicken && !isGameWon && (
          <ButtonContainer>
            <PlayAgainButton
              disabled={areButtonsDisabled}
              onPress={()=>{
                areTokenLow
                  ? onTokenPurchasePress(Platform.OS === 'android' ? androidProductId : iOSProductId)
                  : backToGamePlay()
              }}
              isFree={isFree && !isGameWon}
              tokensCost={tokensCost}
              label={
                isGameWon
                  ? gameResultScreenStrings.prizeWaitingInVault
                  : gameResultScreenStrings.tryAgainForAnotherChance
              }
              areTokenLow={areTokenLow}
              tokenAmount={dataPackTokenAmount}
              localizedPrice={dataPackLocalizedPrize}
            />
            <FindNewGameContainer>
              <TextButton
                disabled={areButtonsDisabled}
                onPress={handleExit}
                size={SIZE.XSMALL}
                color={color.white}
                label={renderNewGameString()}
                testID="find-new-game-button"
              />
            </FindNewGameContainer>
          </ButtonContainer>
        )}
        {!showFallingChicken && isGameWon && (
          <RewardButtonContainer>
            <FindNewGameContainer>
              <TakeRewardButton
                isDisabled={areButtonsDisabled}
                onPress={handleExit}
                isGradient
                label={renderNewGameString()}
                isLarge
                currentRewardIndex={currentRewardIndex}
              />
            </FindNewGameContainer>
          </RewardButtonContainer>
        )}
        {showFallingChicken && (
          <Container>
            <Animated.View
              style={{
                transform: chickenPositionTransform
              }}
            >
              <FallingChickenImage source={fallingChicken} resizeMode="contain" />
            </Animated.View>
          </Container>
        )}
        <InstructionPopUp
          isVisible={isOutOfTokenPopUpShown}
          backdropText={popUpStrings.buyTokenToContinuePlay}
          buttonText={popUpStrings.goToStore}
          bannerLabel={popUpStrings.outOfToken}
          icon={medalCoin}
          secondaryButtonOnPress={() => {
            setOutOfTokenPopUpShown(false);
          }}
          onPress={() => {
            cleanUpGamePlay();
            setOutOfTokenPopUpShown(false);
            navigation.replace(SCREENS.GAME_CARD_RELOAD);
          }}
        />
      </PopUpWrapper>
    </AnimationContainer>
  );
};

GameResultView.defaultProps = {
  gameRoundData: null,
  playerPrizeId: null
};

GameResultView.propTypes = {
  isGameWon: PropTypes.bool.isRequired,
  playerPrizeId: PropTypes.number,
  machineData: PropTypes.shape({
    tokensCost: PropTypes.number,
    isFree: PropTypes.bool,
    prizeDuration: PropTypes.number,
    machineId: PropTypes.number,
    prize: PropTypes.shape({
      ticketsValue: PropTypes.number
    })
  }).isRequired,
  gameRoundData: PropTypes.shape({
    prizeId: PropTypes.number,
    gameRoundId: PropTypes.number
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    popToTop: PropTypes.func.isRequired
  }).isRequired,
  goBackToGame: PropTypes.func.isRequired,
  playerStatus: PropTypes.string.isRequired,
  setPlayerStatus: PropTypes.func.isRequired,
  queueLength: PropTypes.number.isRequired,
  exitQueue: PropTypes.func.isRequired,
  setShowGameResult: PropTypes.func.isRequired,
  cleanUpGamePlay: PropTypes.func.isRequired,
  isUseFreePlay: PropTypes.bool.isRequired
};

export default GameResultView;
