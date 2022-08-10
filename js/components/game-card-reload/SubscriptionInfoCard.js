import React, { } from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
// import IconButton from '../common/IconButton';
import { coin } from '../../../assets/images';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import { scale, scaleHeight, scaleWidth, getWindowWidth, heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import { gameCardReloadStrings } from '../../stringConstants';

const cardWidth = (getWindowWidth() - scale(20));
const tokenIconHeight = (cardWidth * 200) / 799;

const StyledInfo = styled.View`

width: ${cardWidth / 2.3 - scaleWidth(4)};
border-top-color:  ${color.white};
border-left-width: 0px;
border-left-color: transparent;
border-right-width:${scaleWidth(29)};
border-top-width:${heightRatio > 1 ? tokenIconHeight - 1 : tokenIconHeight - 2};
height: ${tokenIconHeight};
border-right-color: transparent;
border-style: solid;
position: absolute;
top: 0;
z-index: 1;
`;

const BaseToken = styled.View`
right:5
`;

const BonusToken = styled.View`
bottom:3
`;

const PrizeText = styled(Text)`
margin-top:${scaleWidth(Platform.OS === 'android' ? 0 : 6)};
`;


const MainIcon = styled.Image`
  height: ${scale(15)};
  width: ${scale(15)};
  margin-right:${scale(3)};

`;

const MonthlyMainIcon = styled.Image`
height: ${scale(15)};
width: ${scale(15)};
margin-right:${scale(2)};
margin-left: -10
`;


const TokenNameContainer = styled.View`
flex-direction:column;
justify-content:space-between;
align-items:center;
margin-top:${heightRatio > 1 ? scaleHeight(Platform.OS === 'android' ? -74 : -67)
        : scaleHeight(Platform.OS === 'android' ? -85 : -78)};
`;


const TokenText = styled(Text)`
  text-align:center;
  align-self:center;
  padding-vertical:${scale(2)};
`;
const TokenAmount = styled.View`
flex-direction:row;
justify-content:center;
align-items:center;
`;

const CardContainer = styled.View`
flex-direction:column;
`;
const SubscriptionInfoCard = (
    {
        onPressClose,
        tokenAmount,
        BonusAmount
    }
) => {
    return (
        <StyledInfo >
            <CardContainer>

                <TokenNameContainer>
                    <BaseToken>
                        <TokenText color={color.black} fontFamily={FONT_FAMILY.BOLD} size={SIZE.XXXXSMALL}>
                            {gameCardReloadStrings.tokensToday}
                        </TokenText>
                        <TokenAmount>
                            <MainIcon source={coin} resizeMode="contain" />
                            <PrizeText color={color.silver} size={SIZE.XXXSMALL} fontFamily={FONT_FAMILY.REGULAR}>
                                {tokenAmount}
                            </PrizeText>
                        </TokenAmount>
                    </BaseToken>

                    <BonusToken>
                        <TokenText color={color.black} fontFamily={FONT_FAMILY.BOLD} size={SIZE.XXXXSMALL}>
                            {gameCardReloadStrings.monthlyTokens}
                        </TokenText>
                        <TokenAmount>
                            <MonthlyMainIcon source={coin} resizeMode="contain" />
                            <PrizeText color={color.silver} size={SIZE.XXXSMALL} fontFamily={FONT_FAMILY.REGULAR}>
                                {BonusAmount}
                            </PrizeText>
                        </TokenAmount>
                    </BonusToken>

                </TokenNameContainer>
            </CardContainer>
        </StyledInfo>

    );
};

SubscriptionInfoCard.propTypes = {

    onPressClose: PropTypes.func,
    tokenAmount: PropTypes.string,
    BonusAmount: PropTypes.string,

};

SubscriptionInfoCard.defaultProps = {
    onPressClose: () => { },
    tokenAmount: 0,
    BonusAmount: 0,
};

export default SubscriptionInfoCard;
