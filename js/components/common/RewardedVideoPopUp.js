import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import StampPopUp from '../common/StampPopUp';
import { BUTTON_COLOR_SCHEME } from '../common/Button';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import { scaleHeight } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings } from '../../stringConstants';
import { howtoBackgroundPopUp, plusTokensNew } from '../../../assets/images';
import SimpleButton from '../common/SimpleButton';

const PopUpContentView = styled.View`
  align-items: center;
  justify-content: center;
`;
const TextWrapper = styled(Text)`
  margin-top: ${({ marginTop }) => (marginTop ? scaleHeight(marginTop) : 0)};
  margin-bottom: ${({ marginBottom }) => (marginBottom ? scaleHeight(marginBottom) : 0)};
`;
const ButtonWrapper = styled(SimpleButton)`
`;
const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;
const ButtonText = styled(Text)`
  margin-top: ${Platform.OS === 'ios' ? scaleHeight(5) : 0};
`;

const RewardedVideoPopUp = ({ isVisible, onPress,tokens }) => {
  return (
    <StampPopUp
      isVisible={isVisible}
      backgroundImage={howtoBackgroundPopUp}
      stampIcon={plusTokensNew}
      >
      <PopUpContentView>
        <TextWrapper fontFamily={FONT_FAMILY.BOLD} size={SIZE.XXXLARGE} color={color.white} alignCenter>
          {popUpStrings.CONGRATS}
        </TextWrapper>
        <TextWrapper
          marginTop={10}
          marginBottom={10}
          fontFamily={FONT_FAMILY.MEDIUM}
          size={SIZE.SMALL}
          color={color.white}
          alignCenter
        >
          {popUpStrings.rewardedVideo(tokens)}
        </TextWrapper>
        <ButtonWrapper
          borderRadius={44}
          marginTop={15}
          height={53}
          width={200}
          onPress={onPress}
        >
          <ButtonContentContainer>
            <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.darkNavyBlue} size={SIZE.LARGE}>
              {popUpStrings.awesome}
            </ButtonText>
          </ButtonContentContainer>
         </ButtonWrapper>
        </PopUpContentView>
      </StampPopUp> 
  );
};

RewardedVideoPopUp.propTypes = {
  onPress: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  tokens: PropTypes.number.isRequired,
};

export default RewardedVideoPopUp;
