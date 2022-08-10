/* eslint-disable consistent-return */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { hasNotch } from 'react-native-device-info';
import { GetSocial } from 'getsocial-react-native-sdk';
// import Carousel from 'react-native-snap-carousel';
import * as RNIap from 'react-native-iap';
import { Platform, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { IronSource, IronSourceRewardedVideo, IronSourceOfferwall } from '@wowmaking/react-native-iron-source';
import BonusCard from './BonusCard';
import DailyBonusCard from './DailyBonusCard';
import MinPiggybankPopUp from '../common/MinPiggyBankPopup';
// import Dot from '../common/Dot';
import InviteFriendPopUp from '../common/InviteFriendPopUp'
import { UserContext } from '../../context/User.context';
import { scale, scaleHeight } from '../../platformUtils';
import { gameCardReloadStrings, popUpStrings, commonStrings, playHistoryStrings } from '../../stringConstants';
import StackEmPopUp from '../common/StackEmPopUp';
import {
  SCREENS,
  LOCAL_STORAGE_NAME,
  URLS,
  ANALYTICS_EVENTS,
  AD_UNIT,
  ANALYTICS_PROPERTIES,
  ANALYTICS_APPSFLYER_EVENTS,
  BLUSHIFT_EVENT,
  BLUESHIFT_ANALYTICS_PROPERTIES,
  SHARE_TYPE_STRING
} from '../../constants';
import api from '../../api';
import LoadingSpinner from '../common/LoadingSpinner';
import { PopupContext } from '../../context/Popup.context';
// import PiggyBankUnlockPopUp from '../common/PiggyBankUnlockPopUp';
import PiggyBankPopUp from '../common/PiggyBankPopUp';
import DailyBonusPopUp from '../common/DailyBonusPopUp';
import RewardedVideoPopUp from '../common/RewardedVideoPopUp';
import CoinsAnimations from '../common/CoinsAnimations';
import InstructionPopUp from '../common/InstructionPopUp';
import Text, { SIZE } from '../common/Text';
import { color } from '../../styles';
import {
  medalError,
  BgImagePiggyBank,
  ImageIconPiggyBank,
  BgImageReferFriend,
  ImageIconReferFriend,
  coin,
  ImageIconDailyBonus,
  BgImageDailyBonus,
  BgImageStackEm,
  ImageIconStackEm,
  BgImageWatchAndEarn,
  ImageIconWatchAndEarn,
  BgImageWinTen,
  ImageIconWinTen,
  BgImageWinFifty,
  ImageIconWinFifty,
  ImageIconFreePlays,
  BgImageFreePlays,
  NotificationCircle,
  offerwallIcon,
  offerwallBackround
} from '../../../assets/images';
import { getAppInitKeys } from '../../iron-source-setting';
import { logEvent } from '../../amplitudeUtils';
import { IronSourceImpressionData } from '../../ironsource';
import {AFLogCustomEvent} from "../../appFlyer.utils";
import { logBlushiftEvent } from '../../blushiftutils';

export const styles = StyleSheet.create({
  scrollViewContainerStyle: {
    paddingBottom: scaleHeight(16)
  }
});
const Container = styled.ScrollView`
  margin-top: ${hasNotch() ? scaleHeight(32) : scaleHeight(24)};
`;


const BoxPaddingView = styled.View`
  padding-horizontal: ${scale(10)};
  padding-bottom: ${scaleHeight(24)};
`;

const PopUpContentView = styled.View`
  align-items: center;
  justify-content: center;
  padding-horizontal: ${scale(15)};
`;


const BonusContainer = ({ navigation }) => {
  const { navigate } = navigation;
  const {
    fetchDailyBonus,
    fetchProfileData,
    fetchPiggyBankStatus,
    playerId,
    // isUserLoggedIn,
    bonusScreenData,
    freePlaysGrandId,
    totalFreePlays,
    isFreePlayAvail,
    handleAwaitFreePlay,
  } = useContext(UserContext);


  const { setIsCreateAccountPopUpShown, displayRequestError } = useContext(PopupContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyBonusData, setDailyBonusData] = useState(null);
  const [stackEmData, setStackEmData] = useState(null);
  const [piggyBankData, setPiggyBankData] = useState(null);
  const [todayBonus, setTodayBonus] = useState(null);
  const [weeklyBonus, setWeeklyBonus] = useState(null);
  // const [isPiggyBankUnlockVisible, setPiggyBankUnlockVisible] = useState(false);
  const [isPiggyBankVisible, setPiggyBankVisible] = useState(false);
  const [claimDailyBonus, setClaimDailyBonus] = useState(false)
  const [remaininTime, setRemainingTime] = useState(2)
  const [dailyBonus, setDailyBonus] = useState(null);
  const [isDailyBonusVisible, setIsDailyBonusVisible] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [isInviteFriend, setInviteFriend] = useState(false);
  const [isInviteFriendData, setInviteFriendData] = useState(null);
  const [isStackEmPopupVisible, setStackEmPopupVisible] = useState(false);
  const [isMinPiggybankPopUp, setMinPiggybankPopUp] = useState(false);
  const [resetTime, setResetTime] = useState(null)
  const [remHour, setRemHour] = useState(0)
  const [remMin, setRemMin] = useState(0)
  const [remSec, setRemSec] = useState(1)
  const [hasRewarded, setHasRewarded] = useState(false)
  const [hasOffered, setHasOffered] = useState(false)
  const [rewardedVideoData, setRewardedVideoData] = useState(null);
  const [rewardedTokens, setRewardedTokens] = useState(null);
  const [adsUnavailable, setAdsUnavailable] = useState(false);

  const onFooterPress = () => {
    setInviteFriend(false)
    navigate(SCREENS.APP_WEB_VIEW, { url: URLS.TERMS })
  }

  const onShare = (channelId) => {

    GetSocial.sendInvite(
      channelId,
      null,
      null,
      () => {
        logBlushiftEvent(BLUSHIFT_EVENT.SHARED_CLICK,{[BLUESHIFT_ANALYTICS_PROPERTIES.SHARE_TYPE]:SHARE_TYPE_STRING.ReferAFriend})
      },
      () => {
        // eslint-disable-next-line no-unused-vars
      },
      // eslint-disable-next-line no-unused-vars
      error => {
        Alert.alert(commonStrings.error, error, [{
          text: commonStrings.ok, onPress: () => { }
        }], { cancelable: false });
      }
    );
  }
  // const userNotLoggedIn = async () => {
  //   setIsCreateAccountPopUpShown(true)
  // }

  useEffect(() => {
    if (dailyBonusData) {
      const Interval = setInterval(() => {

        setRemainingTime(remHour * 60 * 60 + remMin * 60 + remSec)
        // if(remHour <= 0 && remMin <= 0 && remSec <= 0){
        //   setRemainingTime(false)
        if (remSec > 0) {
          setRemSec(remSec - 1)
        }

        if (remSec <= 0) {

          if (remMin > 0) {
            setRemMin(remMin - 1)
            setRemSec(59)
          }
          if (remMin <= 0) {

            if (remHour > 0) {
              setRemHour(remHour - 1)
              setRemMin(59)
              setRemSec(59)
            }
          }
        }

      }, 1000)

      if (remaininTime < 1) {
        setClaimDailyBonus(true);
        clearInterval(Interval)
        return () => clearInterval(Interval)
      }
      if (!(remaininTime < 1)) {
        setClaimDailyBonus(false);

      }
      return () => clearInterval(Interval)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaininTime, claimDailyBonus, dailyBonusData, remSec, hasRewarded, isAnimated]);

  const ironSourceHandler = async () => {
    const { appKey } = await getAppInitKeys()
    IronSource.setConsent(true);
    await IronSource.initializeIronSource(appKey, playerId, { validateIntegration: true })
    await IronSourceRewardedVideo.initializeRewardedVideo();
    await IronSourceImpressionData.initializeImpressionData();
  }

  const eventHandler = async (adUnit) => {
    // eslint-disable-next-line default-case
    switch (adUnit) {
      case AD_UNIT.REWARDED_VIDEO:
        logEvent(ANALYTICS_EVENTS.WATCHED_VIDEO_AD);
        AFLogCustomEvent(ANALYTICS_APPSFLYER_EVENTS.AD_VIEW,{});
        break;
      case AD_UNIT.OFFERWALL:
        AFLogCustomEvent(ANALYTICS_APPSFLYER_EVENTS.OFFERWALL_VIEW,{});
        break;
    }
  }

  useEffect(() => {
    ironSourceHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hasRewarded) {
      eventHandler(AD_UNIT.REWARDED_VIDEO)
    } else if (hasOffered){
      eventHandler(AD_UNIT.OFFERWALL)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRewarded, hasOffered]);

  const ironSourceRewardedVideoClosedByUserHandler = async () => {
    setHasRewarded(true)
  }

  const ironSourceOfferwallClosedByUserHandler = async () => {
    setHasOffered(true)
  }

  const onCloseRewardedVideo = () => {
    IronSourceRewardedVideo.removeAllListeners();
    IronSourceImpressionData.removeAllListeners();
  };

  const onCloseOfferwall = () => {
    IronSourceOfferwall.removeAllListeners();
    IronSourceImpressionData.removeAllListeners();
  }

  const getVerifyS2S = async (adUnit) => {
    const result = await api.getVerifyS2S();
    if (result.status === 200 && result.data) {
      const { tokens } = result.data
      setRewardedTokens(tokens)
      // eslint-disable-next-line default-case
      switch (adUnit) {
        case AD_UNIT.REWARDED_VIDEO:
          await ironSourceRewardedVideoClosedByUserHandler()
          break;
        case AD_UNIT.OFFERWALL:
          await ironSourceOfferwallClosedByUserHandler()
          break;
      }
    }
  }

  const ironSourceRewardedVideoClosedByUser = async () => {
    setTimeout(() => {
      getVerifyS2S(AD_UNIT.REWARDED_VIDEO)
    }, 5000)
    onCloseRewardedVideo()
  }

  const ironSourceOfferwallClosedByUser = async () => {
    setTimeout(() => {
      getVerifyS2S(AD_UNIT.OFFERWALL)
    }, 5000)
    onCloseOfferwall()
  }

  const ironSourceImpressionData = (impressionData) => {
    logEvent(ANALYTICS_EVENTS.IRONSOURCE_REVENUE, {
      [ANALYTICS_PROPERTIES.REVENUE]: impressionData.revenue,
      [ANALYTICS_PROPERTIES.AD_SOURCE]: impressionData.adNetwork,
      [ANALYTICS_PROPERTIES.AD_FORMAT]: impressionData.adUnit,
      [ANALYTICS_PROPERTIES.AD_UNIT_NAME]: impressionData.instanceName,
    });
  }

  const showRewardedVideo = async () => {
    IronSourceRewardedVideo.addEventListener('ironSourceRewardedVideoClosedByUser', ironSourceRewardedVideoClosedByUser)
    IronSourceRewardedVideo.addEventListener('ironSourceRewardedVideoClosedByError', onCloseRewardedVideo);
    IronSourceImpressionData.addEventListener('ironSourceImpressionData', ironSourceImpressionData);
    const available = await IronSourceRewardedVideo.isRewardedVideoAvailable()
    if (available) {
      IronSourceRewardedVideo.showRewardedVideo();
    }
    else {
      setAdsUnavailable(true)
      IronSourceImpressionData.removeAllListeners();
    }
  };

  const showOfferwall = async () => {
    IronSourceOfferwall.showOfferwall();
    IronSourceOfferwall.addEventListener('ironSourceOfferwallClosedByUser', ironSourceOfferwallClosedByUser)
    IronSourceOfferwall.addEventListener('ironSourceOfferwallClosedByError', onCloseOfferwall);
    IronSourceImpressionData.addEventListener('ironSourceImpressionData', ironSourceImpressionData);
    IronSourceOfferwall.addEventListener('ironSourceOfferwallAvailable', (available) => {
      if (Platform.OS === 'ios' && !available) {
        setAdsUnavailable(true)
        IronSourceImpressionData.removeAllListeners();
      }
    });

  };

  const adUnits = async (adUnit) => {
    // eslint-disable-next-line default-case
    switch (adUnit) {
      case AD_UNIT.OFFERWALL:
        await showOfferwall()
        break;
      case AD_UNIT.REWARDED_VIDEO:
        await showRewardedVideo()
        break;
    }
  }

  const adUnitOnPress = async (adUnit) => {
    // if (isUserLoggedIn) {
    await api.getClearPreviouslyAwardedVideo()
    await adUnits(adUnit)
    // }
    // else {
    //   setIsCreateAccountPopUpShown(true)
    // }
  }

  const RewardedVideoPopUpPress = async () => {
    await fetchProfileData()
    setHasRewarded(false)
    setIsAnimated(true)
  }

  const getDailyBonus = async () => {
    let retrieveDailyBonus = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.DAILY_BONUS);
    retrieveDailyBonus = await JSON.parse(retrieveDailyBonus);
    if (retrieveDailyBonus) {
      setIsDailyBonusVisible(true);
      setDailyBonus(retrieveDailyBonus.dailyReward)
    }
  };


  const onClosePiggyBankHandler = async () => {
    await fetchPiggyBankStatus()
    await popUpVisible()
  }

  const removePiggyBank = async () => {
    await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.PIGGY_BANK_STATUS);
    // eslint-disable-next-line no-use-before-define
    onClosePiggyBankHandler()
  }


  const unlockPiggyBack = async () => {
    try {
      const res = await api.postPiggyBankUnlock();
      if (res.status === 200) {
        await removePiggyBank()
      }
    } catch (error) {
      // fail 
      // onClose()
    }
  }

  const popUpVisible = async () => {
    await fetchPiggyBankStatus()
    let payload = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.PIGGY_BANK_STATUS);
    payload = await JSON.parse(payload);
    if (payload !== null) {
      const tokenPackId = Platform.OS === 'android' ?
        payload.androidProductId : payload.iosProductId
      const packs = await RNIap.getProducts([tokenPackId]);
      // get products returning all products every time with different index
      // pack.filter filter our requrie pack
      const packsDetail = packs.filter(x => x.productId === tokenPackId)
      payload.localizedPrice = `${packsDetail[0].localizedPrice}`
      if (payload.isPiggyBankUnlocked) {
        setPiggyBankData(payload);

        setPiggyBankVisible(true);

      }
      else {
        await unlockPiggyBack()
        setPiggyBankData(payload);
        setPiggyBankVisible(true);
        // setPiggyBankUnlockVisible(true);
      }
    };

  }

  const stackEmPopUpPress = async () => {
    setStackEmPopupVisible(false)
    setIsAnimated(true)
    await fetchProfileData()
  }




  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkPiggyBankStatus = async () => {

    let payload = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.PIGGY_BANK_STATUS);
    payload = await JSON.parse(payload);
    if (payload !== null) {
      const tokenPackId = Platform.OS === 'android' ?
        payload.androidProductId : payload.iosProductId
      const packs = await RNIap.getProducts([tokenPackId]);
      // get products returning all products every time with different index
      // pack.filter filter our requrie pack
      const packsDetail = packs.filter(x => x.productId === tokenPackId)
      payload.localizedPrice = `${packsDetail[0].localizedPrice}`

      if (payload.isPiggyBankUnlocked) {
        setPiggyBankData(payload);
      }
      else {
        setPiggyBankData(payload);
      }
    };
  }



  const showMinPopUp = async () => {
    setPiggyBankVisible(false);
    setTimeout(() => {
      setMinPiggybankPopUp(true);
    }, 1000);

  }

  const fetchBonusScreen = async () => {

    try {
      const res = await api.getBonusScreen();
      if (res.status === 200 && res.data) {
        setIsLoading(false);
        await checkPiggyBankStatus();
        setInviteFriendData({ isShown: true })
        setRewardedVideoData({ isShown: true })
        setDailyBonusData(res.data?.dailyBonusScreen);
        const hours = res.data?.dailyBonusScreen?.claimableAtHours;
        const minutes = res.data?.dailyBonusScreen?.claimableAtMinutes;
        const secs = res.data?.dailyBonusScreen?.claimableAtSeconds;
        // eslint-disable-next-line radix

        const duration = hours * 60 * 60 + minutes * 60 + secs;
        setRemainingTime(duration > 0 ? duration : 2)
        setRemSec(secs);
        setRemMin(minutes);
        setRemHour(hours);


        setStackEmData(res.data?.stackEmBonusScreen);
        setTodayBonus(res.data?.dailyWinBonusScreen);
        setWeeklyBonus(res.data?.weeklyGamesBonusScreen);
        setResetTime(res.data?.dailyWinWeeklyGameBonus)
      }
    } catch (error) {
      displayRequestError(error.message);
    }

  };
  const onClaimDailyBonus = async () => {
    await fetchDailyBonus();
    await getDailyBonus();
    setClaimDailyBonus(false);
    setRemSec(59);
    setRemMin(0);
    setRemHour(24);
    await fetchBonusScreen();
    navigate(SCREENS.GAME_CARD_RELOAD)
  }
  const dailyBonusPopUpPress = async () => {
    setIsDailyBonusVisible(false)
    setIsAnimated(true)
    await fetchProfileData();
    setTimeout(async () => {
      await fetchBonusScreen();
    }, 3000);

  }

  // const onClosePiggyBankHandler = async () => {
  //   setPiggyBankUnlockVisible(false)
  //   await fetchPiggyBankStatus();
  //   await checkPiggyBankStatus()
  // }
  const addStackEm = async () => {
    await showRewardedVideo();
    setIsLoading(true);
    try {
      const res = await api.PostAddStackEm();
      if (res.status === 200 && res.data) {

        setStackEmPopupVisible(true)
        await fetchBonusScreen();
      }
    }
    catch (error) {
      displayRequestError(error.message);
    }

  };
  const ClaimWeeklyDailyWin = async (bool) => {

    try {
      await showRewardedVideo();
      const res = await api.PostClaimDailyWeek(bool);
      if (res.status === 200 && res.data) {
        await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.FREE_TOKEN_GIFT);
        await fetchBonusScreen();
      }
    }
    catch (error) {
      // silently handled
    }
    setIsAnimated(true)
    await fetchProfileData()
  }
  const ClaimFreePlay = async (id) => {
    await showRewardedVideo()
    try {
      const response = await api.getAvailFreePlays(id);
      if (response.status === 200 && response.data) {
        handleAwaitFreePlay()

      }
    }
    catch (error) {
      // fail silently
    }
  }


  useEffect(() => {
    fetchBonusScreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, bonusScreenData]);

  return (
    <Container>
      <BoxPaddingView>

        <BonusCard
          image={BgImageFreePlays}
          imageIcon={ImageIconFreePlays}
          Title={gameCardReloadStrings.freePlay}
          Detailedtext={isFreePlayAvail ? gameCardReloadStrings.freePlayDetail_1 : gameCardReloadStrings.freePlayDetail_2}
          isInfo={false}
          data
          noOfFreePlays={totalFreePlays}
          notificationImg={NotificationCircle}
          onPress={() => {
            ClaimFreePlay(freePlaysGrandId)
          }}
          isClaimFreePlay={isFreePlayAvail}
          isDisabled={!isFreePlayAvail}
          btnTxt={gameCardReloadStrings.claim}
          claimAndWatch={true}
          claimPopUpText = {gameCardReloadStrings.claimAndWatch(playHistoryStrings.freePlay)}
        />
        <DailyBonusCard
          image={BgImageDailyBonus}
          imageIcon={ImageIconDailyBonus}
          Title={gameCardReloadStrings.dailyBonus}
          isInfo={false}
          onPress={onClaimDailyBonus}
          isDisabled={!claimDailyBonus}
          btnTxt={gameCardReloadStrings.claim}
          data={dailyBonusData}
          hours={claimDailyBonus ? 0 : remHour}
          minutes={claimDailyBonus ? 0 : remMin}
          seconds={claimDailyBonus ? 0 : remSec}
        />
        <BonusCard
          data={isInviteFriendData}
          image={BgImageReferFriend}
          imageIcon={ImageIconReferFriend}
          Title={gameCardReloadStrings.referAFreind}
          Detailedtext={gameCardReloadStrings.inviteAFriendDetail}
          isInfo={false}
          onPress={() => {
            setInviteFriend(true)
          }}
          isDisabled={false}
          btnTxt={gameCardReloadStrings.invite}
        />
        <BonusCard
          image={BgImageWatchAndEarn}
          imageIcon={ImageIconWatchAndEarn}
          Title={gameCardReloadStrings.rewardedVideo}
          Detailedtext={gameCardReloadStrings.rewardedVideoDetail}
          data={rewardedVideoData}
          // isInfo
          // infoPress={popUpVisible}
          onPress={() => adUnitOnPress(AD_UNIT.REWARDED_VIDEO)}
          isDisabled={false}
          btnTxt={gameCardReloadStrings.rewardedVideoBtnText}
        />

        <BonusCard
          image={offerwallBackround}
          imageIcon={offerwallIcon}
          Title={gameCardReloadStrings.offerwall}
          Detailedtext={gameCardReloadStrings.offerwallDetail}
          data={rewardedVideoData}
          // isInfo
          // infoPress={popUpVisible}
          onPress={() => adUnitOnPress(AD_UNIT.OFFERWALL)}
          isDisabled={false}
          btnTxt={gameCardReloadStrings.rewardedVideoBtnText}
        />
        <BonusCard
          image={BgImagePiggyBank}
          imageIcon={ImageIconPiggyBank}
          Title={gameCardReloadStrings.piggyBank}
          Detailedtext={gameCardReloadStrings.piggyBankDetail}
          isInfo
          data={piggyBankData}
          infoPress={popUpVisible}
          onPress={popUpVisible}
          isDisabled={isPiggyBankVisible}
          btnTxt={gameCardReloadStrings.buyPriceToken(piggyBankData?.localizedPrice)}
        />

        <BonusCard
          image={BgImageStackEm}
          imageIcon={ImageIconStackEm}
          Title={gameCardReloadStrings.stackEm}
          Detailedtext={gameCardReloadStrings.stackEmDetail(stackEmData?.maxGames || 0, stackEmData?.tokens || 0)}
          isInfo={false}
          onPress={addStackEm}
          isProgressBar
          data={stackEmData}
          ProgressStarPoint={stackEmData?.gameWinCount || 0}
          ProgressEndPoint={stackEmData?.maxGames || 0}
          isDisabled={stackEmData?.gameWinCount !== stackEmData?.maxGames}
          btnTxt={gameCardReloadStrings.claim}
          claimAndWatch={true}
          claimPopUpText = {gameCardReloadStrings.claimAndWatch(stackEmData?.tokens)}
        />
        <BonusCard
          image={BgImageWinTen}
          imageIcon={ImageIconWinTen}
          Title={gameCardReloadStrings.winGameToday(todayBonus?.maxGames)}
          Detailedtext={gameCardReloadStrings.todayBonusDetail(todayBonus?.maxGames, todayBonus?.tokens)}
          isInfo={false}
          isProgressBar
          data={todayBonus}
          showDays={false}
          onPress={() => ClaimWeeklyDailyWin(true)}
          remainingTime={resetTime}
          ProgressStarPoint={todayBonus?.gameWinCount}
          ProgressEndPoint={todayBonus?.maxGames}
          isDisabled={!todayBonus?.isClaimable}
          btnTxt={gameCardReloadStrings.claim}
          claimAndWatch={true}
          claimPopUpText = {gameCardReloadStrings.claimAndWatch(todayBonus?.tokens)}
        />
        <BonusCard
          image={BgImageWinFifty}
          imageIcon={ImageIconWinFifty}
          Title={gameCardReloadStrings.playGameWeekly(weeklyBonus?.maxGames)}
          Detailedtext={gameCardReloadStrings.weekBonusDetail(weeklyBonus?.maxGames, weeklyBonus?.tokens)}
          isInfo={false}
          isProgressBar
          data={weeklyBonus}
          showDays
          onPress={() => ClaimWeeklyDailyWin(false)}
          remainingTime={resetTime}
          ProgressStarPoint={weeklyBonus?.gamePlayCount}
          ProgressEndPoint={weeklyBonus?.maxGames}
          isDisabled={!weeklyBonus?.isClaimable}
          btnTxt={gameCardReloadStrings.claim}
          claimAndWatch={true}
          claimPopUpText = {gameCardReloadStrings.claimAndWatch(weeklyBonus?.tokens)}
        />




      </BoxPaddingView>
      <PiggyBankPopUp
        data={piggyBankData}
        isVisible={isPiggyBankVisible}
        notApplicable={() => { showMinPopUp() }}
        onClose={() => setPiggyBankVisible(false)}
        backBtnTxt={popUpStrings.goBack}
      />


      <MinPiggybankPopUp
        minToken={piggyBankData?.minTokens || 0}
        isVisible={isMinPiggybankPopUp}
        onPress={() => { setMinPiggybankPopUp(false) }}
        testID="min-piggy-bank-popup"

      />

      <DailyBonusPopUp
        dailyBonus={dailyBonus}
        isVisible={isDailyBonusVisible}
        onPress={() => dailyBonusPopUpPress()}
        testID="daily-bonus-popup"
      />
      <InviteFriendPopUp
        isVisible={isInviteFriend}
        onDissmiss={() => setInviteFriend(false)}
        footerPress={() => onFooterPress()}
        onShare={(channelId) => onShare(channelId)}
      />
      <StackEmPopUp
        freeToken={stackEmData?.tokens}
        game={stackEmData?.maxGames}
        isVisible={isStackEmPopupVisible}
        onPress={() => stackEmPopUpPress()}
        testID="stack-em-popup"

      />
      <InstructionPopUp
        isVisible={adsUnavailable}
        buttonText={popUpStrings.goBack}
        bannerLabel={popUpStrings.unavailable}
        icon={medalError}
        onPress={() => {
          setAdsUnavailable(false);
        }}
      >
        <PopUpContentView>
          <Text size={SIZE.SMALL} color={color.grayBlack} alignCenter>
            {popUpStrings.adsUnavailable}
          </Text>
        </PopUpContentView>
      </InstructionPopUp>

      <RewardedVideoPopUp
        isVisible={hasRewarded}
        tokens={rewardedTokens}
        onPress={() => RewardedVideoPopUpPress()}
      />
      {isAnimated &&
        <CoinsAnimations
          onCompleted={() => setIsAnimated(false)}
          counts={10}
          imageSource={coin}
        />
      }
      <LoadingSpinner isLoading={isLoading} />
    </Container>
  );
};

BonusContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};

export default BonusContainer;
