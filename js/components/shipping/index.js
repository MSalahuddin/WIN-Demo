import React, { useState } from 'react';
import { Platform, Linking } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import ShippingForm from './ShippingForm';
import Banner, { BANNER_TYPE } from '../common/Banner';
import PrizeActionStamp from '../common/PrizeActionStamp';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import InstructionPopUp from '../common/InstructionPopUp';
import StampPopUp from '../common/StampPopUp';
import TextButton from '../common/TextButton';
import PopUpWrapper from '../common/PopUpWrapper';
import { ScatteredCircleBackGround, iconFailure, howtoBackgroundPopUp, giftMedal } from '../../../assets/images';
import { scale, getWindowWidth, scaleHeight, scaleWidth } from '../../platformUtils';
import { SafeAreaContainer, color } from '../../styles';
import { shippingStrings, popUpStrings, landingStrings } from '../../stringConstants';
import { SCREENS, URLS, PRIZE_STATUS } from '../../constants';
import BottomNavigator from '../game-room/BottomBar';
import Button, { BUTTON_COLOR_SCHEME } from '../common/Button';
import SimpleButton from '../common/SimpleButton';


const Background = styled.ImageBackground`
  height: 100%;
  width: 100%;
`;

const BannerContainer = styled.View`
  align-items: center;
  margin-bottom: ${scaleHeight(95)};
`;

const BannerBackdrop = styled.View`
  align-items: center;
  bottom: ${-scaleHeight(63)};
  flex-direction: column;
  height: ${scaleHeight(50)};
  justify-content: center;
  padding-top: ${scaleHeight(10)};
  position: absolute;
  width: ${scale(50)}%;
`;

const BannerImage = styled.Image`
  background-color: ${color.darkGrey};
  border-radius: ${scaleWidth(40)};
  margin-left: ${scaleWidth(-10)}
  height: ${scaleWidth(70)};
  width: ${scaleWidth(70)};
`;

const BannerTextWrapper = styled(Text)`
  margin-top: ${scaleHeight(8)};
  width: 60%;
  color: ${color.white}
`;

const ShippingFormWrapper = styled(ShippingForm)`
  margin-top: ${({ marginTop }) => (marginTop ? scaleHeight(marginTop) : 0)};
`;

const PrizeActionStampWrapper = styled.View`
  margin-top: ${scaleHeight(10)};
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
  margin-top: ${scaleHeight(15)};
  margin-bottom: ${scaleHeight(10)};
`;

