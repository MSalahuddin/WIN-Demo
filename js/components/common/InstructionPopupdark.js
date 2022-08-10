import React, { } from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { SafeAreaView, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import Text, { SIZE, FONT_FAMILY } from './Text';

import Button, { BUTTON_COLOR_SCHEME } from './Button';
import TextButton from './TextButton';
import { scaleHeight, scaleWidth, scale } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings } from '../../stringConstants';
import TopDropAnimation from './TopDropAnimation';
import { coin } from '../../../assets/images';


const StyledModal = styled(Modal)`
  align-items: center;
  background-color: ${color.popupBlack};
  justify-content: center;
  margin: 0;
`;

const TopIcon = styled.Image`
  height: ${scaleHeight(130)};
  width: ${scaleHeight(215)};
  margin-bottom:${scaleHeight(-60)};
  z-index:1
`;

const Icon = styled.Image`
  height: ${scaleHeight(130)};
  width: ${scaleHeight(215)};
`;

const Backdrop = styled.ImageBackground`
  align-items: center;
  background-color: ${color.white};
  ${({ hasChildren }) => !hasChildren && `height: ${scaleHeight(153)}`};
  justify-content: center;
  border-radius: 15;
  width: 80%;
  padding-top:${scale(10)};
  ${({ border }) => border && `
  border-width:${scale(7)};
  overflow:hidden;
  border-color:${color.white};
  `}
  ${({ hasChildren }) => hasChildren && `padding-bottom: ${scaleHeight(60)}`};
`;

const ButtonWrapper = styled(Button)`
  margin-top: ${({ marginTop }) => scaleHeight(marginTop)};
`;

const SecButtonWrapper = styled(TouchableOpacity)`

`;


const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(7)};
`;



const SideCoin = styled.Image`
position: absolute;
width: ${scaleWidth(35)};
height: ${scaleHeight(35)};
bottom:${scaleHeight(60)};
right:${scaleWidth(5)}
`;

const TextButtonWrapper = styled(TextButton)`
  color: ${color.white};
  text-decoration-color: ${color.white};
`;

const TextButtonContainer = styled.View`
  margin-top: ${scaleHeight(61)};
`;

const InstructionPopUpDark = ({

  buttonText,
  icon,
  isVisible,
  isLowerCase,
  sideCoin,
  secondaryButtonText,
  secondaryButtonOnPress,
  onPress,
  textButtonLabel,
  textButtonOnPress,
  children,
  disabled,
  backgroundImage,
  topIcon,
  border,
  secPopupButtonText,
  secPopupButtonPress,
  bannerOnPress,
  bannerBtnText
}) => {

  const renderTextButton = () => (
    <TextButtonContainer>
      <TextButtonWrapper testID="text-button" label={textButtonLabel} onPress={textButtonOnPress} />
    </TextButtonContainer>
  );

  return (
    <SafeAreaView>
      <StyledModal isVisible={isVisible}>
      <TopDropAnimation image={coin} />
        <TopIcon source={topIcon} resizeMode="contain" />

        <Backdrop
          border={border}
          source={backgroundImage} resizeMode="stretch"
          // colors={[color.midBlue, color.darkBlue]}
          hasChildren={!!children}>

          <Icon source={icon} resizeMode="contain" />

          {children}
          {onPress && <ButtonWrapper
            testID="popup-button"
            borderRadius={44}
            height={58}
            width={191}
            theme={BUTTON_COLOR_SCHEME.WHITE}
            onPress={onPress}
            disabled={disabled}
            marginTop={5}
          >
            <ButtonContentContainer>
              <ButtonText
                color={color.leaderBoardcardBackgroundColor}
                size={isLowerCase ? SIZE.LARGE : SIZE.XLARGE}
                fontFamily={FONT_FAMILY.BOLD}>
                {buttonText}
              </ButtonText>
            </ButtonContentContainer>
          </ButtonWrapper>}
          {bannerOnPress && <TouchableOpacity
            onPress={bannerOnPress}
            style={styles.bannerBtn}>
            <ButtonContentContainer>
              <ButtonText
                color={color.leaderBoardcardBackgroundColor}
                size={isLowerCase ? SIZE.LARGE : SIZE.XLARGE}
                fontFamily={FONT_FAMILY.BOLD}>
                {bannerBtnText}
              </ButtonText>
            </ButtonContentContainer>
          </TouchableOpacity>}
          {!!secPopupButtonText &&
            <SecButtonWrapper onPress={secPopupButtonPress}>
              <ButtonContentContainer>
                <ButtonText color={color.white} size={isLowerCase ? SIZE.LARGE : SIZE.SMALL}>
                  {secPopupButtonText}
                </ButtonText>
              </ButtonContentContainer>
            </SecButtonWrapper>
          }
          {sideCoin && <SideCoin source={sideCoin} resizeMode="contain" />}
        </Backdrop>

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



      </StyledModal>
    </SafeAreaView>
  );
};

InstructionPopUpDark.defaultProps = {
  children: null,
  textButtonLabel: '',
  textButtonOnPress: () => { },
  secondaryButtonText: popUpStrings.cancel,
  secondaryButtonOnPress: null,
  backgroundImage: null,
  disabled: false,
  isLowerCase: false,
  sideCoin: false,
  icon: null,
  topIcon: null,
  border: false,
  secPopupButtonText: undefined,
  secPopupButtonPress: undefined,
  bannerBtnText: undefined,
  bannerOnPress: undefined
};

InstructionPopUpDark.propTypes = {
  buttonText: PropTypes.string.isRequired,
  children: PropTypes.node,
  isLowerCase: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]),
  topIcon: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]),
  isVisible: PropTypes.bool.isRequired,
  textButtonLabel: PropTypes.string,
  textButtonOnPress: PropTypes.func,
  backgroundImage: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]),
  sideCoin: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]),
  onPress: PropTypes.func.isRequired,
  secondaryButtonText: PropTypes.string,
  secondaryButtonOnPress: PropTypes.func,
  disabled: PropTypes.bool,
  border: PropTypes.bool,
  secPopupButtonText: PropTypes.string,
  secPopupButtonPress: PropTypes.func,
  bannerBtnText: PropTypes.string,
  bannerOnPress: PropTypes.func
};

const styles = StyleSheet.create({
  bannerBtn: {
    height: 55,
    width: 198,
    backgroundColor: color.white,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    marginVertical: 15
  }
});

export default InstructionPopUpDark;
