import React from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { howtoBackgroundPopUp, wwIcon } from '../../../assets/images';
import { scale, scaleHeight } from '../../platformUtils';
import { commonStrings, popUpStrings } from '../../stringConstants';
import { color } from '../../styles';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import StampPopUp from './StampPopUp';
import Text, { FONT_FAMILY, SIZE } from './Text';
import TextButton from './TextButton';
import SimpleButton from './SimpleButton';

const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  margin-top: ${Platform.OS === 'ios' ? scaleHeight(5) : 0};
`;

const ButtonWrapper = styled(SimpleButton)`
`;

const TextButtonWrapper = styled(TextButton)`
  margin-top: ${scaleHeight(20)};
`;

const HeadingText = styled(Text)`
  margin-bottom: ${scaleHeight(15)};
`;

const HeadsUpPopUp = ({ isVisible, onConfirmPress, onCancelPress }) => {



    return (
            <StampPopUp isVisible={isVisible} backgroundImage={howtoBackgroundPopUp} stampIcon={wwIcon}>
                <HeadingText alignCenter size={SIZE.XXXLARGE} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
                    {popUpStrings.headsUp}
                </HeadingText>
                <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
                    {popUpStrings.HeadsUpText}
                </Text>
                <ButtonWrapper
                    testID="popup-button"
                    borderRadius={44}
                    marginTop={20}
                    height={53}
                    width={220}
                    onPress={onConfirmPress}
                >
                    <ButtonContentContainer>
                        <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.darkNavyBlue} size={SIZE.SMALL}>
                            {popUpStrings.confirmChanges}
                        </ButtonText>
                    </ButtonContentContainer>
                </ButtonWrapper>
                <TextButtonWrapper color={color.white} isUnderlined={false} label={commonStrings.cancel} onPress={onCancelPress}/>
            </StampPopUp>
          )          
};

HeadsUpPopUp.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onConfirmPress: PropTypes.func.isRequired,
    onCancelPress: PropTypes.func.isRequired,
}

export default HeadsUpPopUp;
