import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components/native';
import { Platform, Modal, SafeAreaView, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import * as RNIap from 'react-native-iap';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import Text, { SIZE, FONT_FAMILY } from './Text';
import { scaleHeight, scaleWidth, scale, heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings } from '../../stringConstants';
import TextButton from './TextButton';
import {
  CenterCircleBackGround,
  inviteFriendBackgroundTokenImage1,
  inviteFriendBackgroundTokenImage2,
  DownTokenRight,
  downToken,
  star,
  DealoftheDayImage,
  backGroundDealOfTheDay
} from '../../../assets/images';
import { UserContext } from '../../context/User.context';
import { LOCAL_STORAGE_NAME, DOD_EXPIRED } from '../../constants';
import api from '../../api';
import { formatTokensLabel, displayError } from '../../utils';
import TopDropAnimation from './TopDropAnimation';
import SimpleButton from './SimpleButton';

const Background =
  Platform.OS === 'android'
    ? styled.ImageBackground`
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
      `
    : styled.ImageBackground`
        height: 100%;
        width: 100%;
        align-items: center;
        padding-top: ${scaleHeight(50)};
      `;

const BackdropTextWrapper = styled.ImageBackground`
  align-items: center;
  shadow-color: ${color.blackShadow};
  shadow-offset: 4px 4px;
  shadow-opacity: ${1};
  shadow-radius: 2px;
  border-radius: 10;
  margin-top:${scaleHeight(Platform.OS === 'android' ? 20 : 40)}
  height:${scaleHeight(heightRatio > 1 ? 324 : 354)}
  shadow-radius: 2px;
  width: 75%;
  `;

const TextButtonWrapper = styled(TextButton)`
  color: ${color.white};
  text-decoration-color: ${color.white};
`;

const TextButtonContainer = styled.View`
  margin-top: ${scaleHeight(40)};
`;

const StyledModal = styled(Modal)`
  align-items: center;
  justify-content: center;
  margin: 0;
`;

const TextWrapper = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: ${scaleHeight(-25)};
`;
const DealTokenView = styled.View`
  background-color: ${color.tagBlue};
  justify-content: center;
  align-items: center;
  margin-vertical: ${scale(10)};
  width: ${scaleWidth(200)};
  border-radius: ${scale(45)};
`;
const DealTokens = styled(Text)`
  margin-top: ${scale(Platform.OS === 'android' ? 10 : 20)};
  margin-bottom: ${scaleHeight(10)};
`;

const LineOneContainer = styled.View`
  flex-direction: row;
  margin-top: ${scale(10)};
  margin-bottom: ${scale(10)};
`;

const LineTwoContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${scale(0)};
`;

const ButtonWrapper = styled(Button)`
  margin-top: ${scaleHeight(5)};
  margin-bottom: ${scaleHeight(25)};
`;

const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(7)};
`;

const HeadingCoinLeft = styled.Image`
  height: ${scaleHeight(70)};
  margin-left:${scaleWidth(-100)}
  margin-top:${scaleHeight(Platform.OS === 'android' ? -50 : 30)}
  margin-bottom:${scaleHeight(Platform.OS === 'android' ? 30 : 10)}
  
`;
const DealOfDayIcon = styled.Image`
  height: ${scaleHeight(175)};
  margin-top: ${scaleHeight(-95)};
`;
const RightTopCoin = styled.Image`
  height: ${scaleHeight(70)};
  width: ${scaleHeight(70)};
  position: absolute;
  top: ${scaleHeight(13)};
  z-index: 1;
  right: ${scaleWidth(-30)};
`;
const LeftBottomCoin = styled.Image`
  height: ${scaleHeight(140)};
  width: ${scaleHeight(140)};
  position: absolute;
  bottom: ${scaleHeight(-40)};
  z-index: 1;
  left: ${scaleWidth(-90)};
`;
const BottomTokenView = styled.View`
  width: 100%;
  flex-direction: column;
`;
const BottomTokenLeft = styled.Image`
  height: ${scaleHeight(60)};
  width: ${scaleHeight(60)};
  z-index: 1;
  position: absolute;
  right: ${scaleWidth(30)};
  left: ${scaleHeight(70)};
`;
const BottomTokenRight = styled.Image`
height: ${scaleHeight(50)};
width: ${scaleHeight(50)};
align-self:flex-end;
position:absolute;
right:${scaleWidth(30)};
top:${scaleHeight(-20)}
z-index:1;

