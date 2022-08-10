/* eslint-disable no-nested-ternary */
import React, { useContext, useState } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';

import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import Button, { BUTTON_COLOR_SCHEME } from '../common/Button';
import { scale, getWindowWidth, scaleHeight, scaleWidth, heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import IconButton from '../common/IconButton';
import { saleBanner, ExitCircle } from '../../../assets/images';
import { gameCardReloadStrings } from '../../stringConstants';
import { convertNumberToStringWithComma } from '../../utils';
import { SOUNDS } from '../../soundUtils';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';
import { UserContext } from '../../context/User.context';
import TokenInfoCard from './TokenInfoCard';
import ButtonGradient from '../common/GradientButton';
import SimpleButton from '../common/SimpleButton';

// showing 2 cards per row minus padding 16 each side and between
const cardWidth = (getWindowWidth() - scale(16));
// the height should be proportional to the image size we get
const tokenIconHeight = (cardWidth * 200) / 800;

const Container = styled.View`
  align-items: center;
  align-self:center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: ${scale(8)};
  margin-top: ${scale(5)};
  shadow-color: ${color.blackShadow};
  shadow-offset: 2px 2px;
  shadow-opacity: ${1};
  shadow-radius: 1px;
  elevation: 8;
  width: ${cardWidth};
  height:${tokenIconHeight - 7.3}
  flex-direction:row;
  border-width: 2px;
  border-color: ${color.cardBorderBlue};
`;
const InfoButton = styled(IconButton)`
justify-content:flex-start;
margin-top: ${heightRatio > 1 ? Platform.OS === 'android' ? scaleHeight(60) : scaleHeight(58) : scaleHeight(60)};
position:absolute;
z-index: 1;
right:-10;
top: ${cardWidth / 36 - scaleHeight(60)}
`;

const InfoDots = styled.TouchableOpacity`
  position:absolute;
  right:-10;
  top:19;
  width: 30px;
  z-index: 1;
  flex-direction: row;
  align-items: center;
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

const TokenValueInfo = styled.View`
flex-direction:column;
justify-content:center;
background-color: transparent;

`;
// width: ${cardWidth / 3 - scaleWidth(15)};
const PrizeImage = styled.Image`
  height: ${tokenIconHeight - 11};
  flex:1;
  border-top-left-radius: ${scale(5)};
  border-bottom-left-radius: ${scale(5)};
  z-index: -1
`;
// width: ${cardWidth / 3 * 2 + scaleWidth(16)};
const TokenInfo = styled.View`

height: ${91.7};
margin-left:${-scale(5)};
flex-direction:column;
flex:1.3;
`;
// width: ${cardWidth / 4 + scaleWidth(15)};
const PrizeInfo = styled.View`
flex:1;
flex-direction:column;

align-items:center;
justify-content:center;
`;
const TokenInfoBox = styled.View`
flex-direction:row;
height: 100%;
`;

const TokenTextContainer = styled.View`
height: ${tokenIconHeight - 3};
flex-direction: row;
position: absolute;
`;

const TokenValueView = styled.View`
flex-direction: column;
align-items: center;
width: ${cardWidth / 2.4};
padding-vertical:${Platform.OS === 'android' ? 15 : 25};
`;

const StyledText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(3)};
  margin-horizontal: ${scale(3)};
`;

const ButtonContentContainer = styled.View`
  align-items: center;
  justify-content: center;
  
`;

const ButtonText = styled(Text)`
  text-align:center;
  align-items: center;
  top:${Platform.OS === 'android' ? 0 : 3}
`;

const SaleBanner = styled.Image`
  position: absolute;
  left: ${scaleHeight(-5)};
  top: ${scaleHeight(-5)};
  height: ${scaleHeight(53)};
  width: ${scaleHeight(55)};
`;

const StrikeTokensView = styled.View`
  position:absolute;
  z-index:1;
  bottom: ${Platform.OS === 'android' ? 8 : 5};
`;

const RedStrikeLine = styled.View`
  border-bottom-width: ${scale(2)};
  border-color: ${color.pinkRed};
  height: 1;
  position: absolute;
  top: ${scaleHeight(Platform.OS === 'android' ? 10 : 8)};
  width: 100%;
`;

const BestValue = styled.View`
justify-content: center;
align-items: center;
`;

const BestText = styled(Text)`
  text-align:center;
  top:2px;
  left:5px;
`;
const PopularText = styled(Text)`
  text-align:center;
  top:2px;
  left:5px;
`;


const ParallelogramBackground = styled.View`
width: ${cardWidth / 3 + scaleWidth(38)};
border-top-color:  ${({ borderTopColor }) => borderTopColor};
border-left-width: 0px;
border-left-color: transparent;
border-right-width:${scaleWidth(22)};
border-top-width:${tokenIconHeight - 11};
border-right-color: transparent;
border-style: solid;
z-index: -1;
position: absolute;
`;


const TokenCard = ({
  imageUrl,
  tokenAmount,
  bonusTokenAmount,
  onPress,
  ribbonName,
  ribbonColor,
  backgroundColor,
  isOnSale,
  iapData
}) => {
  const { playSoundEffect } = useContext(BackgroundMusicContext);
  const { vipLevel } = useContext(UserContext);
  const vipLevelBonusPercent = vipLevel?.vipLevelBonusPercent || 0;
  // const bannerWidth = (cardWidth / 3);
  const isBonus = bonusTokenAmount > 0;
  const [isVisibleInfo, setIsVisibleInfo] = useState(false)
  const handleOnPress = () => {
    playSoundEffect(SOUNDS.PURCHASE_TOKENS);
    onPress();
  };

  return (
    <Container backgroundColor={ribbonName === 'Best Value' ? color.bestValueBgColor
      : ribbonName === 'Popular' ? color.popularBgColor : color.darkNavyBlue} >
       <PrizeImage source={{ uri: imageUrl }} resizeMode="cover" />
       <TokenInfo>
        <TokenInfoBox>

          <TokenValueInfo
            backgroundColor={ribbonName === 'Best Value' ? color.bestValueBgColor
              : ribbonName === 'Popular' ? color.popularBgColor : color.darkNavyBlue}
          >
            <ParallelogramBackground borderTopColor={isVisibleInfo?color.white:( backgroundColor || color.borderBlue)} />

            {!isVisibleInfo &&
              <TokenTextContainer marginTop={0}>
                <TokenValueView>
                  <StyledText
                    color={color.white}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                      textShadowColor: color.black,
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 1
                    }}
                    fontFamily={FONT_FAMILY.BOLD_ITALIC} size={SIZE.LARGEST}
                  >
                    {convertNumberToStringWithComma(isBonus ? bonusTokenAmount : tokenAmount)}
                  </StyledText>

                  {isBonus && (
                    <StrikeTokensView>
                      <StyledText
                        color={color.white}
                        fontFamily={isBonus ? FONT_FAMILY.MEDIUM : FONT_FAMILY.SEMI_BOLD} size={SIZE.SMALL}>
                        {convertNumberToStringWithComma(tokenAmount)}
                      </StyledText>
                      <RedStrikeLine />
                    </StrikeTokensView>
                  )}
                </TokenValueView>
              </TokenTextContainer>
            }

            {isVisibleInfo
              &&
              <TokenInfoCard
                tokenAmount={convertNumberToStringWithComma(tokenAmount)}
                BonusAmount={convertNumberToStringWithComma(isBonus ? bonusTokenAmount - tokenAmount
                  : tokenAmount - tokenAmount)}
                TotalAmount={convertNumberToStringWithComma(bonusTokenAmount)}
                VipPercentage={gameCardReloadStrings.vipBonus(vipLevelBonusPercent)}
                onPressClose={() => setIsVisibleInfo(false)}
              />
            }
          </TokenValueInfo>

          {isVisibleInfo ?
            <InfoButton
              testID="info-button"
              onPress={() => {
                setIsVisibleInfo(!isVisibleInfo)
              }}
              icon={ExitCircle}
              size={Platform.OS === 'android' ? 15 : heightRatio > 1.3 ? 18 : 17}
            /> : <InfoDots
              onPress={() => {
                setIsVisibleInfo(!isVisibleInfo)
              }}>
              {[0, 1, 2].map(() => <Dot />)}
            </InfoDots>
          }
        </TokenInfoBox>
      </TokenInfo>
      <PrizeInfo>
        <ButtonContentContainer>
          {ribbonName === 'Best Value' && (
            <BestValue>
              <BestText size={SIZE.XXSMALL} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
                {gameCardReloadStrings.bestValue}
              </BestText>
            </BestValue>
          )}
          {ribbonName === 'Popular' && (
            <BestValue>
              <PopularText size={SIZE.XXSMALL} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
                {gameCardReloadStrings.popular}
              </PopularText>
            </BestValue>
          )}

          <SimpleButton
            onPress={handleOnPress}
            marginTop={5}
            height={40}
          >
            <ButtonContentContainer>
              <ButtonText fontFamily={FONT_FAMILY.BOLD} size={SIZE.XXSMALL} color={color.navyBlue}>
                {gameCardReloadStrings.buyPriceToken(iapData.localizedPrice)}
              </ButtonText>
            </ButtonContentContainer>
          </SimpleButton>

            </ButtonContentContainer>
      </PrizeInfo>
     
 

      {isOnSale && <SaleBanner source={saleBanner} resizeMode="contain" />}
    </Container >
  );
};

TokenCard.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  tokenAmount: PropTypes.number.isRequired,
  bonusTokenAmount: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  isOnSale: PropTypes.bool.isRequired,
  backgroundColor: PropTypes.string,
  ribbonName: PropTypes.string,
  ribbonColor: PropTypes.string,
  iapData: PropTypes.PropTypes.shape({
    localizedPrice: PropTypes.string
  }).isRequired,
};

TokenCard.defaultProps = {
  bonusTokenAmount: null,
  backgroundColor: color.cyanBlue,
  ribbonColor: '',
  ribbonName: '',
};

export default TokenCard;
