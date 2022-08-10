import React from 'react';
import styled from 'styled-components/native';
import { coin, tokensToPlayBackground } from '../../../assets/images';
import { heightRatio, scale, scaleHeight, scaleWidth } from '../../platformUtils';
import { color } from '../../styles';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import { convertNumberToStringWithComma } from '../../utils';
import { gameRoomStrings } from '../../stringConstants';
import { Platform } from 'react-native';
const ContainerTokensToPlay = styled.ImageBackground`
height: ${({ height }) => height};
width: ${scaleWidth(140)};
flex-direction: row;
align-items: center;
justify-content: center;
align-self: flex-end;
position:absolute;
bottom:${scale(75)}
`;
const ButtonText = styled(Text)`
margin-top: ${({ marginTop }) => marginTop};
margin-horizontal: ${({ marginHorizontal }) => marginHorizontal};
`;
const CoinIcon = styled.Image`
height: ${scaleHeight(25)};
width: ${scaleWidth(25)};
`;
const TokenToPlay = ({tokensCost}) => {
  const playContainerHeight = 42;
  return (
    <ContainerTokensToPlay height={playContainerHeight} resizeMode={'stretch'} source={tokensToPlayBackground}>
      <ButtonText
        size={SIZE.LARGE}
        color={color.white}
        fontFamily={FONT_FAMILY.BOLD}
        marginTop={Platform.OS === 'ios' ? 10 : 0}
        marginHorizontal={20}
      >
        {!!!tokensCost ? gameRoomStrings.free : convertNumberToStringWithComma(tokensCost)}
      </ButtonText>
      <CoinIcon source={coin} resizeMode="contain" />
    </ContainerTokensToPlay>
  );
};
export default TokenToPlay;