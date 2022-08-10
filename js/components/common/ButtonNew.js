import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { color } from '../../styles';
import { scaleHeight, scaleWidth, scale } from '../../platformUtils';
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
const ButtonContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-horizontal: ${scaleHeight(3)};
  margin-vertical: ${scaleWidth(3)};
  opacity:${({disabled}) => disabled ? 0.4 : 1}
`;

const ButtonOuterView = styled.TouchableOpacity`
  align-items: center;
  background-color : ${color.grayBlack};
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
  width: ${({ width }) => scaleWidth(width - 5)};
`;

const ButtonInnerView = styled.View`
  align-items: center;
  ${({ colorScheme }) => colorScheme && `background-color : ${colorScheme}`};
  border-radius: ${({ borderRadius }) => scaleHeight(borderRadius + 1)};
  height: ${({ height }) => scaleHeight(height - 7)};
  justify-content: center;
  margin-top: ${scaleHeight(0)};

  ${({ innerBorder }) => innerBorder && `border-color:${innerBorder}`}
  border-width:1;
  width: ${({ width }) => scaleWidth(width - 7)};
  flex-direction:row
`;
const Icon = styled.Image`
height:${scaleHeight(45)};
width:${scaleHeight(45)};
position:absolute;
z-index:10;
top:${({ iconTop }) => scale(iconTop)};
right:${({ iconRight }) => scale(iconRight)}
`;
const LeftIcon = styled.Image`
height:${scaleHeight(20)};
width:${scaleHeight(20)};
margin-top:${({ iconTop }) => scale(iconTop)};
margin-right:${({ iconRight }) => scale(iconRight)}
`;



const ButtonNew = ({
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
  outerColor,
  innerColor,
  innerBorder,
  icon,
  buttonColor,
  iconTop,
  iconRight,
  leftIcon,

  ...rest
}) => {
  const { playSoundEffect } = useContext(BackgroundMusicContext);

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
    <ButtonContainer
      onLayout={onLayout}
      disabled={disabled}
    >
      {icon && <Icon source={icon} iconTop={iconTop} iconRight={iconRight} />}
      <ButtonOuterView
        testID="button"
        activeOpacity={disabled ? 1 : 0.5}
        
        onPress={() => {
          if (!disabled) {
            handleOnPress();
          }
        }}
        {...rest} colorScheme={outerColor}
        borderRadius={8} height={height} width={width-1}>

        <ButtonHighlightView
          colorScheme={innerColor}
          borderRadius={5}
          height={height}
          width={width}
          gardientHighlight
        >
          <ButtonInnerView
            colorScheme={buttonColor}
            borderRadius={3}
            innerBorder={innerBorder}
            height={44}
            width={width-2} >
              {leftIcon && <LeftIcon source={leftIcon} iconTop={iconTop} iconRight={iconRight} />}
            {children}
          </ButtonInnerView>
        </ButtonHighlightView>

      </ButtonOuterView>
    </ButtonContainer>
  );
};

ButtonNew.defaultProps = {
  disabled: false,
  height: 55,
  borderRadius: 40,
  onPress: () => { },
  theme: BUTTON_COLOR_SCHEME.NORMAL,
  width: 160,
  onLayout: () => { },
  gardient: false,
  gardientHighlight: false,
  gradientColor: [color.fuchsiaBlue, color.heliotrope],
  icon: null,
  outerColor: null,
  innerColor: null,
  buttonColor: null,
  iconTop: null,
  iconRight: null,
};

ButtonNew.propTypes = {
  onLayout: PropTypes.func,
  disabled: PropTypes.bool,
  borderRadius: PropTypes.number,
  children: PropTypes.node.isRequired,
  innerBorder: PropTypes.string.isRequired,
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
  width: PropTypes.number,
  gardient: PropTypes.bool,
  gardientHighlight: PropTypes.bool,
  gradientColor: PropTypes.node,
  icon: PropTypes.string,
  outerColor: PropTypes.string,
  innerColor: PropTypes.string,
  buttonColor: PropTypes.string,
  iconTop: PropTypes.number,
  iconRight: PropTypes.number,
};

export default ButtonNew;
