import React, { useContext, useEffect, useState,useRef } from 'react';
import PopUpWrapper from '../common/PopUpWrapper';
import GeoRestrictedModal from '../common/GeoRestrictedModal';
import { SafeAreaContainer } from '../../styles';
import { ScatteredCircleBackGround, coin } from '../../../assets/images';
import api from '../../api';
import LoadingSpinner from '../common/LoadingSpinner';
import DigitalGames from './DigitalGames';
import { Platform } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import * as RNIap from 'react-native-iap';
import { GetSocial } from 'getsocial-react-native-sdk';
import AsyncStorage from '@react-native-community/async-storage';
import { convertNumberToStringWithComma } from '../../utils';
import AchievementPopUp from '../common/AchievementPopUp';
import MinPiggybankPopUp from '../common/MinPiggyBankPopup';
import { UserContext } from '../../context/User.context';
import { PopupContext } from '../../context/Popup.context';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';
import { commonStrings, popUpStrings } from '../../stringConstants';
import ReferringRewardPopUp, { modes } from '../common/ReferringRewardPopUp';
import InviteFriendPopUp from '../common/InviteFriendPopUp'
import {
  SCREENS,
  LOCAL_STORAGE_NAME,
  GET_SOCIAL_CONSTANT,
  URLS
} from '../../constants';
import DailyBonusPopUp from '../common/DailyBonusPopUp';
import FreeTokenPopUp from '../common/FreeTokenPopUp';
import PiggyBankUnlockPopUp from '../common/PiggyBankUnlockPopUp';
import PiggyBankPopUp from '../common/PiggyBankPopUp';
import DealOfTheDayPopUp from '../common/DealOfTheDayPopUp';
import GameStreakPopUp from '../common/GameStreakPopUp'
import CoinsAnimations from '../common/CoinsAnimations';
import PurchasePrompt from '../common/PurchasePrompt'
import { trackable } from '../../trackingUtils'
import TrackingPopUp from '../common/TrackingPopUp'
import { SOUNDS } from '../../soundUtils';
import WatchAd from '../watch-ads/WatchAd';
import styled from 'styled-components/native';


const Background = styled.ImageBackground`
height: 100%;
  width: 100%;
  `;

