import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import {Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import Button, { BUTTON_COLOR_SCHEME } from '../common/Button';
import { scale, scaleHeight, heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import { coin } from '../../../assets/images';
import { gameRoomStrings } from '../../stringConstants';
import { convertNumberToStringWithComma } from '../../utils';

const OverlayButtonContainer = styled.View`
  position: absolute;
  right: ${scale(-5)};
  top: ${({ top }) => scaleHeight(top)};
`;

const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const TextContainer = styled.View`
  justify-content: center;
`;

const ButtonText = styled(Text)`
  margin-top: ${({ marginTop }) => (heightRatio > 1 ? scaleHeight(marginTop) : scaleHeight(marginTop / heightRatio))};
  margin-horizontal: ${scale(5)};
`;

const CoinIcon = styled.Image`
  margin-horizontal: ${({ marginHorizontal }) => scale(marginHorizontal)};
  height: ${({ size }) => scale(size)};
  width: ${({ size }) => scale(size)};
`;

const RedStrikeLine = styled.View`
  border-bottom-width: ${scale(2)};
  border-color: ${color.pinkRed};
  height: 1;
  position: absolute;
  width: ${({ width }) => `${width}`};
`;
const PlayButton = styled.View`
width :60%;
align-self:flex-end;

`;
const PlayButtonContainer = styled(LinearGradient)`
border-bottom-right-radius:10;
padding-vertical:${scale(5)};
height:${scale(39)}
`;

const GameCardButton = ({ isDisabled, isLarge, isFree, isMachine, isGameVIP, tokensCost, onPress, playLabel,
  gameCard,
  isGradient, 
  onLayout, ...rest }) => {
  const buttonHeight = isLarge ? 80 : 48;
  const buttonWidth = isLarge ? 271 : 140;
  const buttonTextSize = isLarge ? SIZE.XLARGE : SIZE.SMALL;
  const iconSize = isLarge ? 40 : 29;
  const iconMarginHorizontal = isLarge ? 8 : 5;

  const renderOverlayButton = () => {
    let overlayButtonHeight = 25;
    let overlayButtonWidth = isFree ? 65 : 140;
    let borderRadius = isFree ? 40 : 24;
    let marginTop =Platform.OS === "android"? -3 : 2;
    let top = -25;
    const buttonText = isMachine ? gameRoomStrings.play : isFree ? gameRoomStrings.free : gameRoomStrings.becomeVip;
    const theme = isFree ? BUTTON_COLOR_SCHEME.RED : BUTTON_COLOR_SCHEME.PURPLE;

    if (isLarge) {
      borderRadius = isFree ? 53 : 83;
      overlayButtonWidth = isFree ? 74 : 132;
      overlayButtonHeight = 35;
      marginTop =Platform.OS === "android"? 0 : 5;
      top = -28;
    }

    return (
      <OverlayButtonContainer top={top}>
        <Button
          testID="overlay-button"
          borderRadius={borderRadius}
          height={overlayButtonHeight}
          width={overlayButtonWidth}
          theme={theme}
          onPress={onPress}
        >
          <ButtonText color={color.white} fontFamily={FONT_FAMILY.BOLD_ITALIC} size={SIZE.SMALL} marginTop={marginTop}>
            {buttonText}
          </ButtonText>
        </Button>
      </OverlayButtonContainer>
    );
  };

  return (
    <>
   {!gameCard && <Button
    testID="play-button"
    borderRadis={53}
    height={buttonHeight}
    width={buttonWidth}
    gardientHighlight={isGradient}
                
    gradientColor={[color.gradientLightBlue,color.gradientDarkBlue,color.bottomNavColor3]}
    theme={isGradient?BUTTON_COLOR_SCHEME.WHITE:BUTTON_COLOR_SCHEME.GREEN}
    onPress={onPress}
    onLayout={onLayout}
    {...rest}
  >
    <ButtonContentContainer>
      <ButtonText size={buttonTextSize} color={color.white} marginTop={Platform.OS==="android"? 0 : 5}>
        {playLabel}
      </ButtonText>
      <CoinIcon source={coin} size={iconSize} marginHorizontal={iconMarginHorizontal} resizeMode="contain" />
      <TextContainer>
        <ButtonText 
          size={buttonTextSize} 
          color={color.white} 
          fontFamily={FONT_FAMILY.BOLD} 
          marginTop={Platform.OS==="android"? 0 : 5}
        >
          {convertNumberToStringWithComma(tokensCost)}
        </ButtonText>
        {isDisabled && <RedStrikeLine width="85%" />}
      </TextContainer>
      {isFree && <RedStrikeLine width={isLarge ? '65%' : '85%'} />}
    </ButtonContentContainer>
    {(isDisabled || isFree) && renderOverlayButton()}
  </Button>
  }
    {gameCard && <PlayButton
      {...rest}
    >
      <PlayButtonContainer
       start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
         colors={[color.gameCardGradient1,color.gameCardGradient2]}
      >
      <ButtonContentContainer>
        {/* <ButtonText size={buttonTextSize} color={color.white} marginTop={Platform.OS==="android"? 0 : 5}>
          {playLabel}
        </ButtonText> */}
         <TextContainer>
          <ButtonText 
            size={SIZE.LARGE} 
            color={color.white} 
            fontFamily={FONT_FAMILY.BOLD} 
            marginTop={Platform.OS==="android"? 0 : 5}
          >
            {isMachine ? gameRoomStrings.play?.toUpperCase() : isFree?gameRoomStrings.free:convertNumberToStringWithComma(tokensCost)}
            
          </ButtonText>
          </TextContainer>
        {!isFree && <CoinIcon source={coin} size={25} marginHorizontal={iconMarginHorizontal} resizeMode="contain" />}
     
      </ButtonContentContainer>
      </PlayButtonContainer>
    </PlayButton>}
    </>
  );
};

GameCardButton.propTypes = {
  onLayout:PropTypes.func,
  isLarge: PropTypes.bool,
  isFree: PropTypes.bool,
  isMachine: PropTypes.bool,
  isGameVIP: PropTypes.bool,
  isDisabled: PropTypes.bool,
  tokensCost: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  playLabel: PropTypes.string,
  gameCard:PropTypes.bool,
  isGradient:PropTypes.bool
};

GameCardButton.defaultProps = {
  isLarge: false,
  isFree: false,
  isMachine: false,
  isGameVIP: false,
  isDisabled: false,
  playLabel: gameRoomStrings.play,
  onLayout: () => {} ,
  gameCard:false,
  isGradient:false
};

export default GameCardButton;
