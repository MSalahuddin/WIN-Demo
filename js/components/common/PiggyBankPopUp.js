import React, { useState } from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import * as RNIap from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, Platform } from 'react-native';
import Text, { SIZE, FONT_FAMILY } from './Text';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import IconButton from './IconButton';
import { scaleHeight, scale, scaleWidth,heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings } from '../../stringConstants';
import { getPercentage, formatTokensLabel } from '../../utils';
import {
  ExitCircle,
  empty,
  full,
  piggyBankHeader,
  inviteFriendBackgroundTokenImage1,
  inviteFriendBackgroundTokenImage2,
  upRollToken,
  downToken,
  backGroundPiggyBank
} from '../../../assets/images';

const Background = styled.ImageBackground`

  align-items: center;
  background-color: ${color.white};
  border-bottom-left-radius: ${scaleHeight(8)};
  border-bottom-right-radius: ${scaleHeight(8)};
  justify-content: flex-start;
  margin-top: ${-scaleHeight(20)};
  padding-top: ${Platform.OS==='android'?scaleHeight(10):scaleHeight(25)};
  padding-bottom: ${scaleHeight(65)};
  border-width: 1;
  border-color: ${color.white};
  border-radius: 15;
  shadow-color: ${color.blackShadow};
  shadow-offset: 4px 4px;
  shadow-opacity: 1;
  shadow-radius: 2px;
  width: 85%;
  z-index: -1;
`;

const ExitCircleBtn =Platform.OS==='android'? styled(IconButton)`
z-index: 1;
justify-content:flex-end;
margin-right:${scaleWidth(-283)};
`:
styled(IconButton)`
z-index: 1;
justify-content:flex-end;
margin-right:${scaleWidth(-290)}
`
;
const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;
const ButtonContainer = styled.View`
`;
const ButtonWrapper = styled(Button)`
  margin-top: ${({ marginTop }) => scaleHeight(marginTop)};
`;



const ButtonText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(7)};
`;

const PiggyBankIcon =Platform.OS==='android'? styled.Image`
  margin-top:${scaleHeight(-80)}
  margin-bottom: ${scaleHeight(5)};
  margin-left:${scaleWidth(-15)};
`:
styled.Image`
margin-top:${scaleHeight(-80)}
margin-bottom: ${scaleHeight(5)};
margin-left:${scaleWidth(-15)};
`;
;
const PiggyBankTokenContainer = Platform.OS==='android'? styled.View`
margin-top:${scaleHeight(-70)}
flex-direction:row;
margin-bottom:${scale(10)}
`:
styled.View`
margin-top:${scaleHeight(heightRatio>1?-50:-60)}
flex-direction:row;
margin-bottom:${scaleHeight(10)}
`;


const ContentView = styled.View`
flex-direction:column;

`;
const PiggyBankHeadingCoinLeft = styled.Image`
  height: ${scaleHeight(50)};
  margin-top:${scaleHeight(-10)};
  position:absolute;
  left:${scaleWidth(Platform.OS==='android'?-90:-80)}
  
`;
const PiggyBankHeadingCoinRight =Platform.OS==='android'? styled.Image`
  height: ${scaleHeight(140)};
  width: ${scaleHeight(140)};
  margin-top:${scaleHeight(-30)};
  position:absolute;
  right:${scaleWidth(heightRatio>1?-105:-95)}
  
`:
styled.Image`
  height: ${scaleHeight(heightRatio > 1 ? 120: 145)};
  width: ${scaleHeight(heightRatio > 1 ? 120: 145)};
  margin-top:${scaleHeight(heightRatio>1?-25:-45)};
  position:absolute;
  right:${scaleWidth(heightRatio>1?-105:-100)}
  
`;
;
const PiggyBankProgressCoinRight = styled.Image`
height: ${scaleHeight(50)};
width: ${scaleHeight(50)};
position:absolute;
top:${scaleHeight(-15)}
right:${scaleWidth(3)}

`;
const PiggyBankProgressCoinLeft = styled.Image`
height: ${scaleHeight(105)};
width: ${scaleHeight(105)};
position:absolute;
top:${scaleHeight(30)}
left:${scaleWidth(-52)}