const TextContainer = styled.TouchableOpacity`
  margin-top:${scaleHeight(20)}
`
const Shipping = ({ navigation }) => {
  const [isNotSupportedStatePopUpAvailable, setIsNotSupportedStatePopUpAvailable] = useState(false);
  const [isShippingSuccessful, setIsShippingSuccessful] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);


  const { navigate } = navigation;
  const { playerPrizeId, prize } = navigation.state.params.data;

  const { name, imageUrl } = prize;

  const navigateToPrizeVault = () => {
    setIsNotSupportedStatePopUpAvailable(false);
    navigate(SCREENS.PRIZE_VAULT);
  };

  const navigateToHelp = () => {
    setIsNotSupportedStatePopUpAvailable(false);
    navigate(SCREENS.APP_WEB_VIEW, { url: URLS.HELP, title: landingStrings.helpAndContact });
  };

  const renderHeader = () => {
    return (
      <BannerContainer>
        <Banner
          label={shippingStrings.shipping}
          width={getWindowWidth() - scale(20)}
          bannerType={BANNER_TYPE.BLUE_BANNER}
          textSize={SIZE.BANNER_LARGE}
        />
        <BannerBackdrop>
          <BannerImage source={{ uri: imageUrl }} />
          <BannerTextWrapper size={SIZE.XSMALL} fontFamily={FONT_FAMILY.SEMI_BOLD} numberOfLines={1} alignCenter>
            {name}
          </BannerTextWrapper>
        </BannerBackdrop>
      </BannerContainer>
    );
  };

  return (
    <Background source={ScatteredCircleBackGround} resizeMode="stretch">
      <PopUpWrapper>
        <SafeAreaContainer>
          {renderHeader()}
          <ShippingFormWrapper
            setIsNotSupportedStatePopUpAvailable={setIsNotSupportedStatePopUpAvailable}
            setIsShippingSuccessful={setIsShippingSuccessful}
            playerPrizeId={playerPrizeId}
            prize={prize}
            pickerVisible={(bool) => { setPickerVisible(bool) }}
          />
          {!pickerVisible && <BottomNavigator navigation={navigation}
            setLoader={() => { }}
            dismissLoader={() => { }}
          />}
        </SafeAreaContainer>

        {/* <InstructionPopUp
          backdropText={popUpStrings.shippingNotAvailableState}
          buttonText={popUpStrings.chooseAnother}
          bannerLabel={popUpStrings.oops}
          isVisible={isNotSupportedStatePopUpAvailable}
          secondaryButtonOnPress={navigateToPrizeVault}
          onPress={() => setIsNotSupportedStatePopUpAvailable(false)}
          textButtonLabel={popUpStrings.contactSupport}
          textButtonOnPress={navigateToHelp}
        /> */}
        <StampPopUp
          isVisible={isNotSupportedStatePopUpAvailable}
          backgroundImage={howtoBackgroundPopUp}
          stampIcon={iconFailure}
        >
          <PopUpContentView>
          <TextWrapper
            fontFamily={FONT_FAMILY.BOLD}
            size={SIZE.XXLARGE}
            color={color.white}
          >
            {popUpStrings.oops}
          </TextWrapper>
          <TextWrapper
            marginTop={10}
            fontFamily={FONT_FAMILY.MEDIUM}
            size={SIZE.SMALL}
            color={color.white}
            alignCenter
            
          >
            {popUpStrings.shippingNotAvailableState}
          </TextWrapper>
          <ButtonWrapper
            testID="popup-button"
            borderRadius={44}
            marginTop={25}
            height={53}
            width={260}
            onPress={() => { setIsNotSupportedStatePopUpAvailable(false) }} 
            >
              <ButtonContentContainer>
                  <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.darkNavyBlue} size={SIZE.LARGE}>
                    {popUpStrings.chooseAnother}
                  </ButtonText>
              </ButtonContentContainer>
          </ButtonWrapper>
          <TextContainer onPress={navigateToPrizeVault}>
              <ButtonText fontFamily={FONT_FAMILY.SEMI_BOLD} isUnderlined={true} color={color.white} size={SIZE.SMALL} >
                {popUpStrings.cancel}
             </ButtonText>
          </TextContainer>
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
        <InstructionPopUp
          backdropText={popUpStrings.getReadyForYourPrize}
          buttonText={popUpStrings.goToGameRoom}
          bannerLabel={popUpStrings.success}
          icon={giftMedal}
          isVisible={isShippingSuccessful}
          secondaryButtonText={popUpStrings.backToMyPrizes}
          secondaryButtonOnPress={() => {
            setIsShippingSuccessful(false);
            navigate(SCREENS.PRIZE_VAULT);
          }}
          onPress={() => {
            setIsShippingSuccessful(false);
            navigate(SCREENS.GAME_ROOM);
          }}
        >
          <PrizeActionStampWrapper>
            <PrizeActionStamp datetime={Date.now()} type={PRIZE_STATUS.SHIPPED} />
          </PrizeActionStampWrapper>
        </InstructionPopUp>

      </PopUpWrapper>

    </Background>
  );
};

Shipping.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        data: PropTypes.shape({
          playerPrizeId: PropTypes.number.isRequired,
          prize: PropTypes.shape({
            imageUrl: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
          }).isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};

export default Shipping;
