import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import GameCardButton from '../game-room/GameCardButton';
import { gameResultScreenStrings } from '../../stringConstants';
import { scale, scaleHeight, heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import SimpleButton from '../common/SimpleButton';
import { coin } from '../../../assets/images';

const TextContainer = styled.View`
  flex: ${({areTokenLow})=> !areTokenLow ? 1 : 0.5};;
  background-color: ${({areTokenLow})=>!areTokenLow?color.white:color.transparent};
  border-radius: 8;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: ${heightRatio > 1 ? scaleHeight(10) : scaleHeight(3)};
`;
const ButtonContentContainer = styled.View`
flex-direction : row
`
const CoinIcon = styled.Image`
  margin-horizontal: ${({ marginHorizontal }) => scale(marginHorizontal)};
  height: ${({ size }) => scale(size)};
  width: ${({ size }) => scale(size)};
`;
const ButtonWrapper = styled(SimpleButton)`
`;
const GameButtonContainer = styled.View`
  align-items:center;
  position: absolute;
  top: -${scaleHeight(50)};
  left: ${scale(10)};
  right: ${scale(10)};
`;

const PlayAgainButton = ({ label, tokensCost, isFree, onPress, areTokenLow, tokenAmount , localizedPrice ,...rest }) => {
  return (
    <>
      <TextContainer areTokenLow={areTokenLow}>
        {!areTokenLow && <Text allowFontScaling={false} fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XSMALL}>
          {label}
        </Text>}
      </TextContainer>
      <GameButtonContainer>
        {!areTokenLow ? <GameCardButton
          isFree={isFree}
          isLarge
          playLabel={gameResultScreenStrings.playAgain}
          tokensCost={tokensCost}
          onPress={onPress}
          testID="play-again-button"
          {...rest}
        />:
        <ButtonWrapper
        borderRadius={scale(50)}
        height={scale(80)}
        width={271}
        onPress={onPress}
        >
          <ButtonContentContainer>
            <Text 
              size={SIZE.LARGE} 
              color={color.darkNavyBlue} 
              fontFamily={FONT_FAMILY.BOLD} 
              marginTop={Platform.OS==="android"? 0 : 5}>{localizedPrice}</Text>
              <CoinIcon source={coin} size={25} marginHorizontal={8} resizeMode="contain" />
            <Text
            size={SIZE.LARGE} 
            color={color.darkNavyBlue} 
            fontFamily={FONT_FAMILY.BOLD} 
            marginTop={Platform.OS==="android"? 0 : 5}>{tokenAmount}</Text>
          </ButtonContentContainer>
        </ButtonWrapper>
        }
      </GameButtonContainer>
    </>
  );
};

PlayAgainButton.defaultProps = {
  isFree: false,
  label: gameResultScreenStrings.prizeWaitingInVault
};

PlayAgainButton.propTypes = {
  tokensCost: PropTypes.number.isRequired,
  isFree: PropTypes.bool,
  label: PropTypes.string,
  localizedPrice:PropTypes.number,
  tokenAmount:PropTypes.number,
  onPress: PropTypes.func.isRequired
};

export default PlayAgainButton;
