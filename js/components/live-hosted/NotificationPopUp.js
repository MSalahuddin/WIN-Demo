/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { ExitCircle, howtoBackgroundPopUp, notification_icon } from '../../../assets/images';
import PropTypes from 'prop-types';
import IconButton from '../common/IconButton';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import { scale, scaleHeight, scaleWidth, heightRatio } from '../../platformUtils';
import { popUpStrings } from '../../stringConstants';
import { color } from '../../styles';
import StampPopUp from '../common/StampPopUp';

const Header =
Platform.OS === 'android'
? styled.View`
flex-direction: row;
width: 100%;
justify-content: flex-end;
position: absolute;
top: ${scaleHeight(-40)};
right: ${scaleWidth(-10)};
align-self: flex-end;
z-index: 1;
`
: styled.View`
flex-direction: row;
padding-horizontal: ${scale(24)};
position: absolute;
top:${scale(heightRatio > -1 ? -40: 0)}
right:${scale(heightRatio > -1 ? -35: 0)}
width: 100%;
justify-content: flex-end;
z-index: 1;
`;
const TextWrapper = styled(Text)``;
const TextTitleContainer = styled.View`
align-items: center;
justify-content: center;
padding-top: ${scaleHeight(5)};
padding-bottom: ${heightRatio < 1 ? scaleHeight(0) : scaleHeight(5)};
padding-horizontal: ${scaleWidth(10)};
`;
const ButtonWrapper = styled.View`
background-color: ${color.white};
border-radius: ${scale(50)};
height: ${scaleHeight(40)}
width: ${scaleWidth(180)}
margin-Vertical: ${scaleHeight(10)};
align-items: center;
justify-content: center;
`;
const RandomText = styled(Text)`
text-decoration: underline;
margin-bottom: ${scaleHeight(20)};
`;
const ButtonText = styled(Text)``;

const NotificationPopUp = ({ isVisible, onDissmiss }) => {
  const renderNotificationTitle = () => {
    return (
      <TextTitleContainer>
        <Text alignCenter size={SIZE.XXLARGE} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
          {popUpStrings.notificationLine1}
        </Text>
        <Text alignCenter size={SIZE.XXLARGE} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
          {popUpStrings.notificationLine2}
        </Text>
      </TextTitleContainer>
    );
  };

  const renderNotificationText = () => {
    return (
      <TextTitleContainer>
        <TextWrapper alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
          {popUpStrings.notificationTextLine1}
        </TextWrapper>
        <TextWrapper alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
          {popUpStrings.notificationTextLine2}
        </TextWrapper>
        <TextWrapper alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
          {popUpStrings.notificationTextLine3}
        </TextWrapper>
      </TextTitleContainer>
    );
  };

  return (
    <StampPopUp stampIcon={notification_icon} isVisible={isVisible} backgroundImage={howtoBackgroundPopUp}>
      <Header>
      <IconButton testID="cancel-button" onPress={onDissmiss} icon={ExitCircle} size={45} />
     </Header>
     {renderNotificationTitle()}
        {renderNotificationText()}

        <ButtonWrapper>
          <ButtonText
            size={SIZE.LARGE}
            color={color.black}
            fontFamily={FONT_FAMILY.BOLD}
            marginTop={Platform.OS === 'ios' ? 10 : 0}
            marginHorizontal={20}
            alignCenter
          >
            {popUpStrings.turnOn}
          </ButtonText>
        </ButtonWrapper>

        <RandomText alignCenter size={SIZE.XSMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
          {popUpStrings.noThankYou}
        </RandomText>
    </StampPopUp>

  );
};

NotificationPopUp.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  footerPress: PropTypes.func.isRequired,
  onDissmiss: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired
};

export default NotificationPopUp;
