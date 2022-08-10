import React, { useState, useRef, useContext, useEffect } from 'react';
import { Animated, StyleSheet, Platform, Linking } from 'react-native';
import styled from 'styled-components/native';
import { hasNotch } from 'react-native-device-info';
import ViewPager from '@react-native-community/viewpager';
import PropTypes from 'prop-types';
import VipModal from './VipModal';
import StoreBanner, { BANNER_TYPE } from './StoreBanner';
import TokenPacksContainer from './TokenPacksContainer';
import SubscriptionContainer from './SubscriptionContainer';
import BonusContainer from './BonusContainer';
import StoreTabs from './StoreTabs';
import PromoCard from '../common/PromoCard';
import api from '../../api';
import InstructionPopUpDark from '../common/InstructionPopupdark';
import PopUpWrapper from '../common/PopUpWrapper';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import { UserContext } from '../../context/User.context';
import { getWindowWidth, scale, scaleHeight } from '../../platformUtils';
import {
  ScatteredCircleBackGround,
  dailyBonusCoin,
  NotificationCircle,
  BgImagePiggyBank
} from '../../../assets/images';
import { deeplinkStrings, gameCardReloadStrings, popUpStrings } from '../../stringConstants';
import { SafeAreaContainer, color } from '../../styles';
import { WW_BANNER_API_LOCATIONS, ANALYTICS_PROPERTIES, ANALYTICS_EVENTS, OPEN_PROMO_LOCATIONS, SCREENS } from '../../constants';
import { logEvent } from '../../amplitudeUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import BottomNavigator from '../game-room/BottomBar';

const styles = StyleSheet.create({
  animatedView: {
    marginTop: scaleHeight(30),
    marginBottom: scaleHeight(-24)
  }
});

const Background = styled.ImageBackground`
  flex: 1;
`;
const BannerContainer = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-bottom: ${scaleHeight(12)};
`;
const StyledViewPager = styled(ViewPager)`
  flex: 1;
  margin-top: ${hasNotch() ?
    scaleHeight(Platform.OS === 'android' ? 42 : 42)
    : scaleHeight(Platform.OS === 'android' ? 34 : 34)};
`;

const STORE_SECTION = [gameCardReloadStrings.packs, gameCardReloadStrings.bonuses, gameCardReloadStrings.subscriptions];
const STORE_BANNER = [
  gameCardReloadStrings.TokenPacks,
  gameCardReloadStrings.bonuses,
  gameCardReloadStrings.subscriptions
];

const bannerWidth = getWindowWidth() - scale(32);

const PromoPopUpView = styled.View`
  align-items: center;
  justify-content: center;
  padding-horizontal: ${scale(5)};
  margin-top:${scaleHeight(-60)}
  
`;
const PromoCardContainer = styled(PromoCard)`
width:${getWindowWidth() - scale(18)};
margin-horizontal:${scaleHeight(0)}
justify-content:center;
align-self:center
`;
const TextWrapper = styled(Text)`
  margin-top: ${({ marginTop }) => (marginTop ? scaleHeight(marginTop) : 0)};
