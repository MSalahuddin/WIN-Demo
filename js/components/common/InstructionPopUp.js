import React, { useState } from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { SafeAreaView, Platform } from 'react-native';
import Text, { SIZE, FONT_FAMILY } from './Text';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import Banner, { BANNER_TYPE } from './Banner';
import TextButton from './TextButton';
import { scaleHeight, getWindowWidth, scale, scaleWidth, heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings } from '../../stringConstants';

const StyledModal = styled(Modal)`
  align-items: center;
  background-color: ${color.popupBlack};
  justify-content: flex-start;
  margin: 0;
`;

const Icon = styled.Image`
  height: ${scaleHeight(88)};
  margin-top: ${scaleHeight(90)};
  width: ${scaleHeight(88)};
`;

const BannerWrapper = styled(Banner)`
  margin-top: ${scaleHeight(24)};
`;

const Backdrop = styled.View`
  align-items: center;
  background-color: ${color.white};
  border-bottom-left-radius: ${scaleHeight(8)};
  border-bottom-right-radius: ${scaleHeight(8)};
  ${({ hasChildren }) => !hasChildren && `height: ${scaleHeight(153)}`};
  justify-content: flex-start;
  margin-top: ${-scaleHeight(20)};
  shadow-color: ${color.blackShadow};
  shadow-offset: 4px 4px;
  shadow-opacity: ${1};
  shadow-radius: 2px;
  width: 80%;
  z-index: -1;
  padding-top: ${({ hasChildren }) => (!hasChildren ? scaleHeight(20) : scaleHeight(40))};
  ${({ hasChildren }) => hasChildren && `padding-bottom: ${scaleHeight(60)}`};
`;

const ButtonWrapper = styled(Button)`
  margin-top: ${({ marginTop }) => scaleHeight(marginTop)};
`;

const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(7)};
`;

const BackdropTextWrapper = styled.View`
  align-items: center;
  margin-horizontal: ${scale(10)};
  margin-top: ${scaleHeight(24)};
`;

const mascotHeight = scaleWidth(104) * (164 / 104);
const mascotPositionVariation = mascotHeight - (heightRatio < 1 ? scaleHeight(18) : scaleHeight(12));
const MascotWrapper = styled.Image`
  position: absolute;
  width: ${scaleWidth(104)};
  height: ${mascotHeight};
  top: ${({ top }) => top - mascotPositionVariation};
  right: ${scaleWidth(28)};
`;

const MascotWrapperLeft = styled.Image`
  position: absolute;
  width: ${scaleWidth(104)};
  height: ${mascotHeight};
  top: ${({ top }) => top - mascotPositionVariation};
  left: ${scaleWidth(28)};
`;


const TextButtonWrapper = styled(TextButton)`
  color: ${color.white};
  text-decoration-color: ${color.white};
`;

const TextButtonContainer = styled.View`
  margin-top: ${scaleHeight(61)};
`;
const ButtonAndroidContainer = styled.View`
`;

const InstructionPopUp = ({
  backdropText,
  bannerLabel,
  buttonText,
  icon,
  isVisible,
  mascot,
  isLowerCase,
  mascotLeft,
  secondaryButtonText,
  secondaryButtonOnPress,
  onPress,
  textButtonLabel,
  textButtonOnPress,
  children,
  disabled,
  bannerType,
}) => {
  const [bannerPosition, setBannerPosition] = useState(0);

  const renderTextButton = () => (
    <TextButtonContainer>
      <TextButtonWrapper testID="text-button" label={textButtonLabel} onPress={textButtonOnPress} />
    </TextButtonContainer>
  );

  return (
    <SafeAreaView>
      <StyledModal isVisible={isVisible}>
        <Icon source={icon} resizeMode="contain" />
        <BannerWrapper
          bannerType={bannerType}
          isLowerCase={isLowerCase}
          label={bannerLabel}
          textSize={SIZE.BANNER_LARGE}
          width={getWindowWidth() - scaleWidth(8)}
          onLayout={event => {
            const { y } = event.nativeEvent.layout;
            setBannerPosition(y);
          }}
        />
        <Backdrop hasChildren={!!children}>
          {!!backdropText && (
            <BackdropTextWrapper>
              <Text alignCenter size={SIZE.XSMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.grayBlack}>
                {backdropText}
              </Text>
            </BackdropTextWrapper>
          )}
          {children}
        </Backdrop>
        {Platform.OS === 'android' ?
          <ButtonAndroidContainer
          marginTop={-46}
          >
            <ButtonWrapper
              testID="popup-button"
              borderRadius={44}
              height={88}
              width={271}
              theme={BUTTON_COLOR_SCHEME.GREEN}
              onPress={onPress}
              disabled={disabled}
              marginTop={0}
            >
              <ButtonContentContainer>
                <ButtonText color={color.white} size={isLowerCase ? SIZE.LARGE : SIZE.XLARGE}>
                  {buttonText}
                </ButtonText>
              </ButtonContentContainer>
            </ButtonWrapper>

          </ButtonAndroidContainer>
          :
          <ButtonWrapper
            testID="popup-button"
            borderRadius={44}
            height={88}
            width={271}
            theme={BUTTON_COLOR_SCHEME.GREEN}
            onPress={onPress}
            disabled={disabled}
            marginTop={-46}
          >
            <ButtonContentContainer>
              <ButtonText color={color.white} size={isLowerCase ? SIZE.LARGE : SIZE.XLARGE}>
                {buttonText}
              </ButtonText>
            </ButtonContentContainer>
          </ButtonWrapper>}
        {!!secondaryButtonOnPress && (
          <ButtonWrapper
            testID="secondary-button"
            borderRadis={32}
            height={64}
            width={207}
            theme={BUTTON_COLOR_SCHEME.PURPLE}
            onPress={secondaryButtonOnPress}
            marginTop={16}
          >
            <ButtonContentContainer>
              <ButtonText color={color.white} size={SIZE.SMALL}>
                {secondaryButtonText}
              </ButtonText>
            </ButtonContentContainer>
          </ButtonWrapper>
        )}
        {!!textButtonLabel && renderTextButton()}
        <MascotWrapper source={mascot} resizeMode="contain" top={bannerPosition} />
        {mascotLeft &&
          <MascotWrapperLeft source={mascotLeft} resizeMode="contain" top={bannerPosition} />
        }



      </StyledModal>
    </SafeAreaView>
  );
};

InstructionPopUp.defaultProps = {
  backdropText: '',
  children: null,
  textButtonLabel: '',
  textButtonOnPress: () => { },
  secondaryButtonText: popUpStrings.cancel,
  secondaryButtonOnPress: null,
  mascot: null,
  disabled: false,
  isLowerCase: false,
  mascotLeft: false,
  bannerType: BANNER_TYPE.NORMAL,
};

InstructionPopUp.propTypes = {
  backdropText: PropTypes.string,
  bannerLabel: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  children: PropTypes.node,
  isLowerCase: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]).isRequired,
  isVisible: PropTypes.bool.isRequired,
  textButtonLabel: PropTypes.string,
  textButtonOnPress: PropTypes.func,
  mascot: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]),
  mascotLeft: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]),
  onPress: PropTypes.func.isRequired,
  secondaryButtonText: PropTypes.string,
  secondaryButtonOnPress: PropTypes.func,
  disabled: PropTypes.bool,
  bannerType: PropTypes.string,
};

export default InstructionPopUp;
