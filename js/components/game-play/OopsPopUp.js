import React from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { howtoBackgroundPopUp, unavailable } from '../../../assets/images';
import { scale, scaleHeight } from '../../platformUtils';
import { popUpStrings } from '../../stringConstants';
import { color } from '../../styles';
import { BUTTON_COLOR_SCHEME } from '../common/Button';
import StampPopUp from '../common/StampPopUp';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import TextButton from '../common/TextButton';
import SimpleButton from '../common/SimpleButton';

const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;
const ContentContainer = styled.View`
  align-items: center;
  justify-content: center;
  width:${scale(220)}
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

const OopsPopUp = ({ isVisible, onConfirmPress, onCancelPress,onErrorMessage }) => {



    return (
            <StampPopUp isVisible={isVisible} backgroundImage={howtoBackgroundPopUp} stampIcon={unavailable}>
                <HeadingText alignCenter size={SIZE.XXXLARGE} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
                    {popUpStrings.oops}
                </HeadingText>
                <ContentContainer>
                <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
                    {onErrorMessage}
                </Text></ContentContainer>
                <ButtonWrapper
                    testID="popup-button"
                    borderRadius={44}
                    marginTop={25}
                    height={53}
                    width={200}
                    onPress={onConfirmPress}
                >
                    <ButtonContentContainer>
                        <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.darkNavyBlue} size={SIZE.SMALL}>
                            {popUpStrings.goBack}
                        </ButtonText>
                    </ButtonContentContainer>
                </ButtonWrapper>
                <TextButtonWrapper color={color.white} isUnderlined={true} label={popUpStrings.contactSupport.toLowerCase()} onPress={onCancelPress}/>
            </StampPopUp>
          )          
};

OopsPopUp.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onConfirmPress: PropTypes.func.isRequired,
    onCancelPress: PropTypes.func.isRequired,
}

export default OopsPopUp;
