/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { ExitCircle, howtoBackgroundPopUp, new_life } from '../../../assets/images';
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
const TokenContainer = styled.View`
background-color: ${color.white};
align-items: center;
justify-content: center;
border-radius: ${scale(50)};
height: ${scaleHeight(40)};
width: ${scaleWidth(110)};
margin-Vertical: ${scaleHeight(10)};
`;
const CountDownTimer = styled.View`
background-color: ${color.darkShadow};
align-items: center;
justify-content: center;
border-radius: ${scale(50)};
height: ${scaleHeight(45)};
width: ${scaleWidth(130)};
margin-top: ${scale(10)};
`;
const TimeText = styled(Text)`
color: ${color.darkRed};
align-self: center;
height: ${scale(Platform.OS === "android" ? 0 : 25)};
`;
const RandomText = styled(Text)`
text-decoration: underline;
`;
const ButtonText = styled(Text)``;

const NewLifePopUp = ({ isVisible, footerPress, onDissmiss, isFree, tokensCost }) => {
  const [stopwatchTime, setStopwatchTime] = useState(10);
  const [min, setMin] = useState(Math.floor(stopwatchTime / 60));
  const [sec, setSec] = useState(stopwatchTime % 60);
  useEffect(() => {
    if (stopwatchTime > 0) {
      setTimeout(() => {
        setStopwatchTime(stopwatchTime - 1);
        if (sec === 0) {
          setSec(59);
        } else {
          setSec(sec - 1);
        }
        setMin(Math.floor(stopwatchTime / 60));
      }, 1000);
    } else {
      setStopwatchTime('! Finish !');
    }
  });

  const renderNewLifeTitle = () => {
    return (
      <TextTitleContainer>
        <Text alignCenter size={SIZE.XXLARGE} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
          {popUpStrings.newLife}
        </Text>
      </TextTitleContainer>
    );
  };

  const renderNewLifeText = () => {
    return (
      <TextTitleContainer>
        <TextWrapper alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
          {popUpStrings.newLifeTextLine1}
        </TextWrapper>
        <TextWrapper alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
          {popUpStrings.newLifeTextLine2}
        </TextWrapper>
        <TextWrapper alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
          {popUpStrings.newLifeTextLine3}
        </TextWrapper>
      </TextTitleContainer>
    );
  };

  const renderTimer = () => {
    return (
      <CountDownTimer>
        <TimeText alignCenter fontFamily={FONT_FAMILY.BOLD} size={SIZE.XXXLARGE}>
          {min}:{sec}
        </TimeText>
      </CountDownTimer>
    );
  };

  return (
    <StampPopUp stampIcon={new_life} isVisible={isVisible} backgroundImage={howtoBackgroundPopUp}>
      <Header>
        <IconButton testID="cancel-button" onPress={onDissmiss} icon={ExitCircle} size={45} />
      </Header>
      {renderNewLifeTitle()}
      {renderNewLifeText()}
      {renderTimer()}
      <TokenContainer>
        <ButtonText
          size={SIZE.LARGE}
          color={color.black}
          fontFamily={FONT_FAMILY.BOLD}
          marginTop={Platform.OS === 'ios' ? 10 : 0}
          marginHorizontal={20}
          alignCenter
        >
          $1.99
        </ButtonText>
      </TokenContainer>
      <RandomText alignCenter size={SIZE.XSMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
        {popUpStrings.continueWatching}
      </RandomText>
    </StampPopUp>
  );
};

NewLifePopUp.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  footerPress: PropTypes.func.isRequired,
  onDissmiss: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired
};

export default NewLifePopUp;
