import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { color, buttonColor } from '../../styles';
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
  WHITE: 'WHITE',
  BLUE: 'BLUE',
};
const ButtonContainer = styled.View`

  justify-content: center;
  align-items: center;
  margin-horizontal: ${scaleHeight(5)};
  margin-vertical: ${scaleWidth(5)};
 `;

const ButtonOuterView = styled.TouchableOpacity`
  align-items: center;
  ${({ colorScheme }) => colorScheme && `background-color : ${colorScheme}`};
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
const ButtonHighlightGradient = styled(LinearGradient)`
align-items: center;
border-radius: ${({ borderRadius }) => scaleHeight(borderRadius)};
height: ${({ height }) => scaleHeight(height)};
justify-content: center;
width: ${({ width }) => scaleWidth(width)};
`;

const ButtonInnerView = styled.View`
  align-items: center;
  ${({ colorScheme }) => colorScheme && `background-color : ${colorScheme}`};
  border-radius: ${({ borderRadius }) => scaleHeight(borderRadius + 10)};
  height: ${({ height }) => scaleHeight(height - 7)};
  justify-content: center;
  margin-top: ${scaleHeight(4)};
  width: ${({ width }) => scaleWidth(width - 3)};
`;
const ButtonInnerGradientView = styled(LinearGradient)`
  align-items: center;
  ${({ colorScheme }) => colorScheme && `border-color : red`};
  border-radius: ${({ borderRadius }) => scaleHeight(borderRadius + 10)};
  height: ${({ height }) => scaleHeight(height - 5)};
  justify-content: center;
  border-width:1;
  margin-top: ${scaleHeight(3)};
  width: ${({ width }) => scaleWidth(width - 1)};
`;

const Button = ({
  children,
  onPress,
  theme,
  height,
  disabled,
  width,
  borderRadius,
  onLayout,
  gardient,
  gradientColor,
  gardientHighlight,
  ...rest
}) => {
  const { playSoundEffect } = useContext(BackgroundMusicContext);
  const COLOR_SCHEME = buttonColor[theme];

  const playButtonSound = () => {
    if (width > scaleWidth(160)) {
      if (theme === BUTTON_COLOR_SCHEME.GREEN || theme === BUTTON_COLOR_SCHEME.BLUE) {
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
    <ButtonContainer
      onLayout={onLayout}

    >
      <ButtonOuterView
        testID="button"
        activeOpacity={disabled ? 1 : 0.5}
        onPress={() => {
          if (!disabled) {
            handleOnPress();
          }
        }}
        {...rest} colorScheme={gardient ? null : COLOR_SCHEME.outer}

        borderRadius={borderRadius} height={height} width={width}
      >
        {gardient ? <ButtonHighlightGradient
          colors={gradientColor}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          borderRadius={borderRadius}
          height={height}
          width={width}
        >
          <ButtonInnerView borderRadius={borderRadius} height={height} width={width}>
            {children}
          </ButtonInnerView>
        </ButtonHighlightGradient> :
          <ButtonHighlightView
            colorScheme={COLOR_SCHEME.highlight}
            borderRadius={borderRadius}
            height={height}
            width={width}
            gardientHighlight
          >
            {gardientHighlight ?
              <ButtonInnerGradientView colorScheme={COLOR_SCHEME.highlight} colors={gradientColor} borderRadius={borderRadius} height={height} width={width}>
                {children}
              </ButtonInnerGradientView>
              : <ButtonInnerView colorScheme={COLOR_SCHEME.inner} borderRadius={borderRadius} height={height} width={width}>
                {children}
              </ButtonInnerView>}
          </ButtonHighlightView>
        }
      </ButtonOuterView>
    </ButtonContainer>
  );
};

Button.defaultProps = {
  disabled: false,
  height: 55,
  borderRadius: 40,
  onPress: () => { },
  theme: BUTTON_COLOR_SCHEME.NORMAL,
  width: 160,
  onLayout: () => { },
  gardient: false,
  gardientHighlight: false,
  gradientColor: [color.fuchsiaBlue, color.heliotrope]
};

Button.propTypes = {
  onLayout: PropTypes.func,
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
    BUTTON_COLOR_SCHEME.WHITE,
    BUTTON_COLOR_SCHEME.BLUE
  ]),
  width: PropTypes.number,
  gardient: PropTypes.bool,
  gardientHighlight: PropTypes.bool,
  gradientColor: PropTypes.node
};

export default Button;
