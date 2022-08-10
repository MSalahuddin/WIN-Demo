import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import { color as StyleColor, hitSlop } from '../../styles';
import { scale } from '../../platformUtils';

export const ARROW_DIRECTION = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP: 'UP',
  DOWN: 'DOWN'
};

// The following unnecessary destruction is to address a eslint issue
// Expected newline after ":" with a    declaration-colon-newline-after multi-line declaration
const { transparent } = StyleColor;
const StyledArrow = styled.View`
  width: 0;
  height: 0;
  border-width: ${({ size }) => scale(size)};
  border-style: solid;
  border-radius: ${scale(2)};
  border-top-color: ${({ color, arrowDirection }) => (arrowDirection === ARROW_DIRECTION.DOWN ? color : transparent)};
  border-bottom-color: ${({ color, arrowDirection }) => (arrowDirection === ARROW_DIRECTION.UP ? color : transparent)};
  border-left-color: ${({ color, arrowDirection }) => (arrowDirection === ARROW_DIRECTION.RIGHT ? color : transparent)};
  border-right-color: ${({ color, arrowDirection }) => (arrowDirection === ARROW_DIRECTION.LEFT ? color : transparent)};
`;

const Arrow = ({ arrowDirection, color, size, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={hitSlop(20, 20)} testID="arrow">
      <StyledArrow arrowDirection={arrowDirection} color={color} size={size} />
    </TouchableOpacity>
  );
};

Arrow.defaultProps = {
  color: StyleColor.black,
  arrowDirection: ARROW_DIRECTION.DOWN,
  size: 8,
  onPress: () => {}
};

Arrow.propTypes = {
  arrowDirection: PropTypes.oneOf([
    ARROW_DIRECTION.UP,
    ARROW_DIRECTION.DOWN,
    ARROW_DIRECTION.LEFT,
    ARROW_DIRECTION.RIGHT
  ]),
  color: PropTypes.string,
  size: PropTypes.number,
  onPress: PropTypes.func
};

export default Arrow;
