import React from 'react';
import styled from 'styled-components/native';
import PropTypes, { number } from 'prop-types';
import { Platform } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import Text, { SIZE } from '../common/Text';
import Button, { BUTTON_COLOR_SCHEME } from '../common/Button';
import { scale, scaleHeight, heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import { gameRoomStrings } from '../../stringConstants';

const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  margin-top: ${({ marginTop }) => (heightRatio > 1 ? scaleHeight(marginTop) : scaleHeight(marginTop / heightRatio))};
  margin-horizontal: ${scale(5)};
`;

const TakeRewardButton = ({
  isDisabled,
  isLarge,
  onPress,
  label,
  isGradient,
  onLayout,
  currentRewardIndex,
  ...rest
}) => {
  const buttonHeight = isLarge ? 80 : 48;
  const buttonWidth = isLarge ? 271 : 140;
  const buttonTextSize = isLarge ? SIZE.XLARGE : SIZE.SMALL;

  return (
    <>
      <Button
        testID="play-button"
        borderRadis={53}
        height={buttonHeight}
        width={buttonWidth}
        // gardientHighlight={isGradient}
        theme={currentRewardIndex === 0 ? BUTTON_COLOR_SCHEME.GREEN : BUTTON_COLOR_SCHEME.PURPLE}
        onPress={onPress}
        onLayout={onLayout}
        {...rest}
      >
        <ButtonContentContainer>
          <ButtonText size={buttonTextSize} color={color.white} marginTop={Platform.OS === 'android' ? 0 : 5}>
            {label}
          </ButtonText>
        </ButtonContentContainer>
      </Button>
    </>
  );
};

TakeRewardButton.propTypes = {
  onLayout: PropTypes.func,
  isLarge: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string,
  currentRewardIndex: number,
  isGradient: PropTypes.bool
};

TakeRewardButton.defaultProps = {
  isLarge: false,
  isDisabled: false,
  label: gameRoomStrings.play,
  onLayout: () => {},
  currentRewardIndex: 0,
  isGradient: false
};

export default TakeRewardButton;
