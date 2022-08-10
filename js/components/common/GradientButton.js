import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { color, buttonColor, GradientButtonColor } from '../../styles';
import { scaleHeight, scaleWidth } from '../../platformUtils';
import { SOUNDS } from '../../soundUtils';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';

export const BUTTON_COLOR_SCHEME = {
    GREY: 'GREY',
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
  height: ${({ height }) => height};
  justify-content: center;
  width: ${({ width }) =>width};
`;

const ButtonHighlightView = styled.View`
  align-items: center;
  background-color: ${({ colorScheme }) => colorScheme};
  border-radius: ${({ borderRadius }) => scaleHeight(borderRadius)};
  height: ${({ height }) => height-5};
  justify-content: center;
  width: ${({ width }) => width-5};
`;


const ButtonInnerView = styled(LinearGradient)`
  align-items: center;
  border-radius: ${({ borderRadius }) => scaleHeight(borderRadius + 10)};
  height: ${({ height }) => height-7};
  justify-content: center;
  margin-top: ${scaleHeight(4)};
  width: ${({ width }) => width-5};
`;


const ButtonGradient = ({
    children,
    onPress,
    theme,
    height,
    disabled,
    width,
    borderRadius,
    onLayout,
    ...rest
}) => {
    const { playSoundEffect } = useContext(BackgroundMusicContext);
    const COLOR_SCHEME = GradientButtonColor[theme];

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
                {...rest} colorScheme={COLOR_SCHEME.outer}

                borderRadius={borderRadius} height={height} width={width}
            >
                 
                    <ButtonHighlightView
                        colorScheme={COLOR_SCHEME.highlight}
                        borderRadius={borderRadius}
                        height={height}
                        width={width}
                        gardientHighlight
                    >
                      
                             <ButtonInnerView   colors={COLOR_SCHEME.inner}
                            // start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                            
                            borderRadius={borderRadius} height={height} width={width}>
                                {children}
                            </ButtonInnerView>
                    </ButtonHighlightView>
                
            </ButtonOuterView>
        </ButtonContainer>
    );
};

ButtonGradient.defaultProps = {
    disabled: false,
    height: 55,
    borderRadius: 40,
    onPress: () => { },
    theme: BUTTON_COLOR_SCHEME.NORMAL,
    width: 160,
    onLayout: () => { },
    };

ButtonGradient.propTypes = {
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
    gradientColor: PropTypes.node
};

export default ButtonGradient;
