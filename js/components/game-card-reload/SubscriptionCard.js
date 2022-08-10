/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import IconButton from '../common/IconButton';
import Banner, { BANNER_TYPE } from '../common/Banner';
import { scale, scaleHeight, scaleWidth, getWindowWidth, heightRatio } from '../../platformUtils';
import { gameCardReloadStrings } from '../../stringConstants';
import { color } from '../../styles';
import { convertNumberToStringWithComma } from '../../utils';
import { ExitCircle } from '../../../assets/images';
import SubscriptionInfoCard from './SubscriptionInfoCard';
import SimpleButton from '../common/SimpleButton';
import {styles} from './styles';


const cardWidth = (getWindowWidth() - scale(20));
const tokenIconHeight = (cardWidth * 200) / 780;

const OuterContainer = styled.View`
width: ${cardWidth};
height: ${tokenIconHeight};
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
border-color: ${color.cardBorderBlue};
border-width:2;
margin-left: ${Platform.OS === 'android' ? 0 : 10};
margin-right: ${Platform.OS === 'android' ? 0 : 10}

`;

const Container = styled.View`
width:100%;
flex-direction:row;
`;

const ImageContainer = styled.View`
  flex:1;
  border-top-left-radius: ${scale(8)};
  border-bottom-left-radius: ${scale(8)};
`;

const StyledImage = styled.Image`
  height: ${tokenIconHeight - 4};
  width: 100%;
  border-top-left-radius: ${scale(5)};
  border-bottom-left-radius: ${scale(5)};
`;

const SaleBanner = styled(Banner)`
position: absolute;
left: ${-scaleWidth(10)};
top: ${-scale(5)};
`;

const TokenInfo = styled.View`
flex:1.3;
flex-direction:column;
`;
const TokenInfoBox = styled.View`
flex-direction:row;
height: 80%;
`;
const TokenValueInfo = styled.View`
width: ${cardWidth / 3 - scaleWidth(5)};
flex-direction:column;
justify-content:center;
background-color:${color.silverWhite};
z-index: -1;
`;
const ButtonContainer = styled.View`
align-items:center;
justify-content:center;
flex:1;
`;

const InfoButton = styled(IconButton)`
margin-top: ${heightRatio > 1 ? scaleHeight(59) : scaleHeight(62)};
justify-content:flex-start;
position:absolute;
z-index: 1;
top: ${Platform.OS === 'android' ? scaleHeight(-54) : scaleHeight(heightRatio >= 1 ? -55 : -53)};
right:0;  
`;

const TokenTextContainer = styled.View`
  align-self:center;
  flex-direction: column;
  margin-top: ${({ marginTop }) => scaleHeight(marginTop)};

`;
const TokenValueView = styled.View`
flex-direction: column;
`;
const SaleTextWrapper = styled(Text)`
  position: absolute;
  transform: rotate(-45deg);
  top: ${scale(15)};
  left: ${scale(8)};
`;
const ParallelogramBackground = styled.View`
width: ${cardWidth / 3 + scaleWidth(32)};
border-top-color:  ${color.cyanBlue};
border-left-width: 0px;
border-left-color: transparent;
border-right-width:${scaleWidth(29)};
border-top-width:${tokenIconHeight - 4};
border-right-color: transparent;
border-style: solid;
z-index: -1;
position: absolute;
top: 0
`;
// Note for BannerContainer top logic
// [height of top image container] - [width of banner] * [height/width ratio] / 2

const StyledText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(10) : scaleHeight(20)};
  width:${tokenIconHeight + 20};
  margin-left: ${scaleWidth(30)}
  
`;
const AdsFreeText = styled(Text)`
margin-top: ${Platform.OS === 'android' ? scaleHeight(10) : scaleHeight(20)};
width:${tokenIconHeight + 20};
margin-left: ${scaleWidth(30)};
`;

const StyledStrikedText = styled(Text)`
justify-content: center;
align-items: center;
`;

const StrikeTokensView = styled.View`
justify-content: space-between;
align-items: center;
flex:1
margin-bottom:${Platform.OS === 'android' ? 20 : 0}

`;

const RedStrikeLine = styled.View`
  border-bottom-width: ${scale(2)};
  border-color: ${color.pinkRed};
  height: 1;
  position: absolute;
  top: ${scaleHeight(Platform.OS === 'android' ? 11 : 5)};
  width: 40%
`;

const PaddedText = styled(Text)`
  text-align: center;
  padding-horizontal:5px;
  top: 3px;
`;
const PopularBanner = styled(Banner)`
position: absolute;
left: ${-scaleWidth(10)};
top: ${-scale(5)};
 
`;

const InfoDots = styled.TouchableOpacity`
  position:absolute;
  right:-5;
  top:${9};
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



const getBanner = (ribbonColor, ribbonName) => {
  const bannerWidth = (cardWidth / 3);
  switch (ribbonColor) {
    case 'purple':
      return <PopularBanner bannerType={BANNER_TYPE.PURPLE} label={ribbonName} width={bannerWidth} />;
    case 'red':
      return <PopularBanner label={ribbonName} width={bannerWidth} />;
    default:
      return null;
  }
};

// 1: monthly, 2: quarterly, and 3: yearly
const getUnit = type => {
  switch (type) {
    case 2:
      return '/qt';
    case 3:
      return '/yr';
    default:
      return '/mo';
  }
};
const ButtonContentContainer = styled.View`
  align-items: center;
  justify-content: center;
  width:95;
`;