`;
const TabsView = styled.View`
background-color: ${color.fadeBlue};
border-radius: ${scaleHeight(35)};
flex-direction:row;
margin-top: ${scale(5)};
margin-bottom:-${scale(35)};
margin-horizontal:${Platform.OS === 'android' ? 0 : scale(10)}
padding-top: ${scale(6)};
padding-bottom: ${scale(6)}
`;

const GameCardReload = ({ navigation }) => {
  const { params } = navigation.state;
  const initialPage = params && params.initialPage ? params.initialPage : 0;
  const pageRef = useRef(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(initialPage - 1);
  const [isPromoBannerVisible, setIsPromoBannerVisible] = useState(false);
  const [promoBannerData, setPromoBannerData] = useState([]);
  const promoBannerOpacity = new Animated.Value(1);
  const {
    isUserLoggedIn,
    isVipModalVisible,
    setIsVipModalVisible,
    purchaseProcess,
    isFreePlayBannerNotificationVisible,
    setFreePlayBannerNotificationVisible,
  } = useContext(UserContext);
  const [isPromoPopUpVisible, setIsPromoPopUpVisible] = useState(false);
  const [couponCodeEnableDisable, setCouponCodeEnableDisable] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [promoIndex, setPromoIndex] = useState(0);
  const [webPay, setIsWebPay] = useState(false);
  const handleArrowPress = index => {
    if (index === 1) {
      setFreePlayBannerNotificationVisible(false)
    }
    setCurrentSectionIndex(index);
    if (pageRef) {
      pageRef.current.setPage(index);
    }
  };
  const renderPromoContent = () => {
    if (!promoBannerData) {
      return null;
    }
    return (
      <PromoPopUpView>
        <Text fontFamily={FONT_FAMILY.BOLD} alignCenter size={SIZE.LARGEST} color={color.white}>
          {promoBannerData[promoIndex]?.title}
        </Text>
        <TextWrapper marginTop="12" alignCenter fontFamily={FONT_FAMILY.BOLD} size={SIZE.SMALL} color={color.white}>
          {promoBannerData[promoIndex]?.body}
        </TextWrapper>
      </PromoPopUpView>
    );
  };

  const fetchPromoBannerData = async () => {
    try {
      const res = await api.getBannerData(WW_BANNER_API_LOCATIONS.TOKEN_STORE);
      if (res.status === 200 && res.data) {
        const promoData = res.data;
        if (promoData) {
          if (promoData?.isActive === false) {
            setPromoBannerData([]);
            setIsPromoBannerVisible(false);
          }
          else {
            setPromoBannerData(promoData);
            setIsPromoBannerVisible(true);
          }
        }
      }
    } catch (error) {
      // fail silently
    }
  };

  const getWebPay = async () => {
    try {
      const res = await api.getWWAppSettings('WebPay');
      if (res.status === 200) {
        setIsWebPay(res.data)
      }
    } catch (error) {
      // fail silently
    }
  };
  const getCouponCodeEnableDisable = async () => {
    try {
      const res = await api.getCouponCodeEnableDisable();
      if (res.status === 200) {
        setCouponCodeEnableDisable(res.data)
      }
    } catch (error) {
      // fail silently
    }
  };

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.setPage(initialPage);
    }
    logEvent(ANALYTICS_EVENTS.Token_Store_Visit);
    fetchPromoBannerData();
    getCouponCodeEnableDisable();
    getWebPay();
  }, [initialPage]);
  const openPromoPopup = () => {
    const eventProps = {
      [ANALYTICS_PROPERTIES.PROMO_LOCATION]: OPEN_PROMO_LOCATIONS.TOKEN_STORE_HEADER,
      [ANALYTICS_PROPERTIES.PROMO_ID]: promoBannerData.bannerId
    };
    logEvent(ANALYTICS_EVENTS.OPENED_PROMO, eventProps);
    setIsPromoPopUpVisible(true);
  };

  const renderPromoBanner = () => {

    return (
      <Animated.View style={({ opacity: promoBannerOpacity }, styles.animatedView)}>
        <PromoCardContainer
          isClosable
          data={promoBannerData}
          onClose={() => setIsPromoBannerVisible(false)}
          onPress={(i) => {
            setPromoIndex(i)
            openPromoPopup()
          }}
        />
      </Animated.View>
    );
  };

 const handleClick = () => {
    Linking.canOpenURL(promoBannerData[promoIndex]?.hyperLink).then(supported => {
      if (supported) {
        Linking.openURL(promoBannerData[promoIndex]?.hyperLink);
      }
    });
  }

  return (
    <Background source={ScatteredCircleBackGround} resizeMode="stretch">
      <PopUpWrapper>
        <SafeAreaContainer>
            <BannerContainer>

              <StoreBanner
                label={STORE_BANNER[currentSectionIndex]}
                width={bannerWidth}
                textSize={SIZE.BANNER_LARGE}
                bannerType={currentSectionIndex === 1 ? BANNER_TYPE.STAR : BANNER_TYPE.NORMAL}
              />
              <TabsView>
                <StoreTabs
                  onPress={
                    () => { handleArrowPress(0) }}
                  backdropText={STORE_SECTION[0]}
                  isDotted={currentSectionIndex === 0}
                  width={bannerWidth} />
                <StoreTabs
                  onPress={
                    () => { handleArrowPress(1) }}
                  backdropText={STORE_SECTION[1]}
                  isDotted={currentSectionIndex === 1}
                  width={bannerWidth}
                  freePlayNotification={isFreePlayBannerNotificationVisible}
                  freePlayNotificationImg={NotificationCircle}
                />
                <StoreTabs
                  onPress={
                    () => { handleArrowPress(2) }}
                  backdropText={STORE_SECTION[2]}
                  isDotted={currentSectionIndex === 2}
                  width={bannerWidth}
                />
              </TabsView>
            </BannerContainer>
            <LoadingSpinner isLoading={purchaseProcess} />
            {isPromoBannerVisible && renderPromoBanner()}
            <StyledViewPager
              initialPage={initialPage}
              keyboardDismissMode="on-drag"
              ref={pageRef}
              onPageSelected={event => {
                setCurrentSectionIndex(event.nativeEvent.position);
              }}
            >
              <TokenPacksContainer navigation={navigation}
                isUserLoggedIn={isUserLoggedIn}
                couponCodeEnableDisable={couponCodeEnableDisable}
                webPay={webPay}
              />
              <BonusContainer navigation={navigation} />
              <SubscriptionContainer navigation={navigation} isUserLoggedIn={isUserLoggedIn} />
            </StyledViewPager>
            <VipModal isVisible={isVipModalVisible} setVisible={() => setIsVipModalVisible(!isVipModalVisible)} />
            {promoBannerData && (
              <InstructionPopUpDark
                bannerBtnText={
                  promoBannerData.length &&
                    promoBannerData[promoIndex]?.hyperLink ?
                    promoBannerData[promoIndex]?.hyperLinkLabel :
                    popUpStrings.ok}
                bannerLabel={popUpStrings.info}
                topIcon={dailyBonusCoin}
                border
                backgroundImage={BgImagePiggyBank}
                isVisible={isPromoPopUpVisible}
                bannerOnPress={() => {
                  setIsPromoPopUpVisible(false);
                  promoBannerData[promoIndex]?.hyperLink && handleClick();
                }}
                testID="create-account-popup"
                secPopupButtonText={
                  promoBannerData[promoIndex]?.hyperLink && popUpStrings.takeMeBack
                }
                secPopupButtonPress={() =>
                  promoBannerData[promoIndex]?.hyperLink && setIsPromoPopUpVisible(false)
                }
              >
                {renderPromoContent()}
              </InstructionPopUpDark>
            )}
            <BottomNavigator navigation={navigation}
              setLoader={() => { setIsLoading(true) }}
              dismissLoader={() => { setIsLoading(false) }}
            />
        </SafeAreaContainer>
      </PopUpWrapper>


    </Background>
  );
};

GameCardReload.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        initialPage: PropTypes.number
      })
    })
  }).isRequired
};

export default GameCardReload;
