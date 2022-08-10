import React, {  } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { GradientButtonColor } from '../../styles';
import { scaleHeight, scaleWidth } from '../../platformUtils';


export const BUTTON_COLOR_SCHEME = {
    GREY: 'GREY',
    BLUE: 'BLUE',
};
const ViewContainer = styled.View`

  justify-content: center;
  align-items: center;
  margin-horizontal: ${scaleHeight(5)};
  margin-vertical: ${scaleWidth(5)};
`;

const OuterView = styled.View`
  align-items: center;
  ${({ colorScheme }) => colorScheme && `background-color : ${colorScheme}`};
  border-radius: ${({ borderRadius }) => scaleHeight(borderRadius)};
  height: ${({ height }) => height};
  justify-content: center;
  width: ${({ width }) => width};
`;

const HighlightView = styled.View`
  align-items: center;
  background-color: ${({ colorScheme }) => colorScheme};
  border-radius: ${({ borderRadius }) => scaleHeight(borderRadius)};
  height: ${({ height }) => height - 5};
  justify-content: center;
  width: ${({ width }) => width - 5};
`;


const InnerView = styled(LinearGradient)`
  align-items: center;
  border-radius: ${({ borderRadius }) => scaleHeight(borderRadius + 10)};
  height: ${({ height }) => height - 7};
  justify-content: center;
  margin-top: ${scaleHeight(4)};
  width: ${({ width }) => width - 5};
`;


const ViewGradient = ({
    children,
    theme,
    height,
    width,
    borderRadius,
    onLayout,
    ...rest
}) => {
    const COLOR_SCHEME = GradientButtonColor[theme];



    return (
        <ViewContainer
            onLayout={onLayout}

        >
            <OuterView
              
                {...rest} colorScheme={COLOR_SCHEME.outer}

                borderRadius={borderRadius} height={height} width={width}
            >

                <HighlightView
                    colorScheme={COLOR_SCHEME.highlight}
                    borderRadius={borderRadius}
                    height={height}
                    width={width}
                    gardientHighlight
                >

                    <InnerView colors={COLOR_SCHEME.inner}
                        // start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 

                        borderRadius={borderRadius} height={height} width={width}>
                        {children}
                    </InnerView>
                </HighlightView>

            </OuterView>
        </ViewContainer>
    );
};

ViewGradient.defaultProps = {
    height: 55,
    borderRadius: 40,
    theme: BUTTON_COLOR_SCHEME.NORMAL,
    width: 160,
    onLayout: () => { },
};

ViewGradient.propTypes = {
    onLayout: PropTypes.func,
    borderRadius: PropTypes.number,
    children: PropTypes.node.isRequired,
    height: PropTypes.number,
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

export default ViewGradient;
