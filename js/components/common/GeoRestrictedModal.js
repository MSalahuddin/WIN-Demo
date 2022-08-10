import React, { useContext, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import StampPopUp from './StampPopUp';
import TextButton from './TextButton'
import Text, { SIZE, FONT_FAMILY } from './Text';
import { UserContext } from '../../context/User.context';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';
import { iconFailure, howtoBackgroundPopUp } from '../../../assets/images';
import { popUpStrings } from '../../stringConstants';
import { SOUNDS } from '../../soundUtils';
import { URLS, ERROR_STATUS_CODE } from '../../constants';
import { scaleHeight } from '../../platformUtils';
import { color } from '../../styles';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import SimpleButton from './SimpleButton';

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
  margin-top: ${scaleHeight(10)};
  margin-bottom: ${scaleHeight(10)};
`;

const GeoRestrictedModal = ({ children }) => {
  const { geoRestrictedStatusCode } = useContext(UserContext);
  const { playSoundEffect } = useContext(BackgroundMusicContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (
      geoRestrictedStatusCode === ERROR_STATUS_CODE.USER_LOCATION_RESTRICTED ||
      geoRestrictedStatusCode === ERROR_STATUS_CODE.USER_LOCATION_UNDETERMINED
    ) {
      setIsVisible(true);
      playSoundEffect(SOUNDS.POSITIVE_POPUP);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoRestrictedStatusCode]);

  let popupBody = popUpStrings.regionNotSupported;
  let popupBannerTitle = popUpStrings.unsupportedRegion;

  if (geoRestrictedStatusCode === ERROR_STATUS_CODE.USER_LOCATION_UNDETERMINED) {
    popupBody = popUpStrings.locationCannotIdentified;
    popupBannerTitle = popUpStrings.locationError;
  }

  const renderPopupContent = () => {
    return (
      <PopUpContentView>
        <TextWrapper
          fontFamily={FONT_FAMILY.BOLD}
          size={SIZE.XXLARGE}
          color={color.white}
          alignCenter
        >
          {popupBannerTitle}
        </TextWrapper>
        <TextWrapper
          marginTop={20}
          marginBottom={20}
          fontFamily={FONT_FAMILY.MEDIUM}
          size={SIZE.SMALL}
          color={color.white}
          alignCenter
          
        >
          {popupBody}
        </TextWrapper>
        <TextWrapper
          fontFamily={FONT_FAMILY.LIGHT}
          size={SIZE.SMALL}
          color={color.white}
          alignCenter
        >
          {popUpStrings.pleaseContactSupportForDetails}
        </TextWrapper>
        <ButtonWrapper
          testID="popup-button"
          borderRadius={44}
          marginTop={25}
          height={53}
          width={200}
          onPress={() => {
            Linking.openURL(URLS.HELP);
          }}
          >
            <ButtonContentContainer>
                <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.darkNavyBlue} size={SIZE.LARGE}>
                   {popUpStrings.contactSupport}
                </ButtonText>
            </ButtonContentContainer>
          </ButtonWrapper>
      </PopUpContentView>
    );
  };

  return (
    <>
      {children}
      {/* <InstructionPopUp
        isVisible={true}
        mascot={sadChicken}
        bannerLabel={popupBannerTitle}
        buttonText={popUpStrings.contactSupport}
        icon={medalError}
        onPress={() => {
          // we are taking users out of the app
          // and freeze the app if their geo location
          // is not supported
          Linking.openURL(URLS.HELP);
        }}
        testID="geo-restricted-popup"
      >
        {renderPopupContent()}
      </InstructionPopUp> */}
      <StampPopUp
        isVisible={isVisible}
        backgroundImage={howtoBackgroundPopUp}
        stampIcon={iconFailure}
      >
        {renderPopupContent()}
      </StampPopUp>
    </>
  );
};

GeoRestrictedModal.propTypes = {
  children: PropTypes.node
};

GeoRestrictedModal.defaultProps = {
  children: null
};

export default GeoRestrictedModal;
