import React, { useContext } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Text, { FONT_FAMILY, SIZE } from './Text';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import Banner, { BANNER_TYPE } from './Banner';
import { scale, getWindowWidth, scaleHeight, scaleWidth } from '../../platformUtils';
import { color } from '../../styles';
import { coin, saleBanner } from '../../../assets/images';
import { gameCardReloadStrings } from '../../stringConstants';
import { convertNumberToStringWithComma } from '../../utils';
import { SOUNDS } from '../../soundUtils';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';
import SimpleButton from './SimpleButton';
// showing 2 cards per row minus padding 16 each side and between
const cardWidth = (getWindowWidth() - scale(86));
const Container = styled.View`
  align-items: center;
  align-self:center;
  margin-top: ${scale(8)};
  width: ${cardWidth};
  flex-direction:row;
  justify-content:center;
`;


// the height should be proportional to the image size we get
const tokenIconHeight = (cardWidth * 187) / 600;

const PrizeImage = styled.Image`
  height: ${tokenIconHeight};
  width: ${cardWidth / 3 + scaleWidth(10)};
  border-top-left-radius: ${scale(8)};
  border-bottom-left-radius: ${scale(8)};
`;
const TokenInfo = styled.View`
width: ${cardWidth / 3 * 2 - scaleWidth(9)};
height: ${tokenIconHeight};
margin-left:${-scale(1)};
flex-direction:column;
`;
const TokenValueInfo = styled.View`
width: ${cardWidth / 3 - scaleWidth(20)};
flex-direction:column;
justify-content:center;
`;
const PrizeInfo = styled.View`
width: ${cardWidth / 3 + scaleWidth(10)};
flex-direction:column;
align-items:center;
justify-content:center;
`;
const TokenInfoBox = styled.View`
flex-direction:row;
height: 100%;
`

const TokenTextContainer = styled.View`
align-self:center;
align-items:center;
flex-direction: row;
`;
const TokenValueView = styled.View`
flex-direction: column;
`;

const TokenIcon = styled.Image`
margin-right:${scale(5)};
  height: ${Platform.OS === 'android' ? scaleHeight(22) : scaleHeight(18)};
  width: ${Platform.OS === 'android' ? scaleHeight(21) : scaleHeight(18)};
`;


const StyledText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(3)};
  margin-horizontal: ${scale(3)};
  width:120;
  `;

const ButtonWrapper = styled(Button)`
  margin-vertical: ${scaleHeight(Platform.OS === 'android' ? 6 : 0)};
`;

const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  padding-horizontal:${scaleWidth(10)};
  justify-content: center;
`;

const ButtonText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(5)};
  text-align:center;
`;



const SaleBanner = styled.Image`
  position: absolute;
  left: ${scaleHeight(-2)};
  top: ${scaleHeight(-2)};
  height: ${scaleHeight(58)};
  width: ${scaleHeight(60)};
`;

const StrikeTokensView = styled.View`
  justify-content: center;
  align-items: center;
`;

const RedStrikeLine = styled.View`
  border-bottom-width: ${scale(2)};
  border-color: ${color.pinkRed};
  height: 1;
  position: absolute;
  top: ${scaleHeight(Platform.OS === 'android' ? 10 : 8)};
  width: 100%;
`;

const QuickTokenCard = ({
  imageUrl,
  tokenAmount,
  bonusTokenAmount,
  onPress,
  ribbonName,
  ribbonColor,
  isOnSale,
  iapData
}) => {
  const { playSoundEffect } = useContext(BackgroundMusicContext);
  const bannerWidth = (cardWidth / 3);
  const isBonus = bonusTokenAmount > 0;
  const handleOnPress = () => {
    playSoundEffect(SOUNDS.PURCHASE_TOKENS);
    onPress();
  };

  return (
    <Container>


      <TokenTextContainer marginTop={0}>
        <TokenIcon source={coin} />
        <TokenValueView>
          {isBonus && (
            <StrikeTokensView>
              <StyledText color={color.white} fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.XSMALL}>
                {convertNumberToStringWithComma(tokenAmount)}
              </StyledText>
              <RedStrikeLine />
            </StrikeTokensView>
          )}
          <StyledText color={color.white} fontFamily={isBonus ? FONT_FAMILY.BOLD_ITALIC : FONT_FAMILY.SEMI_BOLD} size={SIZE.XXXLARGE}>
            {convertNumberToStringWithComma(isBonus ? bonusTokenAmount : tokenAmount)}
          </StyledText>
        </TokenValueView>
      </TokenTextContainer>

      <SimpleButton
        height={50}
        width={100}
        onPress={handleOnPress}
      >
        <ButtonContentContainer>
          <ButtonText fontFamily={FONT_FAMILY.BOLD} size={SIZE.XXSMALL} color={color.watchAdDarkBlue}>
            {gameCardReloadStrings.QuickPrice(iapData.localizedPrice)}
          </ButtonText>
        </ButtonContentContainer>
      </SimpleButton>
    </Container>
  );
};

QuickTokenCard.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  tokenAmount: PropTypes.number.isRequired,
  bonusTokenAmount: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  isOnSale: PropTypes.bool.isRequired,
  ribbonName: PropTypes.string,
  ribbonColor: PropTypes.string,
  iapData: PropTypes.PropTypes.shape({
    localizedPrice: PropTypes.string
  }).isRequired,
};

QuickTokenCard.defaultProps = {
  bonusTokenAmount: null,
  ribbonName: '',
  ribbonColor: ''
};

export default QuickTokenCard;
