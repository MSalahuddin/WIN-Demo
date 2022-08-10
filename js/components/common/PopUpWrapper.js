import React, { useState, useContext, useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { NavigationActions, StackActions, NavigationEvents, withNavigation } from 'react-navigation';
import { PopupContext } from '../../context/Popup.context';
import Text, { FONT_FAMILY, SIZE } from './Text';
import InstructionPopUp from './InstructionPopUp';
import {
  arrowInCircle,
  mascotPartyHat,
  chickenTux,
  medalCoin,
  purseCoinsMedal,
  goldBarsPlus,
  iconFailure,
  howtoBackgroundPopUp,
  iconProfile
} from '../../../assets/images';
import StampPopUp from './StampPopUp';
import TextButton from './TextButton';
import { landingStrings, popUpStrings, commonStrings } from '../../stringConstants';
import { SCREENS, URLS } from '../../constants';
import { SOUNDS } from '../../soundUtils';
import { scaleHeight, scale } from '../../platformUtils';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';
import { color } from '../../styles';
import { UserContext } from '../../context/User.context';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import SimpleButton from './SimpleButton';


// const StyledText = styled(Text)`
//   margin-horizontal: ${scaleWidth(10)};
//   margin-vertical: ${scaleHeight(10)};
// `;

const CoinImage = styled.Image`
  height: ${scaleHeight(55)};
  width: ${scaleHeight(55)};
`;
const BackdropTextWrapper = styled.View`
  align-items: flex-start;
  margin-horizontal: ${scale(10)};
  margin-top: ${scaleHeight(5)};
`;

const PopUpContentView = styled.View`
  align-items: center;
  justify-content: center;
`;

const TextWrapper = styled(Text)`
  margin-top: ${({ marginTop }) => (marginTop ? scaleHeight(marginTop) : 0)};
  margin-bottom: ${({ marginBottom }) => (marginBottom ? scaleHeight(marginBottom) : 0)};
`;


const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  margin-top: ${Platform.OS === 'ios' ? scaleHeight(5) : 0};
`;

const ButtonWrapper = styled(SimpleButton)`
`;

const TextButtonWrapper = styled(TextButton)`
  margin-top: ${scaleHeight(20)};
  margin-bottom: ${scaleHeight(10)};
`;


const PopUpWrapper = props => {
  const { navigation, children, onDismiss } = props;

  const [showLoading, setShowLoading] = useState(true)

  const {
    isCreateAccountPopUpShown,
    setIsCreateAccountPopUpShown,
    isBecomeVipPopUpShown,
    setIsBecomeVipPopUpShown,
    showNetworkAlert,
    setShowNetworkAlert,
    isNetworkConnected,
    showForceUpdate,
  } = useContext(PopupContext);
  const { playSoundEffect } = useContext(BackgroundMusicContext);
  const {
    gamesWon,
    isUserLoggedIn,
    fetchIncentiviseValues,
    setIsIncentiviseValues,
    isIncentiviseValues,
    fetchProfileData
  } = useContext(UserContext);

  useEffect(() => {
    if (isCreateAccountPopUpShown || isBecomeVipPopUpShown) {
      playSoundEffect(SOUNDS.POSITIVE_POPUP);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBecomeVipPopUpShown, isCreateAccountPopUpShown]);

  const getIncentiviseValues = async () => {
    if (!isUserLoggedIn && gamesWon === 1) {
      const incentiviseValues = await fetchIncentiviseValues();
      setIsIncentiviseValues(incentiviseValues);
      setShowLoading(false)
    } else {
      setShowLoading(false)
    }
  };

  useEffect(() => {
    const main = async () => {
      await fetchProfileData()
      await getIncentiviseValues()
    }
    if (isCreateAccountPopUpShown) {
      main()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateAccountPopUpShown]);

  const navigationEventsHandler = async () => {
    if (!isNetworkConnected) {
      setShowNetworkAlert(true);
    }
  };

  const navigateToCreateAccount = () => {
    const { dispatch } = navigation;
    setIsCreateAccountPopUpShown(false);
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: SCREENS.LANDING_PAGE })]
    });
    dispatch(resetAction);
  };

  const navigateToTokenStore = () => {
    const { navigate } = navigation;
    setIsBecomeVipPopUpShown(false);
    navigate(SCREENS.GAME_CARD_RELOAD);
  };

  const forceUpdateNow = () => {
    Linking.openURL(Platform.OS === 'android' ? URLS.PLAY_STORE : URLS.APP_STORE)
  }

  return (
    <>
      <NavigationEvents onWillFocus={navigationEventsHandler} />
      {children}
      {/* <InstructionPopUp
        mascot={mascotPartyHat}
        backdropText={popUpStrings.createAccountToHoldYourPrizes}
        buttonText={landingStrings.createAccount}
        bannerLabel={landingStrings.createAccount}
        icon={arrowInCircle}
        isVisible={isIncentiviseValues &&
          !isIncentiviseValues.incentiviseCheck &&
          isCreateAccountPopUpShown &&
          !showLoading}
        secondaryButtonOnPress={() => setIsCreateAccountPopUpShown(false)}
        onPress={() => {
          navigateToCreateAccount();
          onDismiss();
        }}
      /> */}
      <StampPopUp
        isVisible={isIncentiviseValues &&
          !isIncentiviseValues.incentiviseCheck &&
          isCreateAccountPopUpShown &&
          !showLoading}
        backgroundImage={howtoBackgroundPopUp}
        stampIcon={iconProfile}
      >
        <PopUpContentView>
        <TextWrapper
          fontFamily={FONT_FAMILY.BOLD}
          size={SIZE.XXLARGE}
          color={color.white}
        >
          {popUpStrings.createAccount}
        </TextWrapper>
        <TextWrapper
          marginTop={20}
          fontFamily={FONT_FAMILY.MEDIUM}
          size={SIZE.SMALL}
          color={color.white}
          alignCenter
          
        >
          {popUpStrings.createAccountToHoldYourPrizes}
        </TextWrapper>
        <ButtonWrapper
          testID="popup-button"
          borderRadius={44}
          marginTop={25}
          height={53}
          width={200}
          onPress={() => {
            navigateToCreateAccount();
            onDismiss();
          }}
          >
            <ButtonContentContainer>
                <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.darkNavyBlue} size={SIZE.LARGE}>
                   {landingStrings.createAccount}
                </ButtonText>
            </ButtonContentContainer>
          </ButtonWrapper>
          <TextButtonWrapper 
            color={color.white} 
            isUnderlined={false}
            label={popUpStrings.cancel} 
            onPress={() => setIsCreateAccountPopUpShown(false)}
            />
        </PopUpContentView>
      </StampPopUp>
      <InstructionPopUp
        mascot={mascotPartyHat}
        buttonText={landingStrings.createAccount}
        bannerLabel={popUpStrings.newAccountBonus}
        icon={purseCoinsMedal}
        isVisible={isIncentiviseValues &&
          isIncentiviseValues.incentiviseCheck &&
          isCreateAccountPopUpShown &&
          !showLoading}
        secondaryButtonOnPress={() => setIsCreateAccountPopUpShown(false)}
        onPress={() => {
          navigateToCreateAccount();
          onDismiss();
        }}
      >
        <CoinImage source={goldBarsPlus} />
        <BackdropTextWrapper>
          <Text alignCenter size={SIZE.LARGE} fontFamily={FONT_FAMILY.SEMI_BOLD} color={color.black}>
            {popUpStrings.newAccountBonusMessage}
          </Text>
        </BackdropTextWrapper>
        <BackdropTextWrapper>
          <Text alignCenter size={SIZE.XLARGE} fontFamily={FONT_FAMILY.SEMI_BOLD} color={color.warningRed}
          >{popUpStrings.newAccountTokenBonusMessage(isIncentiviseValues && 
          isIncentiviseValues.incentiveTokensQuantity)}</Text>
        </BackdropTextWrapper>
      </InstructionPopUp>
      <InstructionPopUp
        isVisible={isBecomeVipPopUpShown}
        mascot={chickenTux}
        backdropText={popUpStrings.buyTokensMessage}
        buttonText={popUpStrings.buyTokens}
        bannerLabel={popUpStrings.becomeVip}
        icon={medalCoin}
        secondaryButtonOnPress={() => {
          setIsBecomeVipPopUpShown(false);
        }}
        onPress={() => {
          navigateToTokenStore();
          onDismiss();
        }}
      />
      {/* <InstructionPopUp
        isVisible={showNetworkAlert}
        onPress={() => {
          setShowNetworkAlert(false);
        }}
        mascot={sadChicken}
        icon={medalError}
        bannerLabel={popUpStrings.networkError}
        buttonText={commonStrings.close}
      >
        <StyledText size={SIZE.XSMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.grayBlack} alignCenter>
          {popUpStrings.networkErrorBody}
        </StyledText>
      </InstructionPopUp> */}
      <StampPopUp
        isVisible={showNetworkAlert}
        backgroundImage={howtoBackgroundPopUp}
        stampIcon={iconFailure}
      >
        <PopUpContentView>
        <TextWrapper
          fontFamily={FONT_FAMILY.BOLD}
          size={SIZE.XXLARGE}
          color={color.white}
        >
          {popUpStrings.networkError}
        </TextWrapper>
        <TextWrapper
          marginTop={20}
          marginBottom={20}
          fontFamily={FONT_FAMILY.MEDIUM}
          size={SIZE.SMALL}
          color={color.white}
          alignCenter
          
        >
          {popUpStrings.networkErrorTextOne}
        </TextWrapper>
        <TextWrapper
          fontFamily={FONT_FAMILY.LIGHT}
          size={SIZE.SMALL}
          color={color.white}
          alignCenter
        >
          {popUpStrings.networkErrorTextTwo}
        </TextWrapper>
        <ButtonWrapper
          testID="popup-button"
          borderRadius={44}
          marginTop={25}
          height={53}
          width={200}
          onPress={() => {
            setShowNetworkAlert(false);
          }}
          >
            <ButtonContentContainer>
                <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.darkNavyBlue} size={SIZE.LARGE}>
                   {popUpStrings.close}
                </ButtonText>
            </ButtonContentContainer>
          </ButtonWrapper>
          <TextButtonWrapper 
            color={color.white} 
            isUnderlined
            label={popUpStrings.contactSupport} 
            onPress={() => {
              Linking.openURL(URLS.HELP);
            }}
            />
        </PopUpContentView>
      </StampPopUp>

      <StampPopUp
        isVisible={showForceUpdate}
        backgroundImage={howtoBackgroundPopUp}
        stampIcon={iconFailure}
      >
        <PopUpContentView>
          <TextWrapper
            fontFamily={FONT_FAMILY.BOLD}
            size={SIZE.XXLARGE}
            color={color.white}
          >
            {popUpStrings.forceUpdate}
          </TextWrapper>
          <TextWrapper
            marginTop={20}
            fontFamily={FONT_FAMILY.LIGHT}
            size={SIZE.SMALL}
            color={color.white}
            alignCenter
          >
            {popUpStrings.forceUpdateBody}
          </TextWrapper>
          <ButtonWrapper
            testID="popup-button"
            borderRadius={44}
            marginTop={25}
            height={53}
            width={150}
            onPress={forceUpdateNow}
          >
            <ButtonContentContainer>
              <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.darkNavyBlue} size={SIZE.SMALL}>
                {popUpStrings.forceUpdateBtn}
              </ButtonText>
            </ButtonContentContainer>
          </ButtonWrapper>
          {/* <TextButtonWrapper 
            color={color.white} 
            isUnderlined
            label={popUpStrings.contactSupport} 
            onPress={() => {
              Linking.openURL(URLS.HELP);
            }}
          /> */}
        </PopUpContentView>
      </StampPopUp>
    </>
  );
};

PopUpWrapper.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      routeName: PropTypes.string.isRequired
    })
  }),
  children: PropTypes.node,
  onDismiss: PropTypes.func
};

PopUpWrapper.defaultProps = {
  navigation: null,
  children: null,
  onDismiss: () => { }
};

export default withNavigation(PopUpWrapper);
