import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { SafeAreaView, Platform, FlatList, StyleSheet, View, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import * as RNIap from 'react-native-iap';
import Text, { SIZE, FONT_FAMILY } from './Text';
import api from '../../api';
import QuickTokenCard from './QuickTokenCard';
import { ExitCircle, howtoBackgroundPopUp } from '../../../assets/images';
import { scaleHeight, scale } from '../../platformUtils';
import { color } from '../../styles';
import IconButton from './IconButton';
import { UserContext } from '../../context/User.context';
import { PopupContext } from '../../context/Popup.context';
import { gamePlayStrings } from '../../stringConstants';
import { quickRefill } from '../../../assets/animations';
import { styles } from './styles';

const StyledModal = styled(Modal)`
align-items: center;
background-color: ${color.popupBlack};
justify-content: center;
margin: 0;
`;

const ContentContainer = styled.ImageBackground`
flex-direction: column;
margin-top : ${scaleHeight(50)}
`;

const TopHeadingContainer = styled.View`
flex-direction: column;
align-self:center;
width:95%;
`;

const TextWrapper = styled(Text)`
margin-vertical : ${scale(10)};
`;

const ButtonText = styled(Text)`
justify-content: center;
border-bottom-color: white;
border-bottom-width: 1px;
`;

const ButtonWrapper = styled.TouchableOpacity`
align-items: center;
`;

const ExitCircleBtn = styled(IconButton)`
position:absolute;
top: -40 ;
position: absolute;
z-index: 1;
right:-10;
`;

const TokenListView = styled.View`
height:${scaleHeight(200)}
`;

const QuickTokenRefill = ({

  isVisible,
  onPress,
  onPressClose
}) => {
  const [tokenPackData, setTokenPackData] = useState(null);
  const { shouldRefreshTokenPack, fetchPoints,isUserLoggedIn } = useContext(UserContext);
  const { displayRequestError,setIsCreateAccountPopUpShown } = useContext(PopupContext);
  const [position, setPosition] = useState(0);
  const renderTokenCard = ({
    imageUrl,
    name,
    tokenAmount,
    isOnSale,
    bonusTokenAmount,
    ribbonColor,
    ribbonName,
    iapData,
    iOSProductId,
    androidProductId
  }) => (
    <QuickTokenCard
      imageUrl={imageUrl}
      name={name}
      isOnSale={isOnSale}
      tokenAmount={tokenAmount}
      bonusTokenAmount={bonusTokenAmount}
      ribbonColor={ribbonColor}
      ribbonName={ribbonName}
      iapData={iapData}
      // eslint-disable-next-line no-use-before-define
      onPress={() => onTokenPurchasePress(Platform.OS === "android" ? androidProductId : iOSProductId)}
    />
  );

  const fetchAppStoreTokens = async tokenPacks => {
    const tokenIds = Platform.OS === 'android' ?
      tokenPacks.map(({ androidProductId }) => {
        if (androidProductId === "")
          return null
        return androidProductId
      }).filter(Boolean) :
      tokenPacks.map(({ iOSProductId }) =>  iOSProductId);
    try {
      const result = await RNIap.getProducts(tokenIds);
      const tokenPacksWithIapData = tokenPacks
        .map(token => {
          const iapData = result.find(({ productId }) => {
            if (Platform.OS === 'android') {
              return productId === token.androidProductId
            }
            return productId === token.iOSProductId;
          });
          return (iapData &&  token?.isQuickRefill)?{ ...token, iapData } : {};
        })
        .filter(pack => pack.iapData);
      setTokenPackData(tokenPacksWithIapData);
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
    // Check if deep link has promoCode meta data
    fetchTokenPacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      await RNIap.initConnection()
      await RNIap.requestPurchase(productId, false);
      onPressClose()

    } catch (error) {
      onPressClose()
      // Error handled in purchase listener
    }
  };

  const onTokenPurchasePress = iOSProductId => {
    // if (!isUserLoggedIn) {
    //   setIsCreateAccountPopUpShown(true);
    // } else {
    requestPurchase(iOSProductId);
    // }


  };

  return (
    <SafeAreaView>
      <StyledModal isVisible={isVisible}>
        <View style={styles.mainView}>
          <ImageBackground
            source={howtoBackgroundPopUp}
            style={styles.modalImg}
            resizeMode={'stretch'} >

            <ExitCircleBtn
              testID="exit-circle"
              onPress={onPressClose}
              icon={ExitCircle}
              size={40}
            />

            <View style={styles.refillIcon} >
              <LottieView source={quickRefill} autoPlay loop resizeMode="cover" />
            </View>

            <ContentContainer>
              <TopHeadingContainer>
                <TextWrapper
                  size={SIZE.XXXLARGE}
                  fontFamily={FONT_FAMILY.BOLD}
                  color={color.white}
                  alignCenter
                >
                  {gamePlayStrings.quickRefill}
                </TextWrapper>
                <TextWrapper
                  size={SIZE.XSMALL}
                  fontFamily={FONT_FAMILY.BOLD}
                  color={color.white}
                  alignCenter
                >
                  {gamePlayStrings.RefillString}
                </TextWrapper>
              </TopHeadingContainer>
              <TokenListView>
                <FlatList
                  contentContainerStyle={styles.scrollViewContainerStyle}
                  data={tokenPackData}
                  renderItem={({ item }) => renderTokenCard(item)}
                  keyExtractor={item => item.name}
                  numColumns={1}
                  // columnWrapperStyle={flatListStyles.columnStyle}
                  initialNumToRender={4}
                />
              </TokenListView>

              <ButtonWrapper onPress={onPress} >
                <ButtonText width={350} color={color.white} size={SIZE.XXSMALL}>
                  {gamePlayStrings.headToTokenStore}
                </ButtonText>
              </ButtonWrapper>
            </ContentContainer>
          </ImageBackground>
        </View>
      </StyledModal>
    </SafeAreaView>
  );
};

QuickTokenRefill.defaultProps = {
  onPress: () => { },
  onPressClose: () => { }
};

QuickTokenRefill.propTypes = {
  onPress: () => { },
  onPressClose: () => { },
  isVisible: PropTypes.bool.isRequired
};

export default QuickTokenRefill;
