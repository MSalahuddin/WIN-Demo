/* eslint-disable no-nested-ternary */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import Button, { BUTTON_COLOR_SCHEME } from '../common/Button';
import PointProgressBar from '../common/ProgressBar';
import { scale, scaleHeight, scaleWidth, getWindowWidth, heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import { GetRemainingTime } from '../../utils';
import ButtonGradient from '../common/GradientButton';
import SimpleButton from '../common/SimpleButton';
import BeforeClaimPopUp from '../common/BeforeClaimPopUp';

const cardWidth = (getWindowWidth() - scale(15));
const tokenIconHeight = (cardWidth * 200) / 800;

const OuterContainer = styled.View`
width: ${cardWidth};
height:${tokenIconHeight - 7}
align-items: center;
align-self:center;
background-color:${color.leaderBoardcardBackgroundColor};
border-radius: ${scale(8)};
margin-top: ${scale(5)};
shadow-color: ${color.blackShadow};
shadow-offset: 4px 4px;
shadow-opacity: ${1};
shadow-radius: 2px;
elevation: 8;
border-width: 2;
border-color: ${color.cardBorderBlue};
`;

const Container = styled.View`
width:100%;
flex-direction:column;
`;

// width: ${cardWidth / 2.8 - scaleWidth(15)};
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

// width: ${cardWidth / 3 * 2 - scaleWidth(9)};
const CardInfo = styled.View`
height: ${tokenIconHeight - 11};
flex-direction:row;
`;
const CardInfoBox = styled.View`
flex-direction:row;
height: 100%;
flex:2.4;
`;
// width: ${cardWidth / 3 + scaleWidth(30)};
const ValueInfo = styled.View`
flex:1.3;
flex-direction:column;
justify-content:center;
background-color: ${color.leaderBoardcardBackgroundColor};
`;

const ParallelogramBackground = styled.View`
width: ${cardWidth / 3 + scaleWidth(38)};
border-top-color:  ${color.cyanBlue};
border-left-width: 0px;
border-left-color: transparent;
border-right-width:${scaleWidth(22)};
border-top-width:${tokenIconHeight - 11};
border-right-color: transparent;
border-style: solid;
z-index: -1;
position: absolute;
`;

const ButtonContainer = styled.View`
align-items:center;
justify-content:center;
top: 5;
flex:1;
left:2;
`;

const InfoDots = styled.TouchableOpacity`
  position:absolute;
  right:-5;
  top:10;
  width: 30px;
  z-index: 1;
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 5px;
`;

const Dot = styled.View`
  height: 5px;
  width: 5px;
  background-color: ${color.white}
  border-radius: 5px;
  opacity: 0.5;
`;
const ProgressBarView = styled.View`
margin-top: ${scaleHeight(5)};
justify-content:center;
align-items: center;
`;
const LevelProgressBarContainer = styled(PointProgressBar)`
  margin-horizontal: ${scale(10)};
`;

const CardTextContainer = styled.View`
  align-self:center;
  flex-direction: row;
  margin-top: ${({ marginTop }) => scaleHeight(marginTop)};
`;

const StyledText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(3)};
  margin-horizontal: ${scale(5)};
  text-align:center;
`;

const PaddedText = styled(Text)`
  text-align: center;
  top:${Platform.OS === 'android' ? 0 : 3}
`;

const NotificationIcon = styled.ImageBackground`
  position:absolute;
  right:${heightRatio > 1 ? scaleWidth(-18) : scaleWidth(-10)};
  top:${heightRatio > 1 ? scaleHeight(-20) : scaleHeight(-22)}; 
  z-index:1;
  flex-direction:row;
  margin-bottom:${scaleHeight(Platform.OS === 'android' ? 0 : 8)};
  height: ${Platform.OS === 'android' ? scaleHeight(23) : scaleHeight(21)};
  width: ${Platform.OS === 'android' ? scaleHeight(23) : scaleHeight(21)};
`;

const NotificationText = styled(Text)`
  color: ${color.white};
  margin-top: ${Platform.OS === 'android' ? 0 : scale(5)}
  text-align:center;
  align-items: center;
  align-self:center;
  width:100%;
  justify-content:center;