const DigitalGameRoom = ({ navigation }) => {

    const { navigate } = navigation;

    const {
      isUserLoggedIn,
      tokenInfo,
      fetchPoints,
      fetchProfileData,
      fetchDailyBonus,
      fetchDealOfTheDay,
      shouldRefreshGameRoom,
      setShouldRefreshGameRoom,
      fetchNewsFeed,
      fetchFreeTokens,
      fetchPiggyBankStatus,
      isRestorePurchases,
      bonusScreenData,
      getBonusScreenData,
      autoPromptPiggyBank,
      tokensAnimation,
      setTokensAnimation,
      AutoPrompPiggyBankClose,
      FreePlayPopUpScreen,
      checkFreePlay,
      fetchMachinesSocketBaseUrl,
    } = useContext(UserContext);
  
    const { setIsCreateAccountPopUpShown, isGamePlayScreen } = useContext(PopupContext);
    const { playMusic } = useContext(BackgroundMusicContext);
    const [isAchievementPopupVisible, setIsAchievementPopupVisible] = useState(false);
    const [achievementData, setAchievementData] = useState([]);
    const [dailyBonus, setDailyBonus] = useState(null);
    const [freeTokenGranted, setFreeTokenGranted] = useState(null);
    const [isFreeTokenGrantedVisible, setIsFreeTokenGrantedVisible] = useState(false);
    const [isDailyBonusVisible, setIsDailyBonusVisible] = useState(false);
    const [isAnimated, setIsAnimated] = useState(false);
    const [isPiggyBankUnlockVisible, setPiggyBankUnlockVisible] = useState(false);
    const [isPiggyBankVisible, setPiggyBankVisible] = useState(false);
    const [piggyBankData, setPiggyBankData] = useState(null);
    const [dealOfTheDay, setDealOfTheDay] = useState(false);
    const [isDealOfTheDayVisible, setDealOfTheDayVisible] = useState(false);
    const [isReferrerReward, setReferrerReward] = useState(false);
    const [referrerRewardMode, setReferrerRewardMode] = useState(null);
    const [referrerRewardTokens, setReferrerRewardTokens] = useState(null);
    const [isInviteFriend, setInviteFriend] = useState(false);
    const [isMinPiggybankPopUp, setMinPiggybankPopUp] = useState(false);
    const [purchasePrompt, setPurchasePrompt] = useState(false);
    const [isPurchasePromptVisible, setIsPurchasePromptVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  
    const showAdRef = useRef(null);
  
    useEffect(() => {
      playMusic(SOUNDS.LOBBY_BACKGROUND_MUSIC);
      if (shouldRefreshGameRoom) {
        // eslint-disable-next-line no-use-before-define
        navigationEventsHandler()
        setDealOfTheDayVisible(false)
        setPiggyBankVisible(false)
        setIsPurchasePromptVisible(false)
        setShouldRefreshGameRoom(false)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldRefreshGameRoom]);
  
  useEffect(()=>{
    navigationEventsHandler()
  },[])
    useEffect(() => {
      if (tokensAnimation) {
        // reset to default value
        setTokensAnimation(false)
        setIsAnimated(true)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokensAnimation])
  
    const getNewAchievement = async () => {
      let newAchievement = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.ACHIEVEMENTS);
      newAchievement = JSON.parse(newAchievement);
  
      if (newAchievement && newAchievement.length > 0) {
        setAchievementData(newAchievement);
        setIsAchievementPopupVisible(true);
      }
    };
  
    const getDealOfTheDay = async () => {
      let retreiveDealOfTheDay = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.DEAL_OF_THE_DAY);
      if (retreiveDealOfTheDay) {
        retreiveDealOfTheDay = await JSON.parse(retreiveDealOfTheDay);
        const tokenPackId = Platform.OS === 'android' ?
          retreiveDealOfTheDay.androidProductId : retreiveDealOfTheDay.iosProductId
        const pack = await RNIap.getProducts([tokenPackId]);
        if (Platform.OS === 'android') {
          retreiveDealOfTheDay.localizedPrice = `${pack[0].localizedPrice}`
        }
        else {
          const priceValue = pack.filter(tokenPacks => tokenPacks.productId === retreiveDealOfTheDay?.iosProductId)
          retreiveDealOfTheDay.localizedPrice = `${priceValue[0].localizedPrice}`
        }
        const tokenAmount = Platform.OS === 'android' ?
          retreiveDealOfTheDay.tokenPackAndroid.tokenAmount : retreiveDealOfTheDay.tokenPackIOS.tokenAmount
        retreiveDealOfTheDay.newValue = tokenAmount + retreiveDealOfTheDay.value
        setDealOfTheDayVisible(true);
        setDealOfTheDay(retreiveDealOfTheDay)
      }
    };
  
  
    const getDailyBonus = async () => {
      let retreiveDailyBonus = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.DAILY_BONUS);
      retreiveDailyBonus = await JSON.parse(retreiveDailyBonus);
      if (retreiveDailyBonus) {
        setIsDailyBonusVisible(true);
        setDailyBonus(retreiveDailyBonus.dailyReward)
      }
    };
  
    const checkPiggyBankAutoPromt = async () => {
      let payload = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.PIGGY_BANK_STATUS);
      payload = await JSON.parse(payload);
      let currentTime = new Date();
      let lastPiggyBankTime = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.PIGGY_BANK_FULL_DAILY_TIME);
      if (payload !== null) {
        const tokenPackId = Platform.OS === 'android' ?
          payload.androidProductId : payload.iosProductId
        const packs = await RNIap.getProducts([tokenPackId]);
        // get products returning all products every time with different index
        // pack.filter filter our require pack
        const packsDetail = packs.filter(x => x.productId === tokenPackId)
        payload.localizedPrice = `${packsDetail[0].localizedPrice}`
  
        setPiggyBankData(payload);
        if (payload.isPiggyBankFull) {
          if (lastPiggyBankTime === null) {
            setPiggyBankVisible(true)
            await AsyncStorage.setItem(LOCAL_STORAGE_NAME.PIGGY_BANK_FULL_DAILY_TIME, JSON.stringify({ lastPiggyBank: currentTime.getTime() }))
            await AutoPrompPiggyBankClose()
          }
          else if (lastPiggyBankTime !== null && Math.floor(((currentTime - JSON.parse(lastPiggyBankTime).lastPiggyBank) / (1000 * 60)) % 60) >= 1439) {
            setPiggyBankVisible(true)
            await AsyncStorage.setItem(LOCAL_STORAGE_NAME.PIGGY_BANK_FULL_DAILY_TIME, JSON.stringify({ lastPiggyBank: currentTime.getTime() }))
            await AutoPrompPiggyBankClose()
          }
  
        }
  
  
  
      };
    }
  
    const checkPiggyBankStatus = async () => {
      setIsLoading(true)
      let payload = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.PIGGY_BANK_STATUS);
      payload = await JSON.parse(payload);
      if (payload !== null) {
        const tokenPackId = Platform.OS === 'android' ?
          payload.androidProductId : payload.iosProductId
        const packs = await RNIap.getProducts([tokenPackId]);
        // get products returning all products every time with different index
        // pack.filter filter our require pack
        const packsDetail = packs.filter(x => x.productId === tokenPackId)
        payload.localizedPrice = `${packsDetail[0].localizedPrice}`
        if (payload.isPiggyBankUnlocked) {
          setPiggyBankData(payload);
  
  
          setIsLoading(false)
          setPiggyBankVisible(true);
  
        }
        else {
          setIsLoading(false)
          setPiggyBankData(payload);
          setPiggyBankUnlockVisible(true);
        }
      };
    }
  
  
    const getFreeTokenGift = async () => {
      let retreiveFreeTokenGift = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.FREE_TOKEN_GIFT);
      retreiveFreeTokenGift = await JSON.parse(retreiveFreeTokenGift);
      if (retreiveFreeTokenGift) {
        setIsFreeTokenGrantedVisible(true);
        setFreeTokenGranted(retreiveFreeTokenGift)
      }
    };
  
  
    const fetchData = async () => {
      await PromtPiggybank();
      await checkFreePlay();
      if (tokenInfo) {
        await fetchDealOfTheDay();
        await fetchDailyBonus();
        await fetchFreeTokens();
        await fetchPoints();
        await fetchProfileData()
        await getNewAchievement();
        await fetchNewsFeed();
        await getBonusScreenData();
      }
    };
  
  
  
    const onPiggyBankPress = async () => {
      await fetchPiggyBankStatus()
      await checkPiggyBankStatus()
    }
  
    const piggyBankUnlockPopUpOnClose = () => {
      setPiggyBankUnlockVisible(false)
    }
  
    const achievementPopUpOnPress = (navigateToAchievementPage = false) => {
      setIsAchievementPopupVisible(false);
      setAchievementData([]);
      if (navigateToAchievementPage) navigate(SCREENS.ACHIEVEMENTS);
    };
  
  
    const dailyBonusPopUpPress = async () => {
      setIsDailyBonusVisible(false)
      setIsAnimated(true)
      await fetchProfileData()
    }
    const freeTokenPopUpPress = async () => {
      setIsFreeTokenGrantedVisible(false)
      setIsAnimated(true)
      await fetchProfileData()
    }
  
    const ClaimWeeklyDailyWin = async (bool) => {
  
      try {
        const res = await api.PostClaimDailyWeek(bool);
        if (res.status === 200 && res.data) {
  
          await getBonusScreenData();
        }
      }
      catch (error) {
        // silently handled
      }
  
      setIsAnimated(true)
      showAdRef.current.showRewardedAd()
      await fetchProfileData()
    }
  
  
    const addReferralTokens = async (tokens) => {
      try {
        const result = await api.postReferralTokens(tokens, {});
        if (result.status === 200 && result.data) {
  
          await fetchProfileData()
          setReferrerReward(true)
        }
      }
      catch (e) {
        // fall silenty
      }
    }
  
  
    const getReferralData = async () => {
      try {
        const referrerData = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.REFERRER_DATA)
        if (referrerData !== null && isUserLoggedIn) {
          const dataParsed = await JSON.parse(referrerData)
          const { USER, TYPE, DATA, USER_TOKENS, USER_INSTALL_REFERRER, USER_INSTALL_TOKENS } = GET_SOCIAL_CONSTANT
          if (dataParsed[TYPE] === USER) {
            setReferrerRewardMode(modes.RECEIVER)
            setReferrerRewardTokens(dataParsed[DATA][USER_TOKENS])
            addReferralTokens(dataParsed[DATA][USER_TOKENS])
          }
          else if (dataParsed[TYPE] === USER_INSTALL_REFERRER) {
            setReferrerRewardMode(modes.SENDER)
            setReferrerRewardTokens(dataParsed[DATA][USER_INSTALL_TOKENS])
            addReferralTokens(dataParsed[DATA][USER_INSTALL_TOKENS])
          }
        }
      }
      catch (e) {
        // catch silenty
      }
    }
  
    const getPurchasePrompt = async () => {
      try {
        const data = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.PURCHASE_PROMPT)
        if (data) {
          const parseData = await JSON.parse(data)
          const packs = await RNIap.getProducts([parseData.activeRefillTokenPackProductId]);
          // sometimes getProducst return all producsts not specific
          // in order to validate it we are using filter
          const pack = packs.filter(x => x.productId === parseData.activeRefillTokenPackProductId)
          parseData.localizedPrice = pack[0].localizedPrice
          setPurchasePrompt(parseData)
          setIsPurchasePromptVisible(true)
        }
      }
      catch (e) {
        // catch silenty
      }
    }
  
  
    const restorePurchaseOnlyIOS = async () => {
      if (Platform.OS === 'ios') {
        await isRestorePurchases()
      }
    }
  
    const PromtPiggybank = async () => {
      await fetchPiggyBankStatus();
      if (autoPromptPiggyBank) {
        await checkPiggyBankAutoPromt()
      }
    }
    const navigationEventsHandler = async () => {
      await fetchMachinesSocketBaseUrl();
      await trackable()
      await FreePlayPopUpScreen()
      await fetchProfileData()
      await getReferralData()
      await fetchData()
      await getPurchasePrompt()
      await getDailyBonus()
      await getDealOfTheDay()
      await getFreeTokenGift()
      await restorePurchaseOnlyIOS()
    }
  
    const onClosePiggyBankHandler = async () => {
      setPiggyBankUnlockVisible(false)
      await fetchPiggyBankStatus()
      await checkPiggyBankStatus()
    }
  
    const resetScreen = async () => {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: SCREENS.GAME_ROOM })],
      });
      navigation.dispatch(resetAction);
    }
  
    const userNotLoggedIn = async () => {
      setIsCreateAccountPopUpShown(true)
      resetScreen()
    }
  
    const referNow = async () => {
  
      setReferrerReward(false)
      setTimeout(() => {
        setInviteFriend(true)
      }, 1000);
  
  
  
    }
    const onFooterPress = () => {
      setInviteFriend(false)
      navigate(SCREENS.APP_WEB_VIEW, { url: URLS.TERMS })
    }
  
    const showMinPopUp = async () => {
      setPiggyBankVisible(false);
      setTimeout(() => {
        setMinPiggybankPopUp(true);
      }, 1000);
  
    }
    const onShare = (channelId) => {
      GetSocial.sendInvite(
        channelId,
        null,
        null,
        () => {
        },
        () => {
          // eslint-disable-next-line no-unused-vars
        },
        // eslint-disable-next-line no-unused-vars
        error => {
        }
      );
    }
    return (
        <PopUpWrapper>
            <GeoRestrictedModal>
                <Background source={ScatteredCircleBackGround} resizeMode="stretch">
                    <SafeAreaContainer>

                        {!isLoading &&
                            <DigitalGames navigation={navigation} />
                        }

                        <TrackingPopUp />
                        <PurchasePrompt
                            isVisible={isGamePlayScreen ? false : isPurchasePromptVisible}
                            data={purchasePrompt}
                            onClose={() => setIsPurchasePromptVisible(false)}
                        />


                        <ReferringRewardPopUp
                            isVisible={isGamePlayScreen ? false : isReferrerReward}
                            mode={referrerRewardMode}
                            tokens={referrerRewardTokens}
                            onPress={() => referNow()}
                        />

                        <InviteFriendPopUp
                            isVisible={isGamePlayScreen ? false : isInviteFriend}
                            onDissmiss={() => setInviteFriend(false)}
                            footerPress={() => onFooterPress()}
                            onShare={(channelId) => onShare(channelId)}
                        />

                        <FreeTokenPopUp
                            tokenGranted={freeTokenGranted}
                            isVisible={isGamePlayScreen ? false : isFreeTokenGrantedVisible}
                            onPress={() => freeTokenPopUpPress()}
                            testID="free-token-popup"
                        />
                        <GameStreakPopUp
                            text={
                                commonStrings.weeklyPlayStreak(
                                    convertNumberToStringWithComma(bonusScreenData?.weeklyGamesBonusScreen?.tokens),
                                    bonusScreenData?.weeklyGamesBonusScreen?.maxGames
                                )
                            }
                            isVisible={isGamePlayScreen ? false : bonusScreenData?.weeklyGamesBonusScreen?.isClaimable}
                            onPress={() => ClaimWeeklyDailyWin(false)}
                            testID="game-streak-popup"


                        />
                        <GameStreakPopUp
                            text={
                                commonStrings.dailyWinStreak(
                                    convertNumberToStringWithComma(bonusScreenData?.dailyWinBonusScreen?.tokens),
                                    bonusScreenData?.dailyWinBonusScreen?.maxGames
                                )
                            }
                            isVisible={isGamePlayScreen ? false : bonusScreenData?.dailyWinBonusScreen?.isClaimable}
                            onPress={() => ClaimWeeklyDailyWin(true)}
                            testID="game-streak-popup"


                        />
                        <DailyBonusPopUp
                            dailyBonus={dailyBonus}
                            isVisible={isGamePlayScreen ? false : isDailyBonusVisible}
                            onPress={() => dailyBonusPopUpPress()}
                            testID="daily-bonus-popup"
                        />

                        <DealOfTheDayPopUp
                            isUserLoggedIn={isUserLoggedIn}
                            isVisible={isGamePlayScreen ? false : isDealOfTheDayVisible}
                            setDealOfTheDayVisible={setDealOfTheDayVisible}
                            data={dealOfTheDay}
                            createYourAccount={() => setIsCreateAccountPopUpShown(true)}
                        />


                        <PiggyBankPopUp
                            data={piggyBankData}
                            isVisible={isGamePlayScreen ? false : isPiggyBankVisible}
                            onClose={() => setPiggyBankVisible(false)}
                            notApplicable={() => { showMinPopUp() }}
                        />

                        <PiggyBankUnlockPopUp
                            data={piggyBankData}
                            isVisible={isGamePlayScreen ? false : isPiggyBankUnlockVisible}
                            onClose={() => piggyBankUnlockPopUpOnClose()}
                            onUnlock={() => onClosePiggyBankHandler()}
                            userNotLoggedIn={() => userNotLoggedIn()}
                        />
                        <MinPiggybankPopUp
                            minToken={piggyBankData?.minTokens || 0}
                            isVisible={isGamePlayScreen ? false : isMinPiggybankPopUp}
                            onPress={() => { setMinPiggybankPopUp(false) }}
                            testID="min-piggy-bank-popup"

                        />

                        {achievementData.length > 0 && (
                            <AchievementPopUp
                                achievementData={achievementData}
                                isVisible={isGamePlayScreen ? false : isAchievementPopupVisible}
                                navigateToAchievements={() => {
                                    freeTokenPopUpPress();
                                    achievementPopUpOnPress(true);
                                }}
                                dismissPopup={() => {
                                    freeTokenPopUpPress();
                                    achievementPopUpOnPress(false);
                                }}
                            />

                        )}
                        <LoadingSpinner isLoading={isLoading} />
                        {isAnimated &&
                            <CoinsAnimations
                                onCompleted={() => setIsAnimated(false)}
                                counts={10}
                                imageSource={coin}
                            />
                        }
                    </SafeAreaContainer>
                </Background>
            </GeoRestrictedModal>
            <WatchAd ref={showAdRef} />
        </PopUpWrapper>
    )
};

export default DigitalGameRoom;