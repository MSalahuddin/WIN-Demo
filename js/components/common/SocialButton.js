import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import Text, { FONT_FAMILY } from './Text';
import { scale } from '../../platformUtils';

const ButtonContainer = styled.TouchableOpacity`
  align-items: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: ${scale(24)};
  flex-direction: row;
  height: ${scale(44)};
  justify-content: center;
  width: ${scale(300)};
`;

const ButtonText = styled(Text)`
  line-height: ${scale(24)};
  margin-left: ${scale(8)};
`;

const Icon = styled.Image`
  height: ${scale(19)};
  width: ${scale(19)};
`;

const SocialButton = ({ backgroundColor, buttonText, fontColor, fontFamily, media, onPress }) => {
  return (
    <ButtonContainer testID="button" backgroundColor={backgroundColor} onPress={onPress}>
      <Icon source={media} resizeMode="contain" />
      <ButtonText color={fontColor} fontFamily={fontFamily}>
        {buttonText}
      </ButtonText>
    </ButtonContainer>
  );
};

SocialButton.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  fontColor: PropTypes.string.isRequired,
  fontFamily: PropTypes.string,
  media: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]).isRequired,
  onPress: PropTypes.func.isRequired
};

SocialButton.defaultProps = {
  fontFamily: FONT_FAMILY.ROBOTO_MEDIUM
};

export default SocialButton;