`;



const BonusCard = (
  {
    image,
    imageIcon,
    Detailedtext,
    isInfo,
    infoPress,
    onPress,
    isDisabled,
    isProgressBar,
    ProgressStarPoint,
    ProgressEndPoint,
    btnTxt,
    data,
    showDays,
    remainingTime,
    notificationImg,
    noOfFreePlays,
    isClaimFreePlay,
    claimAndWatch,
    claimPopUpText
  }
) => {

  const [isVisibleWatchAd, setVisibleWatchAd] = useState(false)

  if (data) {
    return (
      <OuterContainer>
        <Container>
          <CardInfo>
            <ImageContainer source={image}
              // eslint-disable-next-line react-native/no-inline-styles
              imageStyle={{ borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
              <StyledImage source={imageIcon} resizeMode="cover" />
            </ImageContainer>
            <CardInfoBox>
              <ValueInfo>
                <ParallelogramBackground />
                {isInfo && <InfoDots
                  onPress={infoPress}>
                  {[0, 1, 2].map(() => <Dot />)}
                </InfoDots>}

                <CardTextContainer marginTop={0}>
                  {((noOfFreePlays > 0) && isClaimFreePlay) &&
                    <NotificationIcon source={notificationImg} resizeMode="cover" >
                      <NotificationText size={SIZE.XXXSMALL}>{noOfFreePlays}</NotificationText>
                    </NotificationIcon>
                  }

                  <StyledText fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.XXXXSMALL} color={color.white}>
                    {Detailedtext}
                  </StyledText>

                </CardTextContainer>
                {isProgressBar && <ProgressBarView>
                  <LevelProgressBarContainer startPoint={ProgressStarPoint} EndPoint={ProgressEndPoint} />
                </ProgressBarView>}
              </ValueInfo>

              <ButtonContainer>
                <SimpleButton
                  height={45}
                  onPress={claimAndWatch ? () => setVisibleWatchAd(true) : onPress}
                  disabled={isDisabled}
                >
                  <PaddedText
                    fontFamily={FONT_FAMILY.BOLD}
                    color={isDisabled ? color.watchAdDisableText : color.navyBlue}
                    size={Platform.OS === 'android' ? SIZE.XSMALL : SIZE.SMALL}>
                    {(remainingTime && isDisabled) ? `${GetRemainingTime(remainingTime, showDays)}` : btnTxt}
                  </PaddedText>
                </SimpleButton>
              </ButtonContainer>
            </CardInfoBox>
          </CardInfo>
        </Container>
        
      <BeforeClaimPopUp
        isVisible={isVisibleWatchAd}
        text={claimPopUpText}
        onPress={() => {
          setVisibleWatchAd(false)
          onPress()
        }}
      />

      </OuterContainer >
    );
  }
  return null;
};

BonusCard.defaultProps = {

  Detailedtext: '',
  isInfo: false,
  infoPress: () => { },
  onPress: () => { },
  isDisabled: true,
  isProgressBar: false,
  ProgressStarPoint: 0,
  ProgressEndPoint: 0,
  btnTxt: '',
  showDays: false,
  remainingTime: null,
  notificationImg: null,
  noOfFreePlays: null,
  isClaimFreePlay: false,
  claimAndWatch: false,
  claimPopUpText: '',
};

BonusCard.propTypes = {
  image: PropTypes.string.isRequired,
  imageIcon: PropTypes.string.isRequired,
  Detailedtext: PropTypes.string,
  notificationImg: PropTypes.string,
  isInfo: PropTypes.bool,
  infoPress: PropTypes.func,
  onPress: PropTypes.func,
  isDisabled: PropTypes.bool,
  isProgressBar: PropTypes.bool,
  ProgressStarPoint: PropTypes.number,
  ProgressEndPoint: PropTypes.number,
  btnTxt: PropTypes.string,
  data: PropTypes.node.isRequired,
  showDays: PropTypes.bool,
  remainingTime: PropTypes.node,
  noOfFreePlays: PropTypes.number,
  isClaimFreePlay: PropTypes.bool,
  claimAndWatch: PropTypes.bool,
  claimPopUpText: PropTypes.string
};

export default BonusCard;