const SubscriptionCard = ({
  onPress,
  isOnSale,
  monthlyTokenAmount,
  oneTimeTokenAmount,
  saleOneTimeTokenAmount,
  saleMonthlyTokenAmount,
  imageUrl,
  iapData,
  name,
  ribbonColor,
  ribbonName,
  type,
  totalTokens,
  bonusTotalTokens,
  isDigitalGameAdFreePurchase,
  ...rest
}) => {
  const combinedOneTimeAmount = isOnSale ? oneTimeTokenAmount + saleOneTimeTokenAmount : oneTimeTokenAmount;
  const combinedMonthlyAmount = isOnSale ? monthlyTokenAmount + saleMonthlyTokenAmount : monthlyTokenAmount;

  const [isVisibleInfo, setIsVisibleInfo] = useState(false)
  return (
    <OuterContainer {...rest}>
      <Container>
        <ImageContainer>
          <StyledImage source={{ uri: imageUrl }} resizeMode="cover" />
        </ImageContainer>

        <TokenInfo>
          <TokenInfoBox>
            <TokenValueInfo>

              <ParallelogramBackground />
              {!isVisibleInfo &&
                <TokenTextContainer marginTop={0}>
                 {isDigitalGameAdFreePurchase ?
                 <AdsFreeText
                 alignCenter
                 style={styles.shadedeTextStyle}
                    color={color.white}
                    fontFamily={FONT_FAMILY.BOLD} size={SIZE.NORMAL}
                    >
                 
                  {name?name.toUpperCase():''}
                 </AdsFreeText> :
                  <TokenValueView>
                    <StyledText
                      color={color.white}
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={styles.shadedeTextStyle}
                      fontFamily={FONT_FAMILY.BOLD_ITALIC} size={SIZE.LARGEST}>
                      {convertNumberToStringWithComma(isOnSale ? bonusTotalTokens : totalTokens)}
                    </StyledText>

                    {isOnSale && (
                      <StrikeTokensView>
                        <StyledStrikedText color={color.white}
                          fontFamily={FONT_FAMILY.SEMI_BOLD}
                          size={SIZE.SMALL}
                        >
                          {convertNumberToStringWithComma(totalTokens)}
                        </StyledStrikedText>
                        <RedStrikeLine />
                      </StrikeTokensView>
                    )}
                  </TokenValueView>}
                </TokenTextContainer>
              }
              {isVisibleInfo
                &&
                <SubscriptionInfoCard
                  tokenAmount={convertNumberToStringWithComma(combinedMonthlyAmount)}
                  BonusAmount={convertNumberToStringWithComma(combinedOneTimeAmount)}
                  onPressClose={() => setIsVisibleInfo(false)}
                />
              }
            </TokenValueInfo>
             {!isDigitalGameAdFreePurchase && <>
            {isVisibleInfo ?
              <InfoButton
                testID="info-button"
                onPress={() => {
                  setIsVisibleInfo(!isVisibleInfo)
                }}
                icon={ExitCircle}
                size={16}
                marginTop={0}
              /> : <InfoDots
                onPress={() => {
                  setIsVisibleInfo(!isVisibleInfo)
                }}>
                {[0, 1, 2].map(() => <Dot />)}
              </InfoDots>
            }
            </>}
          </TokenInfoBox>
        </TokenInfo>

        <ButtonContainer>
          <SimpleButton
            onPress={onPress}
            height={45}
            width={cardWidth*0.275}
          >
            <ButtonContentContainer>
              {Platform.OS === "android" ? <PaddedText color={color.watchAdDarkBlue}
                size={SIZE.XXSMALL} fontFamily={FONT_FAMILY.BOLD}>
                {gameCardReloadStrings.buyTokenUnit(iapData.localizedPrice, getUnit(type))}
              </PaddedText>
                : <PaddedText
                  color={color.watchAdDarkBlue}
                  size={heightRatio > 1 ? SIZE.SMALL : SIZE.XXSMALL}
                  fontFamily={FONT_FAMILY.BOLD}>
                  {gameCardReloadStrings.buyTokenUnit(iapData.localizedPrice, getUnit(type))}
                </PaddedText>
              }
            </ButtonContentContainer>
          </SimpleButton>
        </ButtonContainer>
      </Container>

      {isOnSale && (
        <SaleBanner bannerType={BANNER_TYPE.SALE} width={scale(65)}>
          <SaleTextWrapper color={color.white} size={SIZE.XXSMALL} fontFamily={FONT_FAMILY.BOLD} isUppercase>
            {gameCardReloadStrings.sale}
          </SaleTextWrapper>
        </SaleBanner>
      )}
    </OuterContainer>
  );
};
SubscriptionCard.defaultProps = {
  isOnSale: false,
  onPress: () => { },
  ribbonName: '',
  ribbonColor: '',
  saleMonthlyTokenAmount: 0,
  saleOneTimeTokenAmount: 0,
  bonusTotalTokens: 0,
  isDigitalGameAdFreePurchase:false
};

SubscriptionCard.propTypes = {
  saleMonthlyTokenAmount: PropTypes.number,
  saleOneTimeTokenAmount: PropTypes.number,
  bonusTotalTokens: PropTypes.number,
  isOnSale: PropTypes.bool,
  iapData: PropTypes.shape({ localizedPrice: PropTypes.string }).isRequired,
  imageUrl: PropTypes.string.isRequired,
  monthlyTokenAmount: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  oneTimeTokenAmount: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  ribbonColor: PropTypes.string,
  ribbonName: PropTypes.string,
  totalTokens: PropTypes.number.isRequired,
  type: PropTypes.number.isRequired,
  isDigitalGameAdFreePurchase:PropTypes.bool
};

export default SubscriptionCard;