`;
const PiggyBankbuttonCoinright = styled.Image`
height: ${scaleHeight(40)};
width: ${scaleHeight(40)};
position:absolute;
top:${scaleHeight(10)}
right:${scaleWidth(-40)}
`;

const PopUpContentView = styled.View`
  align-items: center;
  justify-content: center;
  margin-top:${scale(Platform.OS==='android'?20:10)}
`;

const StyledModal = styled(Modal)`
  align-items: center;
  background-color: ${color.popupBlack};
  justify-content:center;
  margin: 0;
`;

const ProgressBarContainer = styled.View`
  align-items: center;
  width: 100%;
  padding-top: ${scaleHeight(10)};
  padding-bottom: ${scaleHeight(5)};
  border-radius: ${scaleHeight(8)};
`;

const ProgressBarWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom:${scale(10)};
  padding-bottom: ${Platform.OS === 'android' ? scaleHeight(5) : scaleHeight(8)};

`;

const ProgressBar = styled.View`
  height: 30;
  margin-horizontal: ${scale(-7)};
  border-color:${color.borderBlue};
  width: 45%;
  border-width:4;
  z-index:2;
  shadow-opacity:1.0;
`;

const Progress = styled(LinearGradient)`
  align-items: center;
  justify-content: center;
  border-top-right-radius: ${scale(25)};
  border-bottom-right-radius: ${scale(25)};
  height: 22;
  z-index:1;
  position: absolute;
  width: ${({ widthPercentage }) => widthPercentage === 100 ? widthPercentage + 10 : widthPercentage}%;
`;

const ProgressBarWrapperImages = styled.Image`
  height: ${scaleHeight(40)};
  width: ${scaleHeight(40)};
  z-index:5
`;

const TextWrapper = styled(Text)`
  margin-horizontal: ${scale(28)};
`;
const TokenLeftTextWrapper = styled(Text)`
  text-align:center;
  margin-left:${scaleWidth(4)}
`;
const FooterTextWrapper = styled(Text)`
margin-horizontal: ${scale(28)};
margin-vertical:${scale(5)}
`;
const HeadingTextWrapper = styled(Text)`
  margin-top: ${scaleHeight(0)};
  margin-bottom: ${scaleHeight(heightRatio>1? 10: 5)};
`;
const PiggyBankTokenView = styled.View`
background-color:${color.tagBlue};
justify-content:center;
align-items:center;
width:${scaleWidth(200)};
border-radius:${scale(45)};
`;
const PiggybankTokens = styled(Text)`
  margin-top: ${scale(Platform.OS==='android'?10:20)};
  margin-bottom: ${scaleHeight(10)};
 
`;




