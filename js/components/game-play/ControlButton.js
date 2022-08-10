import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {Platform} from 'react-native';
import styled from 'styled-components/native';

import { scale } from '../../platformUtils';
import {
  downButtonActive,
  downButtonInctive,
  grabMainButton,
  leftButtonActive,
  leftButtonInctive,
  mainButtonInactive,
  playMainButton,
  rightButtonActive,
  rightButtonInctive,
  upButtonActive,
  upButtonInctive
} from '../../../assets/images';

export const CONTROL_BUTTON_TYPE = {
  DOWN: 'DOWN',
  GRAB: 'GRAB',
  LEFT: 'LEFT',
  MAIN_INACTIVE: 'MAIN_INACTIVE',
  PLAY: 'PLAY',
  RIGHT: 'RIGHT',
  UP: 'UP'
};

export const CONTROL_BUTTON_SIZE = {
  SMALL: 'SMALL',
  LARGE: 'LARGE',
  XLARGE: 'XLARGE'
};

const getButtonWidth = size => {
  const { LARGE, XLARGE } = CONTROL_BUTTON_SIZE;
  if (size === LARGE) {
    return scale(Platform.OS==='android'?100:110);
  } 
  if (size === XLARGE){
    return scale(170);
  }
  return scale(Platform.OS==='android'?72: 75);
};

const getImageRatio = type => {
  // Direction button and main button have different ratios
  // Size for direction control is width: 65, height 48 (@1x)
  // Size for main control (play, grab) is width: 100, height: 78 (@1x)
  const { MAIN_INACTIVE, GRAB, PLAY } = CONTROL_BUTTON_TYPE;
  switch (type) {
    case PLAY:
    case GRAB:
    case MAIN_INACTIVE:
      return 0.78;
    default:
      return 38 / 65;
  }
};

const ButtonTouchableArea = styled.TouchableWithoutFeedback``;

const ButtonContainer = styled.View`
  padding-horizontal: ${scale(1)};
  padding-vertical: ${scale(1)};
`;

const ButtonBackground = styled.ImageBackground`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
`;
const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const ControlButton = ({ type, size, disabled, pressInAction, pressOutAction }) => {
  const [isButtonDown, setIsButtonDown] = useState(false);
  const previousDisabled = usePrevious(disabled);

  const handleOnPressIn = () => {
    if (!disabled) {
      setIsButtonDown(true);
      pressInAction();
    }
  };
  const handleOnPressOut = () => {
    if (!disabled) {
      setIsButtonDown(false);
      if (pressOutAction) {
        pressOutAction();
      }
    }
  };

  useEffect(() => {
    if (previousDisabled === true && disabled === false) {
      setIsButtonDown(false);
    }
  }, [disabled, previousDisabled]);

  const getButtonImage = isDown => {
    const { DOWN, GRAB, LEFT, PLAY, RIGHT, UP } = CONTROL_BUTTON_TYPE;
    const shouldShowDown = disabled || isDown;
    switch (type) {
      case DOWN:
        return shouldShowDown ? downButtonInctive : downButtonActive;
      case UP:
        return shouldShowDown ? upButtonInctive : upButtonActive;
      case LEFT:
        return shouldShowDown ? leftButtonInctive : leftButtonActive;
      case RIGHT:
        return shouldShowDown ? rightButtonInctive : rightButtonActive;
      case PLAY:
        return shouldShowDown ? mainButtonInactive : playMainButton;
      case GRAB:
        return shouldShowDown ? mainButtonInactive : grabMainButton;
      default:
        return mainButtonInactive;
    }
  };

  const buttonWidth = getButtonWidth(size);
  const buttonHeight = getImageRatio(type) * buttonWidth;
  return (
    <ButtonTouchableArea onPressIn={handleOnPressIn} onPressOut={handleOnPressOut} disabled={disabled}>
      <ButtonContainer>
        <ButtonBackground
          source={getButtonImage(isButtonDown)}
          type={type}
          size={size}
          width={buttonWidth}
          height={buttonHeight}
          resizeMode="contain"
        />
      </ButtonContainer>
    </ButtonTouchableArea>
  );
};

ControlButton.defaultProps = {
  disabled: false,
  pressOutAction: () => {},
  size: CONTROL_BUTTON_SIZE.SMALL
};

ControlButton.propTypes = {
  disabled: PropTypes.bool,
  pressInAction: PropTypes.func.isRequired,
  pressOutAction: PropTypes.func,
  type: PropTypes.oneOf([
    CONTROL_BUTTON_TYPE.DOWN,
    CONTROL_BUTTON_TYPE.GRAB,
    CONTROL_BUTTON_TYPE.LEFT,
    CONTROL_BUTTON_TYPE.MAIN_INACTIVE,
    CONTROL_BUTTON_TYPE.PLAY,
    CONTROL_BUTTON_TYPE.RIGHT,
    CONTROL_BUTTON_TYPE.UP
  ]).isRequired,
  size: PropTypes.oneOf([CONTROL_BUTTON_SIZE.SMALL, CONTROL_BUTTON_SIZE.LARGE])
};

export default ControlButton;
