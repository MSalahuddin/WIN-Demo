import React, { useEffect, useState } from 'react';
import { SafeAreaView, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import { wwIcon, howtoBackgroundPopUp } from '../../../assets/images';
import { scaleHeight, scaleWidth } from '../../platformUtils';
import { commonStrings } from '../../stringConstants';
import { color } from '../../styles';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import Text, { FONT_FAMILY, SIZE } from './Text';



const StyledModal = styled(Modal)`
  align-items: center;
  background-color: ${color.popupBlack};
  justify-content: center;
  margin: 0;
`;

const WrapperContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 320px;
`;

const BackdropTextWrapper = styled.ImageBackground`
  height: 388px;
  align-items: center;
  justify-content: center;
  padding-horizontal: ${scaleWidth(30)};
  shadow-radius: 2px;
`;

const Icon = styled.Image`
  height: 123;
  width: 123;
  z-index: 1;
  position: absolute;
  top: ${({ top }) => top - 65};
  `;

const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  margin-top: ${Platform.OS === 'ios' ? scaleHeight(7) : 0};
`;

const ButtonWrapper = styled(Button)`
  margin-top: ${({ marginTop }) => scaleHeight(marginTop)};
`;

const TextContainer = styled.View`
  margin-bottom:25px;
`;


const HowToPopUp = ({ isVisible, onGotItPress, helpText }) => {

  const [position, setPosition] = useState(0);

  useEffect(() => {
  }, []);
  return (
    <>
      <SafeAreaView>
        <StyledModal isVisible={isVisible}>
          <Icon top={position} source={wwIcon} />
          <WrapperContainer
            onLayout={event => {
              const { y } = event.nativeEvent.layout;
              setPosition(y)
            }} >
            <BackdropTextWrapper
              source={howtoBackgroundPopUp}
              resizeMode='stretch'
            >
              <TextContainer>
                <Text alignCenter size={SIZE.LARGEST} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
                  {commonStrings.howToPlay}
                </Text>
              </TextContainer>


              <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
                {helpText && helpText}
              </Text>
              <ButtonWrapper
                testID="popup-button"
                borderRadius={44}
                marginTop={20}
                height={48}
                width={200}
                theme={BUTTON_COLOR_SCHEME.WHITE}
                onPress={onGotItPress}
              >
                <ButtonContentContainer>
                  <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.bluishColor} size={SIZE.LARGE}>
                    {commonStrings.gotIt}
                  </ButtonText>
                </ButtonContentContainer>
              </ButtonWrapper>
            </BackdropTextWrapper>
          </WrapperContainer>
        </StyledModal>
      </SafeAreaView>
    </>
  );
};

HowToPopUp.propTypes = {
  isVisible: PropTypes.string.isRequired,
  onGotItPress: PropTypes.func.isRequired,
  helpText: PropTypes.string.isRequired,
}

export default HowToPopUp;
