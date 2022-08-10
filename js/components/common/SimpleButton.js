
import React from 'react';
import styled from 'styled-components/native';
import { getWindowWidth, scale } from '../../platformUtils';
import { color } from '../../styles';
import PropTypes from 'prop-types';
const cardWidth = (getWindowWidth() - scale(15));

const SimpleButton = ({ children, height, width, disabled, onPress, marginTop, backgroundColor, borderColor , borderWidth ,borderRadius,disableBackgroundColor,...props }) => {

    const ButtonWrapper = styled.TouchableOpacity`
        height: ${({ height }) => height};
        width:  ${width || cardWidth * 0.24};
        margin-top: ${marginTop || 0};
        border-radius: ${({ borderRadius }) => borderRadius};
        align-items: center;
        justify-content: center;
        background-color: ${({ disabled, backgroundColor , disableBackgroundColor}) => disabled ? disableBackgroundColor : backgroundColor};
        ${({borderColor})=> borderColor && `border-color:${borderColor}`}
        ${({borderWidth})=> borderWidth && `border-width:${borderWidth}`}
    `;

    return (
        <ButtonWrapper
            onPress={onPress}
            height={height}
            disabled={disabled}
            backgroundColor={backgroundColor}
            borderRadius={borderRadius}
            borderColor={borderColor}
            borderWidth={borderWidth}
            disableBackgroundColor={disableBackgroundColor}
        >
            {children}
            </ButtonWrapper>

    )

}
SimpleButton.propTypes = {
    height: PropTypes.number,
    children: PropTypes.node,
    disabled:PropTypes.bool,
    borderColor:PropTypes.string,
    borderWidth:PropTypes.number,
    backgroundColor: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    borderRadius:PropTypes.number,
    borderColor:PropTypes.string

};

SimpleButton.defaultProps = {
    backgroundColor:color.white,
    borderRadius:30,    
    borderColor:null,
    borderWidth:null,
    disableBackgroundColor:color.watchAdDisableBtn,

};


export default SimpleButton;
