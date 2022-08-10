import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { hasNotch } from 'react-native-device-info';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
// import Carousel from 'react-native-snap-carousel';
import * as RNIap from 'react-native-iap';
import { Alert, Platform, StyleSheet, Image } from 'react-native';
import SubscriptionCard from './SubscriptionCard';
// import Dot from '../common/Dot';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import TextButton from '../common/TextButton';
import { UserContext } from '../../context/User.context';
import { scale, scaleHeight, scaleWidth, getWindowWidth } from '../../platformUtils';
import { color } from '../../styles';
import { gameCardReloadStrings } from '../../stringConstants';
import { SCREENS } from '../../constants';
import api from '../../api';
import LoadingSpinner from '../common/LoadingSpinner';
import { PopupContext } from '../../context/Popup.context';
import {
  coin,
  star,
  SubscriptionUperBannerBackground,
  SubscriptionLowerBannerBackground
} from '../../../assets/images';
import SubscriptionPackModal from './SubscriptionDetailModal';

export const styles = StyleSheet.create({
  scrollViewContainerStyle: {
    paddingBottom: scaleHeight(16)
  },
  subscriptionContainerStyles: {
    marginTop: 10,
    alignSelf: 'center'
  }
});

const cardWidth = (getWindowWidth() - scale(20));

const Container = styled.ScrollView`
  margin-top: ${hasNotch() ? scaleHeight(32) : scaleHeight(24)};
`;

const StyledTextView = styled.View`
  position: absolute;
  width: ${cardWidth};
  top: ${Platform.OS === 'android' ? scale(15) : scale(15)};
  left:${scale(20)};
  transform: scale(.8)
`;
const LowerTextView = styled.View`
  position: absolute;
  width: ${cardWidth};
  bottom: ${scale(50)};
  left:${scale(10)};
  transform: scale(.8)
`;

const BoxPaddingView = styled.View`
  padding-bottom: ${scaleHeight(24)};
`;

const IconTextRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: ${scaleHeight(10)};
`;

// const RestorePurchasesButton = styled(TextButton)`
//   flex-direction: row;
//   justify-content: center;
//   margin-top: ${scaleHeight(10)};
//   margin-bottom: ${scaleHeight(24)};
// `;

const StyledImage = styled.Image`
  width: ${scale(18)};
  height: ${scale(18)};
  margin-right: ${scale(5)};
  margin-top:${scale(8)};
`;

const TextContainer = styled.View`
  flex: 1;
  margin-top:${scale(8)};
`;
const StyleImage = styled.Image`
  margin-top: 10;
  align-self: center;
  margin-top:${scale(8)};
`;