`;

const STAR_DIMENSIONS = { width: 49, height: 26 };
const SCREEN_DIMENSIONS = Dimensions.get('window');
const WIGGLE_ROOM = 50;

const FlippingImage = ({ back = false, delay, duration = 1000, source, style = {} }) => (
  <Animatable.Image
    animation={{
      from: {
        rotateX: back ? '0deg' : '180deg',
        rotate: !back ? '180deg' : '0deg'
      },
      to: {
        rotateX: back ? '360deg' : '-180deg',
        rotate: !back ? '180deg' : '0deg'
      }
    }}
    duration={duration}
    delay={delay}
    easing="linear"
    iterationCount="infinite"
    useNativeDriver
    source={source}
    // eslint-disable-next-line react-native/no-inline-styles
    style={{
      ...style,
      backfaceVisibility: 'hidden'
    }}
  />
);

FlippingImage.propTypes = {
  back: PropTypes.bool.isRequired,
  delay: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  source: PropTypes.node.isRequired,
  style: PropTypes.node.isRequired
};

const Swinging = ({ amplitude, rotation = 7, delay, duration = 700, children }) => (
  <Animatable.View
    animation={{
      0: {
        translateX: -amplitude,
        translateY: -amplitude * 0.8,
        rotate: `${rotation}deg`
      },
      0.5: {
        translateX: 0,
        translateY: 0,
        rotate: '0deg'
      },
      1: {
        translateX: amplitude,
        translateY: -amplitude * 0.8,
        rotate: `${-rotation}deg`
      }
    }}
    delay={delay}
    duration={duration}
    direction="alternate"
    easing="ease-in-out"
    iterationCount="infinite"
    useNativeDriver
  >
    {children}
  </Animatable.View>
);

Swinging.propTypes = {
  amplitude: PropTypes.number.isRequired,
  rotation: PropTypes.number.isRequired,
  delay: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
};

const Falling = ({ duration, delay, style, children }) => (
  <Animatable.View
    animation={{
      from: { translateY: -STAR_DIMENSIONS.height - WIGGLE_ROOM },
      to: { translateY: SCREEN_DIMENSIONS.height + WIGGLE_ROOM }
    }}
    duration={duration}
    delay={delay}
    // eslint-disable-next-line no-restricted-properties
    easing={t => Math.pow(t, 1.6555)}
    iterationCount="infinite"
    useNativeDriver
    style={style}
  >
    {children}
  </Animatable.View>
);

Falling.propTypes = {
  delay: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.node.isRequired
};

const randomize = max => Math.random() * max;

const range = count => {
  const array = [];
  for (let i = 0; i < count; i += 1) {
    array.push(i);
  }
  return array;
};

const DealOfTheDayPopUp = ({ isVisible, data, isUserLoggedIn, createYourAccount, setDealOfTheDayVisible }) => {
  const [isPopUpVisible, setPopUpVisible] = useState(isVisible);

  const { playerId } = useContext(UserContext);
  const count = 15;
  const duration = 3000;

  const removeDealOfTheDayUIDAndDealOfTheDay = async () => {
    const keys = [LOCAL_STORAGE_NAME.DEAL_OF_THE_DAY_PUCRHASE_UID, LOCAL_STORAGE_NAME.DEAL_OF_THE_DAY];
    try {
      await AsyncStorage.multiRemove(keys);
      setDealOfTheDayVisible(false);
    } catch (error) {
      // Fail silently
      setDealOfTheDayVisible(false);
    }
  };

  const cancelDealOfTheDay = async () => {
    const body = {
      tokenPackProductId: Platform.OS === 'android' ? data.androidProductId : data.iosProductId,
      isBuy: false,
      dealOfDayId: data.dealOfDayId,
      playerId: playerId,
      tokenPackId: Platform.OS === 'android' ? data.tokenPackAndroid.tokenPackId : data.tokenPackIOS.tokenPackId
    };

    try {
      const res = await api.postDealOfTheDayResponceLog(body);
      if (res.status === 201) {
        setPopUpVisible(false);
        await removeDealOfTheDayUIDAndDealOfTheDay();
      }
    } catch (error) {
      // fail
      // setPopUpVisible(false)
      await removeDealOfTheDayUIDAndDealOfTheDay();
    }
  };

  const requestPurchase = async id => {
    try {
      await RNIap.initConnection();
      await RNIap.requestPurchase(id, false);
    } catch (error) {
      // Error handled in purchase listener
    }
  };
  const getID = () => {
    if (Platform.OS === 'android') {
      return data.androidProductId;
    }
    return data.iosProductId;
  };

  const savePurchaseUIDOnDevice = async payload => {
    await AsyncStorage.setItem(LOCAL_STORAGE_NAME.DEAL_OF_THE_DAY_PUCRHASE_UID, payload.toString());
    const id = await getID();
    await requestPurchase(id);
  };

  const preDealOfTheDayPurchase = async () => {
    const body = {
      tokenPackProductId: Platform.OS === 'android' ? data.androidProductId : data.iosProductId,
      isBuy: true,
      dealOfDayId: data.dealOfDayId,
      playerId: playerId,
      tokenPackId: Platform.OS === 'android' ? data.tokenPackAndroid.tokenPackId : data.tokenPackIOS.tokenPackId
    };

    try {
      const res = await api.postDealOfTheDayResponceLog(body);
      if (res.status === 201) {
        savePurchaseUIDOnDevice(res.data.dealOfDayResponseLogId);
      } else if (res.status === 200 && res.data === DOD_EXPIRED) {
        await removeDealOfTheDayUIDAndDealOfTheDay();
        displayError(res.data);
        setPopUpVisible(false);
      }
    } catch (error) {
      // fail
      // setPopUpVisible(false)
    }
  };

  const checkLoggedIn = async () => {
    // if (isUserLoggedIn) {
    await preDealOfTheDayPurchase();
    // }
    // else {
    //   createYourAccount()
    //   setPopUpVisible(false)
    // }
  };

  useEffect(() => {
    setPopUpVisible(isVisible);
  }, [isVisible]);
  return (
    <SafeAreaView>
      <StyledModal visible={isPopUpVisible}>
        <Background source={CenterCircleBackGround} resizeMode="stretch">
          <TopDropAnimation image={star} />
          <HeadingCoinLeft source={inviteFriendBackgroundTokenImage1} resizeMode="contain" />

          <BackdropTextWrapper source={backGroundDealOfTheDay} resizeMode="stretch">
            <DealOfDayIcon source={DealoftheDayImage} resizeMode="contain" />
            <RightTopCoin source={DownTokenRight} resizeMode="contain" />
            <LeftBottomCoin source={inviteFriendBackgroundTokenImage2} resizeMode="contain" />
            <TextWrapper>
              <Text alignCenter size={SIZE.LARGE} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
                {popUpStrings.getText}
              </Text>

              <DealTokenView>
                <DealTokens fontFamily={FONT_FAMILY.BOLD_ITALIC} size={SIZE.XLARGE} color={color.gold} alignCenter>
                  {popUpStrings.HeadingOnePiggyBankAddToken(formatTokensLabel(data?.newValue))}
                </DealTokens>
              </DealTokenView>
              <LineOneContainer>
                <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
                  {popUpStrings.forOnly}
                </Text>
                <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
                  {data?.localizedPrice}
                </Text>
              </LineOneContainer>
              <LineTwoContainer>
                <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
                  {popUpStrings.thatsExtraText}
                </Text>
                <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
                  {data?.value}
                </Text>
              </LineTwoContainer>
              <LineTwoContainer>
                <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.Bold} color={color.white}>
                  {popUpStrings.dealOfTheDayFreeText}
                </Text>
                <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
                  {popUpStrings.dealOfTheDayTokenText}
                </Text>
              </LineTwoContainer>
            </TextWrapper>

            <DealOfDayButton label={data?.localizedPrice} onPress={() => checkLoggedIn()} />
          </BackdropTextWrapper>
          {/* </ContainerBorder> */}

          <TextButtonContainer>
            <TextButtonWrapper
              testID="text-button"
              label={popUpStrings.noThankLowerCase}
              isUnderlined={false}
              onPress={() => cancelDealOfTheDay()}
            />
          </TextButtonContainer>
          <BottomTokenView>
            <BottomTokenLeft source={DownTokenRight} resizeMode="contain" />
            <BottomTokenRight source={downToken} resizeMode="contain" />
          </BottomTokenView>
        </Background>
      </StyledModal>
    </SafeAreaView>
  );
};

const DealOfDayButton = ({ onPress, label }) => {
  return (
    <ButtonWrapper theme={BUTTON_COLOR_SCHEME.WHITE} height={60} width={201} onPress={onPress} marginTop={10}>
      <ButtonContentContainer>
        <ButtonText color={color.bluishColor} size={SIZE.XLARGE}>
          {`${popUpStrings.Buy} ${label}`}
        </ButtonText>
      </ButtonContentContainer>
    </ButtonWrapper>
  );
};

DealOfDayButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

DealOfTheDayPopUp.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  data: PropTypes.node.isRequired,
  isUserLoggedIn: PropTypes.bool.isRequired,
  createYourAccount: PropTypes.func.isRequired,
  setDealOfTheDayVisible: PropTypes.func.isRequired
};

export default DealOfTheDayPopUp;
