import React from 'react';
import styled from 'styled-components/native';
import { TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';

import { color } from '../../styles';
import { scale } from '../../platformUtils';

const StyledDot = styled.View`
    background-color: ${({ dotColor }) => dotColor};
    width: ${({ size, isActive}) => isActive? scale(size * 4 / 3) :scale(size)};
    height: ${({ size, isActive }) => isActive? scale(size * 4 / 3) :scale(size)};
    border-radius: ${({ size, isActive }) => isActive?  scale(size * 2 / 3) : scale(size/2)};
    opacity: ${({ isActive }) => isActive? 1 : 0.5};
    margin-horizontal: ${({ size }) => size / 3};
    shadow-color: ${({ dotColor }) => dotColor};
    shadow-offset: 1px 1px;
    shadow-opacity: 1;
    shadow-radius: ${({ size }) => scale(size/3)};
`;

const Dot = ({ size, dotColor, isActive, onPress }) => (
    <TouchableWithoutFeedback onPress={onPress}>
        <StyledDot size={size} dotColor={dotColor} isActive={isActive} />
    </TouchableWithoutFeedback>
);

Dot.defaultProps ={
    size: 12,
    dotColor: color.white,
    isActive: false,
    onPress: () => {}
}

Dot.propTypes  ={
    size: PropTypes.number,
    dotColor: PropTypes.string,
    isActive: PropTypes.bool,
    onPress: PropTypes.func
}

export default Dot;