const PiggyBankPopUp = ({ data, isVisible, onClose, notApplicable }) => {
  const calculatedCurrentToken = data?.playerPiggyBankTokens >= data?.maxTokens ? data?.maxTokens : data?.playerPiggyBankTokens
  const widthPercentage = data && getPercentage(calculatedCurrentToken, data.maxTokens);
  const requestPurchase = async productId => {
    try {
      const payload = await RNIap.getProducts([productId]);
      if (payload.length !== 0) {
        await RNIap.initConnection()
        await RNIap.requestPurchase(productId, false);
        onClose()
      }
    } catch (error) {
      // Error handled in purchase listener
    }
  };
  const getID = async () => {
    const productId = Platform.OS === 'android' ? data.androidProductId : data.iosProductId
    if (data.playerPiggyBankTokens >= data.minTokens) {
      await requestPurchase(productId)
    }
    else {
      notApplicable()
    }
  }

  return (
    <SafeAreaView>
      <StyledModal isVisible={isVisible}>

        <ExitCircleBtn
          testID="exit-circle"
          onPress={onClose}
          icon={ExitCircle}
          size={30}

        />
        <Background source={backGroundPiggyBank} resizeMode="stretch">
          <PiggyBankIcon source={piggyBankHeader} resizeMode="contain" />

          <PiggyBankTokenContainer>
            <PiggyBankHeadingCoinLeft source={inviteFriendBackgroundTokenImage1} resizeMode="contain" />
            <ContentView>
              <HeadingTextWrapper fontFamily={FONT_FAMILY.SEMI_BOLD}
                size={SIZE.LARGE} color={color.white} alignCenter>
                {popUpStrings.piggyBankYouHave}
              </HeadingTextWrapper>
              <PiggyBankTokenView>
                <PiggybankTokens fontFamily={FONT_FAMILY.SEMI_BOLD}
                  size={SIZE.NORMAL} color={color.gold} alignCenter>
                  {data && popUpStrings.HeadingOnePiggyBankAddToken(formatTokensLabel(data.playerPiggyBankTokens))}
                </PiggybankTokens>
              </PiggyBankTokenView>

            </ContentView>

            <PiggyBankHeadingCoinRight source={inviteFriendBackgroundTokenImage2} resizeMode="contain" />
          </PiggyBankTokenContainer>
         {(data && data?.playerPiggyBankTokens - data?.piggyBankValueComparisonAmount>0) && <TextWrapper fontFamily={FONT_FAMILY.BOLD} size={heightRatio > 1 ? SIZE.LARGE:SIZE.SMALL}
            color={color.white} alignCenter>
            {popUpStrings.PiggyBankMoreToken(data?.playerPiggyBankTokens - data?.piggyBankValueComparisonAmount)}
          </TextWrapper>
          }
          <PopUpContentView>

            <TextWrapper fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XXSMALL}
              color={color.white} alignCenter>
              {popUpStrings.lineOnePiggyBankAddToken}
            </TextWrapper>
            <TextWrapper fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XXSMALL}
              color={color.white} alignCenter>
              {popUpStrings.lineTwoPiggyBankAddToken}
            </TextWrapper>
            <TextWrapper fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XXSMALL}
              color={color.white} alignCenter>
              {popUpStrings.lineSixPiggyBankAddToken}
            </TextWrapper>
            <TextWrapper fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XXSMALL}
              color={color.white} alignCenter>
              {popUpStrings.lineSevenPiggyBankAddToken}
            </TextWrapper>
          </PopUpContentView>
          <ProgressBarContainer>
            <ProgressBarWrapper>
              <ProgressBarWrapperImages source={empty} />
              <ProgressBar>
                <Progress colors={[color.goldentGradientLight, color.goldentGradientMid, color.goldentGradientDark]} widthPercentage={widthPercentage} />
              </ProgressBar>
              <ProgressBarWrapperImages source={full} />
            </ProgressBarWrapper>
            <TokenLeftTextWrapper fontFamily={FONT_FAMILY.BOLD} size={SIZE.XSMALL} color={color.white} alignCenter>
              {data &&
                popUpStrings.lineFivePiggyBankAddToken((parseInt(data.maxTokens, 10) - parseInt(data.playerPiggyBankTokens, 10)), formatTokensLabel(data.maxTokens - data.playerPiggyBankTokens))}
            </TokenLeftTextWrapper>
            <PiggyBankProgressCoinRight source={inviteFriendBackgroundTokenImage2} resizeMode="contain" />
            <PiggyBankProgressCoinLeft source={upRollToken} resizeMode="contain" />
          </ProgressBarContainer>
          <ButtonContainer>
            <ButtonWrapper
              borderRadius={44}
              height={55}
              width={220}
              theme={BUTTON_COLOR_SCHEME.GREEN}
              onPress={() => getID()}
              marginTop={0}
            >
              <ButtonContentContainer>
                <ButtonText color={color.white} size={SIZE.LARGE}>
                  {data && popUpStrings.Unlock(data.localizedPrice)}
                </ButtonText>
              </ButtonContentContainer>
            </ButtonWrapper>
            <PiggyBankbuttonCoinright source={downToken} resizeMode="contain" />
          </ButtonContainer>
          <FooterTextWrapper fontFamily={FONT_FAMILY.BOLD} size={SIZE.XXSMALL} color={color.silverWhite} alignCenter>
              {(data && data?.playerPiggyBankTokens - data?.piggyBankValueComparisonAmount>0) &&
                popUpStrings.comparedText(data?.piggyBankValueComparisonTokenPack.toLowerCase())}
            </FooterTextWrapper>
        </Background>
      </StyledModal>
    </SafeAreaView>
  );
};

PiggyBankPopUp.propTypes = {
  data: PropTypes.node.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  notApplicable: PropTypes.func.isRequired
};

export default PiggyBankPopUp;
