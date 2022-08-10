/* eslint-disable no-nested-ternary */
import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';

import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import Button, { BUTTON_COLOR_SCHEME } from '../common/Button';
import { scale, scaleHeight, scaleWidth, getWindowWidth, heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import ButtonGradient from '../common/GradientButton';
import SimpleButton from '../common/SimpleButton';

const cardWidth = (getWindowWidth() - scale(15));
const tokenIconHeight = (cardWidth * 200) / 800;

const OuterContainer = styled.View`
width: ${cardWidth};
height:${tokenIconHeight - 7}
align-items: center;
align-self:center;
background-color:${color.leaderBoardcardBackgroundColor};
border-radius: ${scale(8)};
margin-top: ${scale(4)};
shadow-color: ${color.blackShadow};
shadow-offset: 4px 4px;
shadow-opacity: ${1};
shadow-radius: 2px;
elevation: 8;
border-width: 2px;
border-color: ${color.cardBorderBlue};
`;


const Container = styled.View`
width:100%;
flex-direction:column;
`;

const ImageContainer = styled.ImageBackground`
  height: ${tokenIconHeight - 11};
  flex:1;
  border-bottom-left-radius: ${scale(5)};
  border-top-left-radius: ${scale(5)};
`;

const StyledImage = styled.Image`
height: 100%;
width: 85%;
left:8;
`;

const CardInfo = styled.View`
height: ${tokenIconHeight - 11};
flex-direction:row;
`;
const CardInfoBox = styled.View`
flex-direction:row;
height: 100%;
flex:2.4;
`;
const ValueInfo = styled.View`
flex:1.3;
flex-direction:column;
justify-content:center;
background-color:${color.leaderBoardcardBackgroundColor};
`;

const ButtonContainer = styled.View`
align-items:center;
justify-content:center;
top: 5;
flex:1;
`;

const CardTextContainer = styled.View`
  align-self:center;
  flex-direction: column;
`;

const PaddedText = styled(Text)`
  text-align: center;
  top:${Platform.OS === 'android' ? 0 : 3}

`;

const CenterTextWrapper = styled.View`
margin-top: ${scaleHeight(-1)};
padding-top: ${heightRatio > 1
    ? scaleHeight(Platform.OS === 'android' ? 0 : 5)
    : scaleHeight(Platform.OS === 'android' ? 0 : 5)};
`;

const ParallelogramBackground = styled.View`
width: ${cardWidth / 3 + scaleWidth(40)};
border-top-color:  ${color.cyanBlue};
border-left-width: 0px;
border-left-color: transparent;
border-right-width:${scaleWidth(26)};
border-top-width:${tokenIconHeight - 11};
border-right-color: transparent;
border-style: solid;
z-index: -1;
position: absolute;
`;


const StyledText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(3)};
  margin-bottom: ${scale(5)};
  text-align:center;
`;

const Timer = styled.View`
    background-color: ${color.prussianBlue};
    width: ${getWindowWidth() * 0.28};
    height: ${scale(35)};
    justify-content: center;
    border-radius:  ${scale(35)};
`;


const DailyBonusCard = ({
  data,
  image,
  imageIcon,
  Title,
  onPress,
  isDisabled,
  btnTxt,
  hours,
  minutes,
  seconds }) => {
  const timerHours = hours < 10 ? `0${hours}` : hours;
  const timerMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const timerSeconds = seconds < 10 ? `0${seconds}` : seconds;
  if (data && data.isAvailable) {
    return (
      <OuterContainer>
        <Container>
          <CardInfo>
            <ImageContainer source={image}
              // eslint-disable-next-line react-native/no-inline-styles
              imageStyle={{ borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}
            >
              <StyledImage source={imageIcon} resizeMode="cover" />
            </ImageContainer>
            <CardInfoBox>
              <ValueInfo>
                <ParallelogramBackground />
                <CardTextContainer marginTop={0}>
                  <StyledText fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.XXXXSMALL} color={color.white}>
                    {Title}
                  </StyledText>
                  <Timer>
                    <CenterTextWrapper>
                      <Text size={SIZE.NORMAL} color={color.white} alignCenter>
                        {`${timerHours}:${timerMinutes}:${timerSeconds}`}
                      </Text>
                    </CenterTextWrapper>
                  </Timer>
                </CardTextContainer>
              </ValueInfo>
              <ButtonContainer>
                <SimpleButton
                  onPress={onPress}
                  disabled={isDisabled}
                  height={45}
                >

                     <PaddedText
                      color={isDisabled ? color.watchAdDisableText : color.navyBlue}
                      fontFamily={FONT_FAMILY.BOLD}
                      size={Platform.OS === 'android' ? SIZE.XSMALL : SIZE.SMALL}>
                      {btnTxt}
                    </PaddedText>
                  </SimpleButton>
              </ButtonContainer>
            </CardInfoBox>

          </CardInfo>
        </Container>

      </OuterContainer>
    );
  }
  return null
};
DailyBonusCard.defaultProps = {

  Title: '',
  onPress: () => { },
  isDisabled: true,
  btnTxt: '',
  hours: 0,
  minutes: 0,
  seconds: 0
};

DailyBonusCard.propTypes = {
  imageIcon: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  Title: PropTypes.string,
  onPress: PropTypes.func,
  isDisabled: PropTypes.bool,
  btnTxt: PropTypes.string,
  hours: PropTypes.number,
  minutes: PropTypes.number,
  seconds: PropTypes.number,
  data: PropTypes.node.isRequired
};

export default DailyBonusCard;
