import React, { useState, useContext, useEffect, useCallback } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { FlatList, Platform } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import LazzyLoadButton from '../common/LazzyLoadButton';
import VaultPrizeCard from './VaultPrizeCard';
import CardPopUp from './CardPopUp';
import NftPopUp from './NftPopUp';
import TransferredNftPopUp from './TransferredNftPopUp';
import InstructionPopUp from '../common/InstructionPopUp';
import Banner, { BANNER_TYPE } from '../common/Banner';
import api from '../../api';
import LoadingSpinner from '../common/LoadingSpinner';
import VaultCardInfo from './VaultCardInfo';
import ConditionRenderer from '../common/ConditionalRenderer';
import PopUpWrapper from '../common/PopUpWrapper';
import { PopupContext } from '../../context/Popup.context';
import { UserContext } from '../../context/User.context';
import { SIZE } from '../common/Text';
import { CenterCircleBackGround, medalCoin } from '../../../assets/images';
import { accountProfileStrings, popUpStrings, prizeVaultStrings } from '../../stringConstants';
import { getWindowWidth, scale, scaleHeight, scaleWidth } from '../../platformUtils';
import { SOUNDS } from '../../soundUtils';
import { flatListStyles, SafeAreaContainer, color } from '../../styles';
import {
  SCREENS,
  PRIZE_STATUS,
  PRIZE_VAULT_ENUM,
  API_CALL_CONSTANTS,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  ANALYTICS_APPSFLYER_EVENTS,
  ANALYTICS_APPSFLYER_EVENTS_PARAMETER,
  NFT_POPUP_TYPE,
  PRIZE_TYPE_CODE,
} from '../../constants';
import { logEvent, setUserProperties } from '../../amplitudeUtils';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';
import Picker from '../common/picker';
// TODO: add filter back in post launch
import BottomPicker from '../common/BottomPicker';
import DropdownButton from '../common/DropdownButton';
import BottomNavigator from '../game-room/BottomBar';
import { AFLogCustomEvent } from "../../appFlyer.utils";

const screenWidth = getWindowWidth();

const Background = styled.ImageBackground`
  flex: 1;
`;

const BannerWrapper = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

// TODO: below styles relate to filter which will be added back
// in later
const OptionsRow = styled.View`
  flex-direction: row;
  min-height: ${scaleHeight(40)};
  margin-bottom: ${scaleHeight(12)};
  margin-top: ${scaleHeight(16)};
`;



const filterWidth = (getWindowWidth() - 3 * scale(12));
const DropdownButtonWrapper = styled(DropdownButton)`
  background-color: ${color.white};
  border-color: ${color.lightBlack};
  border-radius: ${scaleHeight(5)};
  height: ${scaleHeight(35)};
  padding-left: ${scaleWidth(16)};
  padding-right: ${scaleWidth(16)};
  padding-bottom: ${scaleWidth(2)};
  margin-left: ${scale(16)};
  margin-right: ${scale(16)};
  width: ${filterWidth};
`;
const PickerWrapper = styled.View`
  position: absolute;
  bottom: 0;
  width: ${screenWidth};
  height: ${scaleHeight(150)};
  padding-bottom: ${scaleHeight(24)};
  flex-direction: column;
  justify-content: center;
  background-color: ${color.white};
`;



const prizeOptions = [
  { label: prizeVaultStrings.allPrizes, value: PRIZE_VAULT_ENUM.ALL_PRIZES },
  { label: prizeVaultStrings.Available, value: PRIZE_VAULT_ENUM.AVAILABLE },
  { label: prizeVaultStrings.shipped, value: PRIZE_VAULT_ENUM.SHIPPED },
  { label: prizeVaultStrings.swapped, value: PRIZE_VAULT_ENUM.SWAPPED }
];

