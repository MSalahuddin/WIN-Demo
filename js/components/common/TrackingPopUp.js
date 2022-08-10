import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components/native';
import { Platform, SafeAreaView } from 'react-native'
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import Text, { SIZE, FONT_FAMILY } from './Text';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import { scaleHeight, scale, scaleWidth } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings, commonStrings } from '../../stringConstants';
import { trackingIcon } from '../../../assets/images';
import { trackingStatus, trackingPermission, trackable } from '../../trackingUtils'
import { UserContext } from '../../context/User.context';


const StyledModal = styled(Modal)`
  align-items: center;
  background-color: ${color.popupBlack};
  justify-content: center;
  margin: 0;
`;

const BackdropTextWrapper = styled(LinearGradient)`
  align-items: center;
  border-width: 7;
  border-color: ${color.white};
  border-radius: 20;
  justify-content: flex-start;
  padding-bottom:${scaleHeight(30)};
  padding-top:${scaleHeight(80)};
  margin-top: ${scaleHeight(20)};
  padding-horizontal: ${scaleWidth(30)};
  shadow-color: ${color.blackShadow};
  shadow-offset: 4px 4px;
  shadow-opacity: ${1};
  shadow-radius: 2px;
  width: 85%;
  z-index: -1;
`;

const Icon = styled.Image`
  height: 125;
  width: 125;
  top: ${({ top }) => (top - 60)} ;
  position: absolute;
  z-index: 1;
  `;

const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  margin-top: ${scaleHeight(7)};
`;

const ButtonWrapper = styled(Button)`
  margin-top: ${({ marginTop }) => scaleHeight(marginTop)};
`;



const TrackingPopUp = ({ }) => {

  const [status, setStatus] = useState(null);
  const [position, setPosition] = useState(0);
  const { trackingPrompt, setTrackingPrompt} = useContext(UserContext);
  
  const trackingHandler = async () => {
    const status = await trackingStatus();
    if(status === 'not-determined'){
      await setTrackingPrompt(true)
      }
    await trackable()
    setStatus(status)
  }

  useEffect(() => {
    trackingHandler()
  }, [status]);

  const onButtonPress = async () => {
    await trackingPermission()
    await trackingHandler()
  }


  if(Platform.OS === 'ios' && status === 'not-determined'){
    return (
        <>
        <SafeAreaView>
          <StyledModal isVisible={trackingPrompt}>
          <Icon top={position} source={trackingIcon} resizeMode="contain" />
          <BackdropTextWrapper   onLayout={event => {
            const { y } = event.nativeEvent.layout;
            setPosition(y)
          }} colors={[color.midBlue, color.darkBlue]}>
            <Text alignCenter size={SIZE.LARGE} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
              {popUpStrings.lineOneTracking}
            </Text>
            <Text alignCenter size={SIZE.XSMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
              {popUpStrings.lineTwoTracking}
            </Text>
            <ButtonWrapper
              testID="popup-button"
              borderRadius={44}
              marginTop={20}
              height={48}
              width={120}
              theme={BUTTON_COLOR_SCHEME.GREEN}
              onPress={onButtonPress}
            >
              <ButtonContentContainer>
                <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.white} size={SIZE.LARGE}>
                  {commonStrings.next}
                </ButtonText>
              </ButtonContentContainer>
            </ButtonWrapper>
          </BackdropTextWrapper>
          </StyledModal>
        </SafeAreaView>
        </>
        );
  }
  else {
      return null
  }

    
};


export default TrackingPopUp;
