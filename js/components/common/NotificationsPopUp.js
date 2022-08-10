import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { checkNotifications, openSettings, requestNotifications } from 'react-native-permissions';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Text, { SIZE, FONT_FAMILY } from './Text';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import { scaleHeight } from '../../platformUtils';
import { color } from '../../styles';
import { bannerString } from '../../stringConstants';
import { notificationBell, crossNotification } from '../../../assets/images';



const Backdrop = styled.View`
  flex-direction: row;
  background-color: ${color.iceBlue};
  align-self: center;
  justify-content: center;
  align-items: center;
  width: 90%;
  border-radius: 10;
  margin-top: 10
  padding-vertical: 5
`;

const TextContainer = styled.View`
  align-items: flex-start
  width: 50%;
  border-radius: 5;
`;

const ButtonContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 25%;
`;

const Image = styled.Image`
  width: 70;
  height: 70;
  margin-bottom: 10
`;

const ImageContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 25%;

`;

const ButtonText = styled(Text)`
  margin-bottom: ${Platform.OS === 'android' ? 5 : 0};
`;

 
const ButtonWrapper = styled(Button)`
  margin-vertical: ${scaleHeight(20)};
`;

const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const CancelButtonContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  position: absolute
  top: ${({ top }) => (top + 3)} ;
  left: ${({ left }) => (left - 10)} ;
  z-index: 1;

`;

const CrossImage = styled.Image`
  width: 20;
  height: 20;
`;


const CancelButton = ({ onPress, coordinates }) => {

  if(coordinates){
    return (
      <CancelButtonContainer
      top={coordinates.y}
      left={coordinates.width}
      onPress={onPress}
      >
        <CrossImage source={crossNotification}/>
      </CancelButtonContainer>
    );
  }
  return null
  
};
CancelButton.propTypes = {
  coordinates: PropTypes.shape({
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

const NotificationsPopUp = () => {

  const [visible, setVisible] = useState(false);
  const [coordinates, setCoordinates] = useState(null);


  const isViewPushNotificationPrompt = async () => {
    const permission = await checkNotifications()
    if (permission.status === 'denied' || permission.status === 'blocked') {
      setVisible(true)
    }
  }

  useEffect(()=>{
    isViewPushNotificationPrompt()
  },[])

  const onPress = async() => {
    setVisible(false)
    const permissionNotifications = await checkNotifications()
    if (Platform.OS === 'ios') {
      if (permissionNotifications.status === 'denied') {
        await requestNotifications(['alert', 'sound', 'badge'])
      }
    }
    if (permissionNotifications.status === 'blocked') {
        await openSettings()
    }
  }

  const onCross = async () => {
    setVisible(false)
  }
    if(visible){
      return (
      <>
        <Backdrop
        onLayout={event => {
          setCoordinates(event.nativeEvent.layout)
        }} 
        >
            <ImageContainer>
              <Image source={notificationBell}/>
            </ImageContainer>
            <TextContainer>
              <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
                {bannerString.turnOnNotifications}
              </Text>
              <Text alignCenter size={SIZE.XXSMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.white}>
                {bannerString.notificationBannerLineOne}
              </Text>
              <Text alignCenter size={SIZE.XXSMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.white}>
                {bannerString.notificationBannerLineTwo}
              </Text>
            </TextContainer>
            <ButtonContainer>
            <ButtonWrapper
              borderRadius={44}
              height={35}
              width={70}
              theme={BUTTON_COLOR_SCHEME.GREEN}
              onPress={onPress}
            >
              <ButtonContentContainer>
                <ButtonText color={color.white} size={SIZE.XSMALL}>
                {bannerString.enable}
                </ButtonText>
              </ButtonContentContainer>
            </ButtonWrapper>
            </ButtonContainer>
        </Backdrop>
        <CancelButton coordinates={coordinates} onPress={onCross} />  
        </>
    );
    }
    
      return null
    
  
  
};



export default NotificationsPopUp;