const PrizeVault = ({ navigation }) => {
  const [popUpContent, setPopUpContent] = useState(null);
  const [isPopUpCardVisible, setIsPopUpCardVisible] = useState(false);
  const [isInfoCardVisible, setIsInfoCardVisible] = useState(false);
  const [isBuyTokenPopUpVisible, setIsBuyTokenPopUpVisible] = useState(false);
  const { playSoundEffect } = useContext(BackgroundMusicContext);
  const { fetchProfileData, isVip, tickets, isUserLoggedIn } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const [isFilter, setIsFilter] = useState(false);
  const [cardPopUpButtonsDisabled, setCardPopUpButtonsDisabled] = useState(false);
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10
  const { navigate } = navigation;
  const { displayRequestError, setIsCreateAccountPopUpShown } = useContext(PopupContext);
  const [lazyLoad, setLazyLoad] = useState(false);
  const [lazyLoadFilter, setLazyLoadFilter] = useState(false);
  const [footerLoader, setfooterLoader] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNftPopup, setShowNftPopup] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletAddressError, setWalletAddressError] = useState('');
  const [nftPopupType, setNftPopupType] = useState(NFT_POPUP_TYPE.CLAIM);
  const [isTransferringNft, setIsTransferringNft] = useState(false);
  const [showTransferredNftPopUp, setShowTransferredNftPopUp] = useState(false);
  const [selectedNftPrize, setSelectedNftPrize] = useState(null);




  const fetchPrizeVaultData = async () => {
    if (!isFilter) {
      try {

        const res = await api.getPrizeVaultDetails(pageNumber, pageSize, prizeOptions[selectedIndex].value);

        if (res.status === 200 && res.data) {


          if (data) {
            // if item is showing less than 10 on screen
            // means there is not other item
            // because page size is 10
            if (res.data.length < 10) {
              if (res.data.length > 0) {
                setData([...data, ...res.data])
              }
              setLazyLoad(false)
              setfooterLoader(false)

            }
            else {
              setData([...data, ...res.data])
              setfooterLoader(false)

            }
          }
          if (!data) {
            setData(res.data);
            setLazyLoad(true)
            // if item is showing less than 10 on screen
            // means there is not other item
            // because page size is 10
            if (res.data.length < 10) {
              setLazyLoad(false)
            }

          }
        }

        else {
          setLazyLoad(false)
        }

      } catch (error) {
        if (!isFilter) {
          displayRequestError(error.message);
        }
      }

      setLoading(false);
    }
  };

  const filterPrizeVaultData = async () => {
    if (isFilter) {
      setLoading(true);
      if (selectedIndex === 0) {
        setIsFilter(false)
        setFilterData(null)
        setPageNumber(1)
        // eslint-disable-next-line no-use-before-define
        // resetScreen()
      }
      else {

        try {

          const res = await api.getPrizeVaultDetails(pageNumber, pageSize, prizeOptions[selectedIndex].value);
          if (res.status === 200 && res.data) {
            if (filterData) {
              // if item is showing less than 10 on screen
              // means there is not other item
              // because page size is 10
              if (res.data.length < 10) {
                if (res.data.length > 0) {
                  setFilterData([...filterData, ...res.data])
                }
                setLazyLoadFilter(false)
                setfooterLoader(false)

              }
              else {
                setFilterData([...filterData, ...res.data])
                setfooterLoader(false)

              }
            }
            if (!filterData) {
              setFilterData(res.data)
              if (res.data.length < 10) {
                setLazyLoadFilter(false)

              }
              else {
                setLazyLoadFilter(true)
              }

            }
          }
          else {
            setLazyLoadFilter(false)
          }
        } catch (error) {
          setLazyLoadFilter(false)
          setFilterData(null)
          // displayRequestError(error.message);
        }

        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchPrizeVaultData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);
  useEffect(() => {
    filterPrizeVaultData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, pageNumber]);

  const trackSwapTickets = () => {
    const { prizeId, prize } = popUpContent;
    const { ticketsValue } = prize;
    logEvent(ANALYTICS_EVENTS.SWAP_FOR_TICKETS_IN_PRIZE_VAULT, {
      [ANALYTICS_PROPERTIES.PRIZE_ID]: prizeId
    });
    setUserProperties({
      [ANALYTICS_PROPERTIES.PLAYER_TICKET_AMOUNT]: ticketsValue + tickets
    });
  };

  const appsFlyerTracking = () => {
    const { prize, prizeId, gameRoundId } = popUpContent;
    const { categoryName, ticketsValue, name: prizeName } = prize;
    AFLogCustomEvent(ANALYTICS_APPSFLYER_EVENTS.PRIZE_VAULT_SWAP, {
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.PRIZE_ID]: prizeId,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.PRIZE_NAME]: prizeName,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.PRIZE_CATEGORY]: categoryName,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.TICKETS_DISPENSED]: ticketsValue,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.GAME.GAME_ROUND_ID]: gameRoundId
    });
  };

  const handlePickerSelection = index => {
    if (index !== 0 && index !== selectedIndex) {
      setPageNumber(1)
    }
    setSelectedIndex(index);
    setPickerVisible(false);
  };

  const resetScreen = async () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: SCREENS.PRIZE_VAULT })],
    });
    await navigation.dispatch(resetAction);
  }

  const swapPrizeForTickets = async () => {

    try {
      const res = await api.postSwapTickets(popUpContent.playerPrizeId, API_CALL_CONSTANTS.PRICE_VAULT);
      if (res.status === 200) {
        trackSwapTickets();
        appsFlyerTracking();
        await fetchProfileData();
        await resetScreen()

      }
    } catch (error) {
      displayRequestError(error.message);
    }
    setCardPopUpButtonsDisabled(false);
    setIsPopUpCardVisible(false);
  };

  const onClaimNowPress = (item) => {
    playSoundEffect(SOUNDS.POSITIVE_POPUP);
    if (!isUserLoggedIn) {
      setIsCreateAccountPopUpShown(true)
    } else if (!isVip) {
      setIsBuyTokenPopUpVisible(true);
    } else {
      setSelectedNftPrize(item)
      setShowNftPopup(true);
      setNftPopupType(NFT_POPUP_TYPE.CLAIM)
    }
  };

  const onPressContinue = () => {
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (ethereumAddressRegex.test(walletAddress)) {
      setNftPopupType(NFT_POPUP_TYPE.CONFIRM)
    } else {
      setWalletAddressError('Invalid Ethereum Address!')
      setTimeout(() => {
        setWalletAddressError('')
      }, 3000);
    }
  }

  const onPressConfirm = async () => {
    const { nft, playerId } = selectedNftPrize;
    setIsTransferringNft(true);
    try {
      const payload = { playerId, toWalletPublicAddress: walletAddress, nfTid: nft?.nftId }
      const response = await api.postTransferNFT(payload);
      if (response.data.success) {
        setShowNftPopup(false);
        setIsTransferringNft(false);
        setWalletAddress('');
        setNftPopupType(NFT_POPUP_TYPE.CLAIM);
        setSelectedNftPrize(null);
        setTimeout(() => {
          setShowTransferredNftPopUp(true);
        }, 100);
      } else {
        setIsTransferringNft(false);
        displayRequestError(response.data.message);
      }
    } catch (error) {
      setIsTransferringNft(false);
      displayRequestError(error.message);
    }
  }

  const onPressCancel = () => {
    setShowNftPopup(false);
    setWalletAddress('');
    setSelectedNftPrize(null);
    setNftPopupType(NFT_POPUP_TYPE.CLAIM);
  }

  const onPressAwesome = async () => {
    setShowTransferredNftPopUp(false);
    try {
      await resetScreen();
    } catch (error) {
      // fail silently
    }
  }

  const shipOnPress = item => {
    playSoundEffect(SOUNDS.POSITIVE_POPUP);
    if (!isVip) {
      setIsBuyTokenPopUpVisible(true);
    } else {
      const content = item;
      content.isForShipping = true;
      setPopUpContent(content);
      setIsPopUpCardVisible(true);
    }
  };

  const redirectToGameReloadCenter = () => {
    setIsBuyTokenPopUpVisible(false);
    navigate(SCREENS.GAME_CARD_RELOAD);
  };

  const onShipNowPress = (item) => {
    if (isUserLoggedIn) {
      shipOnPress(item)
    }
    else {
      setIsCreateAccountPopUpShown(true)
    }
  }
  const onSwappedPress = (item) => {
    // if (isUserLoggedIn) {
    const content = item;
    content.isForShipping = false;
    setPopUpContent(content);
    setIsPopUpCardVisible(true);
    // }
    // else {
    //   setIsCreateAccountPopUpShown(true)
    // }
  }


  const renderPrizeCard = useCallback(({ item, index }) => {
    const { prize, nft, transferredNFT } = item;
    let hideSwapButton = false;

    const getPrizeStatus = () => {
      switch (true) {
        case item.shippedDate !== null:
          return { type: PRIZE_STATUS.SHIPPED, datetime: item.shippedDate };
        case item.packingDate !== null:
          return { type: PRIZE_STATUS.PACKING, datetime: item.packingDate };
        case item.swapDate !== null:
          return { type: PRIZE_STATUS.SWAPPED, datetime: item.swapDate };
        case transferredNFT && transferredNFT?.transferTransactionId !== null:
          return { type: PRIZE_STATUS.CLAIMED, datetime: transferredNFT?.updatedAt };
        default:
          if (item.redeemDate !== null) {
            hideSwapButton = true;
          }
          return { type: PRIZE_STATUS.NEW, datetime: null };
      }
    };

    const { type, datetime } = getPrizeStatus();
    
    return (
      <VaultPrizeCard
        actionDatetime={datetime}
        type={type}
        title={nft?.nftId ? nft?.name : prize && prize.name}
        value={prize && prize.value}
        ticketQty={prize && prize.ticketsValue}
        imageUrl={nft?.nftId ? nft?.imageURL : prize.imageUrl}
        prizeType={nft?.nftId ? PRIZE_TYPE_CODE.NFT : PRIZE_TYPE_CODE.ACTUAL}
        claimOnPress={() => onClaimNowPress(item)}
        shipOnPress={() => onShipNowPress(item)}
        swapOnPress={() => onSwappedPress(item)}
        hideSwapButton={hideSwapButton}
        onInfoPress={() => {
          setPopUpContent(item);
          setIsInfoCardVisible(true);
        }}
      />
    )

  }, []);


  const KeyExtractor = useCallback((item) => `${item.playerPrizeId}`, []);

  const renderHeader = useCallback(() => (
    <BannerWrapper>
      <Banner
        label={accountProfileStrings.myPrizes}
        width={screenWidth - scale(20)}
        bannerType={BANNER_TYPE.BLUE_BANNER}
        textSize={SIZE.BANNER_LARGE}
      />
      {/* TODO: add filter back after launch */}
      <OptionsRow>
        {Platform.OS === 'android' ? <Picker
          selectedValue={
            prizeOptions[selectedIndex]
          }
          width={filterWidth}
          options={prizeOptions}
          onValueChange={(_, index) => {
            setFilterData(null)
            setLazyLoadFilter(false)
            if (index === 0) {
              setIsFilter(false)
            }
            else {
              setIsFilter(true)
            }
            handlePickerSelection(index);
          }}
        /> :
          <DropdownButtonWrapper
            onPress={() => {
              setPickerVisible(true);
            }}
            label={prizeOptions[selectedIndex].label}
          />}

      </OptionsRow>
    </BannerWrapper>
  ), []);


  const footerBottonOnPress = () => {
    setfooterLoader(true)
    setPageNumber(pageNumber + 1)
  }
  const filterLoadMoreOnPress = () => {
    setfooterLoader(true)
    setPageNumber(pageNumber + 1)
  }

  // TODO: add filter back after launch


  // const filteredData = data.filter(prize => {
  //   if (selectedIndex !== 0) {
  //     return prize.actionType === prizeOptions[selectedIndex].value;
  //   }
  //   return prize;
  // });
  return (
    <>
        <Background source={CenterCircleBackGround} resizeMode="stretch">
          <PopUpWrapper>
            <SafeAreaContainer>
              
              <FlatList
                ListHeaderComponent={renderHeader}
                data={isFilter ? filterData : data}
                ListFooterComponent={!isFilter ? lazyLoad &&
                  <LazzyLoadButton
                    onPress={() => footerBottonOnPress()}
                    loading={footerLoader}
                  />
                  : lazyLoadFilter &&
                  <LazzyLoadButton
                    onPress={() => filterLoadMoreOnPress()}
                    loading={footerLoader}
                  />}
                renderItem={renderPrizeCard}
                keyExtractor={KeyExtractor}
                numColumns={2}
                columnWrapperStyle={flatListStyles.columnStyle}
                contentContainerStyle={flatListStyles.containerStyle}
                initialNumToRender={4}
              />
                <InstructionPopUp
                  backdropText={popUpStrings.buyTokensMessage}
                  // TODO: get the lowest token value from BE and redirect to IAP onPress
                  buttonText={popUpStrings.buyTokens}
                  onPress={redirectToGameReloadCenter}
                  bannerLabel={popUpStrings.freeShipping}
                  icon={medalCoin}
                  isVisible={isBuyTokenPopUpVisible}
                  secondaryButtonText={popUpStrings.viewTokenPacks}
                  secondaryButtonOnPress={redirectToGameReloadCenter}
                  textButtonLabel={popUpStrings.dontWantToShip}
                  textButtonOnPress={() => setIsBuyTokenPopUpVisible(false)}
                  testID="instruction-popup"
                />
                <CardPopUp
                  isVisible={isPopUpCardVisible}
                  data={popUpContent}
                  setVisible={setIsPopUpCardVisible}
                  cardPopUpButtonsDisabled={cardPopUpButtonsDisabled}
                  setCardPopUpButtonsDisabled={setCardPopUpButtonsDisabled}
                  onPress={() => {
                    if (popUpContent.isForShipping) {
                      setIsPopUpCardVisible(false);
                      navigate(SCREENS.SHIPPING, { data: popUpContent });
                    } else {
                      setCardPopUpButtonsDisabled(true);
                      swapPrizeForTickets();

                    }
                  }}
                />
                <NftPopUp
                  isVisible={showNftPopup}
                  isLoading={isTransferringNft}
                  value={walletAddress}
                  onChangeText={setWalletAddress}
                  type={nftPopupType}
                  onPressContinue={onPressContinue}
                  onPressConfirm={onPressConfirm}
                  onPressCancel={onPressCancel}
                  walletAddressError={walletAddressError}
                />
                <TransferredNftPopUp
                  isVisible={showTransferredNftPopUp}
                  onPressAwesome={onPressAwesome}
                />
              <VaultCardInfo isVisible={isInfoCardVisible} setVisible={setIsInfoCardVisible} data={popUpContent} />
              <ConditionRenderer enabled={loading || !data}>
                <LoadingSpinner />
              </ConditionRenderer>
              <BottomNavigator navigation={navigation}
                setLoader={() => { setIsLoading(true) }} dismissLoader={() => { setIsLoading(false) }} />


            </SafeAreaContainer>
          </PopUpWrapper>

        </Background>
        {/* TODO: add filter back after launch */}
        {isPickerVisible && (
          <PickerWrapper>
            <BottomPicker
              options={prizeOptions}
              selectedValue={
                prizeOptions[selectedIndex].value
              }
              onValueChange={(_, index) => {
                setFilterData(null)
                setLazyLoadFilter(false)
                if (index === 0) {
                  setIsFilter(false)
                }
                else {
                  setIsFilter(true)
                }
                handlePickerSelection(index);
              }}
            />
          </PickerWrapper>
        )}
    </>
  );
};

PrizeVault.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.bool
  }).isRequired
};

export default PrizeVault;
