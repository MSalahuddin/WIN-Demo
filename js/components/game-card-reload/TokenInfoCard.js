import React, { } from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import { coin } from '../../../assets/images';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import { scale, scaleWidth, getWindowWidth, heightRatio, scaleHeight } from '../../platformUtils';
import { color } from '../../styles';
import { gameCardReloadStrings } from '../../stringConstants';

const cardWidth = (getWindowWidth() - scale(16));
const tokenIconHeight = (cardWidth * 200) / 800;

const StyledInfo = styled.View`
  flex-direction:column;
  justify-content:space-between;
  align-items:center;
  align-self:center;
  padding-horizontal:${10};
  width:${cardWidth*0.42};
  margin-top:${10};
  height: ${tokenIconHeight - 30};
  `;
const BaseToken = styled.View`
flex:1;
`;
const BonusToken = styled.View`
flex:1;
`;

const PrizeText = styled(Text)`
margin-top:${scaleWidth(Platform.OS === 'android' ? 0 : 5)};
`;

const MainIcon = styled.Image`
  height: ${scale(15)};
  width: ${scale(15)};
  margin-right: ${scale(2)};
`;

const TotalCoin = styled.Image`
height: ${scale(18)};
width: ${scale(18)};
margin-top:${Platform.OS === 'android' ? 0 : scale(5)}
margin-left: ${scale(2)};
margin-right: ${scale(2)}; 
`;

const TokenNameContainer = styled.View`
flex-direction:row;
`;

const TotalTokenContainer = styled.View`
flex-direction:row;
text-align: center;
`;
const TokenText = styled(Text)`
  text-align:center;
  align-self:flex-start;
  padding-top:${scale(5)};
`;

const TokenAmount = styled.View`
flex-direction:row;
justify-content:center;
align-items:center;
margin-left: ${scaleWidth(-10)}
`;

const TokenInfoCard = (
    {
        tokenAmount,
        BonusAmount,
        TotalAmount,
    }
) => {
    return (
        <StyledInfo>

            <TokenNameContainer>
                <BaseToken>
                    <TokenText color={color.black} fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.XXXXSMALL}>
                        {gameCardReloadStrings.BaseToken}
                    </TokenText>
                    <TokenAmount>
                        <MainIcon source={coin} resizeMode="contain" />
                        <PrizeText color={color.silver} size={SIZE.XXXXSMALL} fontFamily={FONT_FAMILY.SEMI_BOLD}>
                            {tokenAmount}
                        </PrizeText>
                    </TokenAmount>
                </BaseToken>
                <BonusToken>
                    <TokenText color={color.black} fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.XXXXSMALL}>
                        {gameCardReloadStrings.BonusToken}
                    </TokenText>
                    <TokenAmount>
                        <MainIcon source={coin} resizeMode="contain" />
                        <PrizeText color={color.silver} size={SIZE.XXXXSMALL} fontFamily={FONT_FAMILY.SEMI_BOLD}>
                            {gameCardReloadStrings.BonusTokenText(BonusAmount)}
                        </PrizeText>
                    </TokenAmount>
                </BonusToken>
            </TokenNameContainer>

            <TotalTokenContainer>
                <PrizeText color={color.black} size={SIZE.XXSMALL} fontFamily={FONT_FAMILY.BOLD}>
                    {gameCardReloadStrings.TotalToken}
                </PrizeText>
                <TotalCoin source={coin} resizeMode="contain" />
                <PrizeText color={color.black} size={SIZE.XXSMALL} fontFamily={FONT_FAMILY.BOLD}>
                    {TotalAmount}
                </PrizeText>
            </TotalTokenContainer>
        </StyledInfo>

    );
};

TokenInfoCard.propTypes = {

    tokenAmount: PropTypes.string,
    BonusAmount: PropTypes.string,
    TotalAmount: PropTypes.string,
};

TokenInfoCard.defaultProps = {
    tokenAmount: 0,
    BonusAmount: 0,
    TotalAmount: 0,
};

export default TokenInfoCard;
