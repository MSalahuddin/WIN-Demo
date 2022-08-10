import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Text, { SIZE, FONT_FAMILY } from './Text';
import { scale } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings } from '../../stringConstants';
import {  howtoBackgroundPopUp, plusTokens } from '../../../assets/images';
import InstructionPopUpDark from './InstructionPopupdark';
import SimpleButton from './SimpleButton';
import { Platform } from 'react-native';

const BackdropTextWrapper = styled.View`
  align-items: center;
  margin-horizontal: ${scale(30)};
  margin-top:-50;
`;

const ButtonContentContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  text-align:center;
  align-items: center;
  top:${Platform.OS === 'android' ? 0 : 3}
`;

const BeforeClaimPopUp = ({
  isVisible,
  onPress,
  text
}) => {

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    setIsPopupVisible(isVisible)
  }, [isVisible])

  const claimReward = async () => onPress()

  return (
    <InstructionPopUpDark
      isVisible={isPopupVisible}
      bannerLabel={popUpStrings.CONGRATS}
      topIcon={plusTokens}
      backgroundImage={howtoBackgroundPopUp}
    >
      <BackdropTextWrapper>
        <Text alignCenter size={SIZE.XXXLARGE} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
          {popUpStrings.CONGRATS}
        </Text>
        <Text alignCenter size={SIZE.XSMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.white}>
          {text}
        </Text>
      </BackdropTextWrapper>
      <SimpleButton
            onPress={claimReward}
            marginTop={20}
            height={60}
            width={200}
          >
            <ButtonContentContainer>
              <ButtonText fontFamily={FONT_FAMILY.BOLD} size={SIZE.SMALL} color={color.navyBlue}>
                {popUpStrings.watchClaim}
              </ButtonText>
            </ButtonContentContainer>
          </SimpleButton>
    </InstructionPopUpDark>
  );
};

BeforeClaimPopUp.propTypes = {
  onPress: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

export default BeforeClaimPopUp;
