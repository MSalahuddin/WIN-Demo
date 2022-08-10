import React, { useContext, useState } from 'react';
import styled from 'styled-components/native';
import { NavigationActions, StackActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as RNIap from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import PiggyBankPopUp from '../common/PiggyBankPopUp';
import BottomIconButton from '../common/BottomIconButton';
import { color } from '../../styles';
import { scaleHeight, scaleWidth, scale } from '../../platformUtils';
import {
  notificationOn,
  prizeWon,
  giftBoxTransparent,
  bottomNavCross,
  piggyBankIcon,
  notification,
  backGroundDealOfTheDay,
  prize,
  medalInfo,
  BgImagePiggyBank
} from '../../../assets/images';
import { UserContext } from '../../context/User.context';
import { SCREENS, LOCAL_STORAGE_NAME } from '../../constants';
import api from '../../api';
import { popUpStrings, accountProfileStrings } from '../../stringConstants';
import MinPiggybankPopUp from '../common/MinPiggyBankPopup';
import { PopupContext } from '../../context/Popup.context';
import InstructionPopUpDark from '../common/InstructionPopupdark';

const BottomBar = styled(LinearGradient)`
  align-items: center;
  flex-direction: row;
  border-radius: ${scale(25)};
  justify-content: space-between;
  margin-horizontal: ${scaleWidth(20)};
  padding-vertical: ${scaleHeight(10)};
  margin-bottom: ${Platform.OS === 'android' ? scaleHeight(10) : scaleHeight(5)};
  margin-top: ${Platform.OS === 'android' ? scaleHeight(10) : scaleHeight(5)};
`;

const IconButtonView = styled.View`
  align-items: center;
`;

const IconButtonWrapper = styled(BottomIconButton)`
  margin-top: 0;
`;

const NotificationIcon = styled.Image`
  position: absolute;
  right: ${scale(5)};
  top: -${scale(5)};
  z-index: 1;
  height: ${Platform.OS === 'android' ? scaleHeight(10) : scaleHeight(10)};
  width: ${Platform.OS === 'android' ? scaleHeight(10) : scaleHeight(10)};
`;
const PromoPopUpView = styled.View`
  align-items: center;
  justify-content: center;
  padding-horizontal: ${scale(20)};
  margin-top:${scaleHeight(-60)}
  margin-bottom:${scaleHeight(20)}
  
`;

const ExpandedBottomNav = ({ onPressClose, navigation, setLoader, dismissLoader }) => {
  // const { setIsCreateAccountPopUpShown } = useContext(PopupContext);
  const { newsFeedCount, isPiggyBankFull, fetchPiggyBankStatus } = useContext(UserContext);
  const { navigate } = navigation;
  const [isPiggyBankVisible, setPiggyBankVisible] = useState(false);
  const [piggyBankData, setPiggyBankData] = useState(null);
  const [isMinPiggybankPopUp, setMinPiggybankPopUp] = useState(false);
  const { displayRequestError } = useContext(PopupContext);
  const [isPrizevaultPopup, setIsPrizeVaultPopUp] = useState(false);
  const removePiggyBank = async () => {
    await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.PIGGY_BANK_STATUS);
    // eslint-disable-next-line no-use-before-define
    onClosePiggyBankHandler();
  };

  const unlockPiggyBack = async () => {
    try {
      const res = await api.postPiggyBankUnlock();
      if (res.status === 200) {
        await removePiggyBank();
      }
    } catch (error) {
      // fail
      // onClose()
    }
  };

  const renderPromoContent = () => {
    return (
      <PromoPopUpView>
        <Text fontFamily={FONT_FAMILY.BOLD} alignCenter size={SIZE.LARGE} color={color.white}>
          {accountProfileStrings.noPrizeVault}
        </Text>
        <Text fontFamily={FONT_FAMILY.SEMI_BOLD} alignCenter size={SIZE.NORMAL} color={color.white}>
          {accountProfileStrings.fillYourVault}
        </Text>
      </PromoPopUpView>
    );
  };

  const checkPiggyBankStatus = async () => {
    setLoader();
    let payload = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.PIGGY_BANK_STATUS);
    payload = await JSON.parse(payload);
    if (payload !== null) {
      const tokenPackId = Platform.OS === 'android' ? payload.androidProductId : payload.iosProductId;
      const packs = await RNIap.getProducts([tokenPackId]);
      // get products returning all products every time with different index
      // pack.filter filter our require pack
      const packsDetail = packs.filter(x => x.productId === tokenPackId);
      payload.localizedPrice = `${packsDetail[0].localizedPrice}`;
      if (payload.isPiggyBankUnlocked) {
        setPiggyBankData(payload);

        dismissLoader();
        setPiggyBankVisible(true);
      } else {
        dismissLoader();
        await unlockPiggyBack();
        setPiggyBankData(payload);
        setPiggyBankVisible(true);
      }
    }
  };

  const showMinPopUp = async () => {
    setPiggyBankVisible(false);
    setTimeout(() => {
      setMinPiggybankPopUp(true);
    }, 1000);
  };

  const onClosePiggyBankHandler = async () => {
    await fetchPiggyBankStatus();
    await checkPiggyBankStatus();
  };
  const fetchAccountProfileData = async () => {
    // setLoader();
    try {
      const res = await api.getProfileInfoDetails();
      if (res.status === 200 && res.data) {
        if (res.data.recentPlayerPrizes.length) {
          navigate(SCREENS.PRIZE_VAULT);
        } else {
          setIsPrizeVaultPopUp(true);
        }
      }
    } catch (error) {
      displayRequestError(error.message);
    }
    // dismissLoader()
  };
  // const resetScreen = async () => {
  //   const resetAction = StackActions.reset({
  //     index: 0,
  //     actions: [NavigationActions.navigate({ routeName: SCREENS.GAME_ROOM })],
  //   });
  //   navigation.dispatch(resetAction);
  // }

  // const userNotLoggedIn = async () => {
  //   setIsCreateAccountPopUpShown(true)
  //   resetScreen()
  // }

  const onPiggyBankPress = async () => {
    // if(!isUserLoggedIn){
    //   await userNotLoggedIn()
    // }
    // else{
    await fetchPiggyBankStatus();
    await checkPiggyBankStatus();
    // }
  };
  return (
    <>
      <PiggyBankPopUp
        data={piggyBankData}
        isVisible={isPiggyBankVisible}
        onClose={() => setPiggyBankVisible(false)}
        notApplicable={() => {
          showMinPopUp();
        }}
        backBtnTxt={popUpStrings.backToGameRoom}
      />

      <MinPiggybankPopUp
        minToken={piggyBankData?.minTokens || 0}
        isVisible={isMinPiggybankPopUp}
        onPress={() => {
          setMinPiggybankPopUp(false);
        }}
        testID="min-piggy-bank-popup"
      />
      <InstructionPopUpDark
        buttonText={popUpStrings.ok}
        bannerLabel={popUpStrings.info}
        topIcon={medalInfo}
        border
        backgroundImage={BgImagePiggyBank}
        isVisible={isPrizevaultPopup}
        onPress={() => setIsPrizeVaultPopUp(false)}
        // testID="create-account-popup"
      >
        {renderPromoContent()}
      </InstructionPopUpDark>

      <BottomBar
        colors={[color.bottomNavColor1, color.bottomNavColor2, color.bottomNavColor3]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <IconButtonView>
          <IconButtonWrapper size={25} icon={prizeWon} onPress={() => navigate(SCREENS.LEADERBOARD)} />
        </IconButtonView>
        <IconButtonView>
          <IconButtonWrapper size={25} icon={giftBoxTransparent} onPress={() => fetchAccountProfileData()} />
        </IconButtonView>
        <IconButtonView>
          <IconButtonWrapper
            size={30}
            icon={bottomNavCross}
            onPress={() => {
              onPressClose();
            }}
          />
        </IconButtonView>
        <IconButtonView>
          {isPiggyBankFull && <NotificationIcon source={notificationOn} />}

          <IconButtonWrapper
            size={25}
            icon={piggyBankIcon}
            onPress={() => {
              onPiggyBankPress();
            }}
          />
        </IconButtonView>
        <IconButtonView>
          {newsFeedCount > 0 && <NotificationIcon source={notificationOn} />}
          <IconButtonWrapper
            size={25}
            icon={notification}
            onPress={() => {
              navigate(SCREENS.NEWS_ROOM);
            }}
          />
        </IconButtonView>
      </BottomBar>
    </>
  );
};

ExpandedBottomNav.propTypes = {
  onPressClose: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  }).isRequired,
  setLoader: PropTypes.func.isRequired,
  dismissLoader: PropTypes.func.isRequired
};

export default ExpandedBottomNav;
