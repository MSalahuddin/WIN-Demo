import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import { buttonColor } from '../../styles';
import { scaleHeight, scaleWidth } from '../../platformUtils';
import { SOUNDS } from '../../soundUtils';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';

export const BUTTON_COLOR_SCHEME = {
  GREEN: 'GREEN',
  GREY: 'GREY',
  NORMAL_INVERTED: 'NORMAL_INVERTED',
  NORMAL: 'NORMAL',
  PURPLE: 'PURPLE',
  RED: 'RED',
  WHITE: 'WHITE'
};

const ButtonOuterView = styled.TouchableOpacity`
  align-items: center;
  background-color: ${({ colorScheme }) => colorScheme};
  border-radius: ${({ borderRadius }) => scaleHeight(borderRadius)};
  height: ${({ height }) => scaleHeight(height)};
  justify-content: center;
  width: ${({ width }) => scaleWidth(width)};
`;

const ButtonHighlightView = styled.View`
  align-items: center;
  background-color: ${({ colorScheme }) => colorScheme};
  border-radius: ${({ borderRadius }) => scaleHeight(borderRadius)};
  height: ${({ height }) => scaleHeight(height - 5)};
  justify-content: center;
  width: ${({ width }) => scaleWidth(width - 3)};
`;

const ButtonInnerView = styled.View`
  align-items: center;
  background-color: ${({ colorScheme }) => colorScheme};
  border-radius: ${({ borderRadius }) => scaleHeight(borderRadius + 10)};
  height: ${({ height }) => scaleHeight(height - 7)};
  justify-content: center;
  margin-top: ${scaleHeight(4)};
  width: ${({ width }) => scaleWidth(width - 3)};
`;

const NextButton = ({ children, onPress, theme, height, disabled, width, borderRadius, onLayout, ...rest }) => {
  const { playSoundEffect } = useContext(BackgroundMusicContext);
  const COLOR_SCHEME = buttonColor[theme];

  const playButtonSound = () => {
    if (width > scaleWidth(160)) {
      if (theme === BUTTON_COLOR_SCHEME.GREEN) {
        playSoundEffect(SOUNDS.GREEN_BUTTON);
      } else {
        playSoundEffect(SOUNDS.BLUE_BUTTON);
      }
    } else {
      playSoundEffect(SOUNDS.MINOR_BUTTON);
    }
  };

  const handleOnPress = () => {
    playButtonSound();
    onPress();
  };

  return (
      <ButtonOuterView  
      testID="button"
      activeOpacity={disabled ? 1 : 0.5}
      onPress={() => {
        if (!disabled) {
          handleOnPress();
        }
      }}
      {...rest} colorScheme={COLOR_SCHEME.outer} borderRadius={borderRadius} height={height} width={width}>
        <ButtonHighlightView
          colorScheme={COLOR_SCHEME.highlight}
          borderRadius={borderRadius}
          height={height}
          width={width}
        >
          <ButtonInnerView colorScheme={COLOR_SCHEME.inner} borderRadius={borderRadius} height={height} width={width}>
            {children}
          </ButtonInnerView>
        </ButtonHighlightView>
      </ButtonOuterView>
  );
};

NextButton.defaultProps = {
  disabled: false,
  height: 55,
  borderRadius: 40,
  onPress: () => {},
  theme: BUTTON_COLOR_SCHEME.NORMAL,
  width: 160,
  onLayout: () => {}
};

NextButton.propTypes = {
  onLayout:PropTypes.func,
  disabled: PropTypes.bool,
  borderRadius: PropTypes.number,
  children: PropTypes.node.isRequired,
  height: PropTypes.number,
  onPress: PropTypes.func,
  theme: PropTypes.oneOf([
    BUTTON_COLOR_SCHEME.GREEN,
    BUTTON_COLOR_SCHEME.GREY,
    BUTTON_COLOR_SCHEME.NORMAL_INVERTED,
    BUTTON_COLOR_SCHEME.NORMAL,
    BUTTON_COLOR_SCHEME.PURPLE,
    BUTTON_COLOR_SCHEME.RED,
    BUTTON_COLOR_SCHEME.WHITE
  ]),
  width: PropTypes.number
};

export default NextButton;