const SubscriptionContainer = ({ isUserLoggedIn, navigation }) => {
  const navigate = navigation?.navigate;
  const [subscriptionIds, setSubscriptionIds] = useState([]);
  const { setIsCreateAccountPopUpShown, displayRequestError } = useContext(PopupContext);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [subscriptionDetailData, setsubscriptionDetailData] = useState(true);
  const [isSubscriptionDetailModalVisible, setIsSubscriptionDetailModalVisible] = useState(false);
  const { validateIAPReceipt } = useContext(UserContext);
  const [isRestoreDisabled, setIsRestoreDisabled] = useState(false);
  const [imageWidth, setImageWidth] = useState(0);


  useEffect(() => {
    const fetchAppStoreSubscriptions = async subscriptionPacks => {
      const productIds = Platform.OS === 'android' ?
        subscriptionPacks.map(({ androidProductId }) => {
          if (androidProductId === "")
            return null
          return androidProductId
        }).filter(Boolean)
        :
        subscriptionPacks.map(({ iOSProductId }) => iOSProductId);
      setSubscriptionIds(productIds);
      RNIap.getSubscriptions(productIds)
        .then(result => {
          const subscriptionPacksWithIapData = Platform.OS === 'android' ?
            subscriptionPacks
              .map(subscription => {
                const iapData = subscription.androidProductId ?
                  result.find(({ productId }) => productId === subscription.androidProductId) : null;
                return iapData ? { ...subscription, iapData } : {};
              })
              .filter(pack => pack.iapData)
            :
            subscriptionPacks
              .map(subscription => {
                const iapData = result.find(({ productId }) => {
                  if (Platform.OS === 'android') {
                    return productId === subscription.androidProductId
                  }
                  return productId === subscription.iOSProductId
                })
                return iapData ? { ...subscription, iapData } : {};
              })
              .filter(pack => pack.iapData);
          setData(subscriptionPacksWithIapData);
        })
        .catch(error => displayRequestError(error.message));
    };


    const fetchSubscriptionPacks = async () => {
      setIsLoading(true);
      try {
        const res = await api.getSubscriptionPacks();
        if (res.status === 200 && res.data) {
          // Filter out unavailable token packs
          const availableSubscriptions = res.data.filter(pack => pack.isAvailable);
          fetchAppStoreSubscriptions(availableSubscriptions);
        }
      } catch (error) {
        displayRequestError(error.message);
      }
      setIsLoading(false);
    };

    fetchSubscriptionPacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const requestSubscription = async subscriptionData => {
    const { iOSProductId } = subscriptionData;
    try {
      await RNIap.requestSubscription(iOSProductId, false);
    } catch (error) {
      // Error handled in purchase listener
    }
  };
  const navigateToTokenStore = () => {
    setIsSubscriptionDetailModalVisible(false);
    navigate(SCREENS.GAME_CARD_RELOAD);
  };



  const onSubscriptionPurchasePress = subscriptionData => {
    // if (!isUserLoggedIn) {
    //   setIsCreateAccountPopUpShown(true);
    // } else {
    requestSubscription(subscriptionData);
    // }
  };

  const getLastPurchase = purchases => {
    if (purchases.length) {
      const [latestPurchase] = purchases.sort(
        (purchase1, purchase2) => purchase2.transactionDate - purchase1.transactionDate
      );
      return latestPurchase;
    }
    return null;
  };

  const restorePurchases = async () => {
    setIsRestoreDisabled(true);
    if (!isUserLoggedIn) {
      setIsCreateAccountPopUpShown(true);
    } else {
      try {
        const availablePurchases = await RNIap.getAvailablePurchases();
        const lastPurchase = getLastPurchase(availablePurchases);

        if (lastPurchase && subscriptionIds.includes(lastPurchase.productId)) {
          // Send the latest subscription receipt to the BE in case they missed it for some reason
          validateIAPReceipt(lastPurchase);
        }
        Alert.alert(gameCardReloadStrings.restoreSuccessful, gameCardReloadStrings.restoreSuccessfulMessage);
      } catch (error) {
        displayRequestError(error.message);
      }
    }
    setIsRestoreDisabled(false);
  };



  /* eslint-disable react/prop-types */
  const renderItem = ({ item, index }) => {

    const {
      cardType,
      name,
      isOnSale,
      monthlyTokenAmount,
      oneTimeTokenAmount,
      subscriptionPrice,
      imageUrl,
      iapData,
      saleOneTimeTokenAmount,
      ribbonColor,
      ribbonName,
      type,
      saleMonthlyTokenAmount,
      totalTokens,
      bonusTotalTokens,
      isDigitalGameAdFreePurchase
    } = item;

    return (
      <SubscriptionCard
        isOnSale={isOnSale}
        onPress={() => onSubscriptionPurchasePress(item)}
        name={name}
        monthlyTokenAmount={monthlyTokenAmount}
        oneTimeTokenAmount={oneTimeTokenAmount}
        saleOneTimeTokenAmount={saleOneTimeTokenAmount}
        cardType={cardType}
        subscriptionPrice={subscriptionPrice}
        imageUrl={imageUrl}
        iapData={iapData}
        isDigitalGameAdFreePurchase={isDigitalGameAdFreePurchase}
        ribbonColor={ribbonColor}
        ribbonName={ribbonName}
        type={type}
        saleMonthlyTokenAmount={saleMonthlyTokenAmount}
        totalTokens={totalTokens}
        bonusTotalTokens={bonusTotalTokens}
        onLayout={(event)=>{
          const { width } = event.nativeEvent.layout 
          if(index === 0){
            setImageWidth(width)
          }
        }}
      />
    );
  };
  /* eslint-enable react/prop-types */

  const sectionTitles = [
    { icon: coin, title: gameCardReloadStrings.monthlyDiscount },
    { icon: star, title: gameCardReloadStrings.vipStatus },
    { icon: coin, title: gameCardReloadStrings.subscriptionBonus(5) }
  ];

  const renderSectionTitle = () =>
    sectionTitles.map(({ icon, title }) => (
      <IconTextRow key={title} >
        <StyledImage source={icon} resizeMode="contain" />
        <TextContainer>
          <Text size={SIZE.XSMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.white} >
            {title}
          </Text>
        </TextContainer>
      </IconTextRow >
    ));
    

  return (
    <Container>
      {data && <BoxPaddingView>
        <Image 
          style={[styles.subscriptionContainerStyles, { width: imageWidth }]} 
          source={SubscriptionUperBannerBackground}
          resizeMode='stretch'
          />
        <StyledTextView>
          <Text size={SIZE.NORMAL} fontFamily={FONT_FAMILY.SEMI_BOLD} color={color.white} alignCenter
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ marginRight: 20, marginTop: 5 }}
          >
            {gameCardReloadStrings.subscriptionIncludes}
          </Text>
          {renderSectionTitle()}
        </StyledTextView>
        {data && (
          <>
            <KeyboardAwareFlatList
              contentContainerStyle={styles.scrollViewContainerStyle}
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item?.name}
              numColumns={1}
              // columnWrapperStyle={flatListStyles.columnStyle}
              initialNumToRender={4}
              col
            />
          </>
        )}

        {/* particular piece of code is being committed for time been because it cause issue on amplitude analytics will provide better replacement */}
        {/* <RestorePurchasesButton
          disabled={isRestoreDisabled}
          size={SIZE.XSMALL}
          color={color.white}
          onPress={restorePurchases}
          label={gameCardReloadStrings.restorePurchases}
          isUnderlined
          alignCenter
        /> */}
        <Image 
          style={[styles.subscriptionContainerStyles, { width: imageWidth }]} 
          source={SubscriptionLowerBannerBackground}
          resizeMode='stretch'
          />
        <LowerTextView>
          <Text size={SIZE.XSMALL} fontFamily={FONT_FAMILY.REGULAR}
            color={color.white}
          >
            {gameCardReloadStrings.subscriptionTerms}
          </Text>
        </LowerTextView>
      </BoxPaddingView>}
      <LoadingSpinner isLoading={isLoading} />
      <SubscriptionPackModal
        isVisible={isSubscriptionDetailModalVisible}
        setVisible={setIsSubscriptionDetailModalVisible}
        modalData={subscriptionDetailData}
        // onPress={() => gameCardButtonOnPress(prizeModalData, prizeModalData && prizeModalData.isDisabled)}
        navigateToTokenStore={navigateToTokenStore}
      />
    </Container>
  );
};

SubscriptionContainer.propTypes = {
  isUserLoggedIn: PropTypes.bool.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};

export default SubscriptionContainer;
