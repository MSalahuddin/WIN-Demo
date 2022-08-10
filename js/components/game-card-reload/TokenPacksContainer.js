import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { KeyboardAwareFlatList, KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import branch from 'react-native-branch';
import * as RNIap from 'react-native-iap';
import TokenCard from './TokenCard';
import PromoCodeBox from './PromoCodeBox';
import PaymentMethodCard from './PaymentMethodCard';
import api from '../../api';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import LoadingSpinner from '../common/LoadingSpinner';
import { PopupContext } from '../../context/Popup.context';
import { scale, scaleHeight } from '../../platformUtils';
import { APP_STATE, ANALYTICS_EVENTS } from '../../constants';
import { gameCardReloadStrings } from '../../stringConstants';
import { color } from '../../styles';
import { UserContext } from '../../context/User.context';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';
import { logEvent } from '../../amplitudeUtils';

const Container = styled.View`
  height: 100%;
  width: 100%;
`;

const PromoCodeContainer = styled.View`
  margin-top: ${scaleHeight(20)};
  margin-bottom: ${scaleHeight(20)};
`;

const PromoCodeMessage = styled(Text)`
  color: ${color.white};
  margin-top: ${scale(18)};
  text-align: center;
`;

export const styles = StyleSheet.create({
  scrollViewContainerStyle: {
    paddingBottom: scaleHeight(16)
  }
});

const TokenPacksContainer = ({ isUserLoggedIn, navigation }) => {
  const [tokenPackData, setTokenPackData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { displayRequestError } = useContext(PopupContext);
  const { currentAppliedPromoCode, setCurrentAppliedPromoCode, shouldRefreshTokenPack, fetchPoints } = useContext(UserContext);
  const { appState } = useContext(BackgroundMusicContext);

  let isDisabled = false;


  const fetchAppStoreTokens = async tokenPacks => {
    const tokenIds = Platform.OS === 'android' ?
      tokenPacks.map(({ androidProductId }) => {
        if (androidProductId === "")
          return null
        return androidProductId
      }).filter(Boolean) :
      tokenPacks.map(({ iOSProductId }) => iOSProductId);
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
          return iapData ? { ...token, iapData } : {};
        })
        .filter(pack => pack.iapData);
      setTokenPackData(tokenPacksWithIapData);
    } catch (error) {
      displayRequestError(error.message);
    }
  };

  const fetchTokenPacks = async code => {
    setIsLoading(true);
    try {
      const res = await api.getTokenPacks(code, Platform.OS === 'android');
      if (res.status === 200 && res.data) {
        await fetchAppStoreTokens(res.data);
      }
    } catch (error) {
      displayRequestError(error.message);
    }
    setIsLoading(false);
  };

 

  useEffect(() => {
    // Check if deep link has promoCode meta data
    // checkBranchParams();
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

  useEffect(() => {
    fetchTokenPacks(currentAppliedPromoCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAppliedPromoCode]);

  // useEffect(() => {
  //   // Check branch params if app state became active from deep link
  //   if (appState === APP_STATE.ACTIVE) {
  //     // checkBranchParams();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [appState]);

  const requestPurchase = async productId => {
    try {
      await RNIap.initConnection()
      await RNIap.requestPurchase(productId, false);
      isDisabled = false;
    } catch (error) {
      isDisabled = false;
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

  const handleIapPurchase = (productId) => {
    if(isDisabled) return;
      isDisabled = true;
      onTokenPurchasePress(productId)
  }

  /* eslint-disable react/prop-types */
  const renderTokenCard = ({
    imageUrl,
    name,
    tokenAmount,
    isOnSale,
    bonusTokenAmount,
    ribbonColor,
    ribbonName,
    backgroundColor,
    iapData,
    iOSProductId,
    androidProductId
  }) => (
    <TokenCard
      imageUrl={imageUrl}
      name={name}
      isOnSale={isOnSale}
      tokenAmount={tokenAmount}
      bonusTokenAmount={bonusTokenAmount}
      ribbonColor={ribbonColor}
      ribbonName={ribbonName}
      backgroundColor={backgroundColor}
      iapData={iapData}
      onPress={() => handleIapPurchase(Platform.OS === "android" ? androidProductId : iOSProductId)}
    />
  );
  /* eslint-enable react/prop-types */

 


  return (
    <Container>
      <KeyboardAwareScrollView
        extraScrollHeight={30}
      >
        <KeyboardAwareFlatList
          contentContainerStyle={styles.scrollViewContainerStyle}
          data={tokenPackData}
          renderItem={({ item }) => renderTokenCard(item)}
          keyExtractor={item => item.name}
          numColumns={1}
          // columnWrapperStyle={flatListStyles.columnStyle}
          initialNumToRender={4}
        />



      </KeyboardAwareScrollView>

      <LoadingSpinner isLoading={isLoading} />
    </Container>
  );
};

TokenPacksContainer.propTypes = {
  isUserLoggedIn: PropTypes.bool.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,

  }).isRequired
};

export default TokenPacksContainer;
