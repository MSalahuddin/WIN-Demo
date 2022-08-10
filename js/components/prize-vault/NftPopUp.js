import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import StampPopUp from '../common/StampPopUp';
import TextButton from '../common/TextButton';
import Button, { BUTTON_COLOR_SCHEME } from '../common/Button';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import IconButton from '../common/IconButton';
import { scaleHeight, scaleWidth, scale } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings } from '../../stringConstants';
import { howtoBackgroundPopUp, nftPopupIcon, confirmPopupIcon, ExitCircle } from '../../../assets/images';
import { NFT_POPUP_TYPE } from '../../constants';
import SimpleButton from '../common/SimpleButton';

const PopUpContentView = styled.View`
  align-items: center;
  justify-content: center;
`;
const ExitCircleIcon = styled(IconButton)`
  position: absolute;
  top: ${scaleHeight(-30)};
  right: ${scaleWidth(-6)};
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
const ButtonLoader = styled.ActivityIndicator`
  right: ${scale(-30)};
  position: absolute;
`;
const ButtonText = styled(Text)`
  margin-top: ${Platform.OS === 'ios' ? scaleHeight(5) : 0};
`;
const TextButtonWrapper = styled(TextButton)`
  margin-top: ${scaleHeight(20)};
  margin-bottom: ${scaleHeight(10)};
`;
const InputBoxContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
const InputBox = styled.TextInput`
  border-radius: ${scaleHeight(5)};
  color: ${color.white};
  background-color:${color.darkNavyBlue};
  font-size: ${scale(14)};
  padding-left: ${scaleWidth(8)};
  padding-top: ${Platform.OS === 'android' ? scaleHeight(8) : scaleHeight(10)};
  padding-bottom: ${Platform.OS === 'android' ? scaleHeight(8) : scaleHeight(10)};
  width: 100%;
  text-align: center;
`;

const NftPopUp = ({
  isVisible,
  value,
  onChangeText,
  type,
  onPressContinue,
  onPressConfirm,
  onPressCancel,
  walletAddressError,
  isLoading
}) => {
  return (
    <StampPopUp
      isVisible={isVisible}
      backgroundImage={howtoBackgroundPopUp}
      stampIcon={type === NFT_POPUP_TYPE.CLAIM ? nftPopupIcon : confirmPopupIcon}
    >
      {!isLoading ? <ExitCircleIcon onPress={onPressCancel} icon={ExitCircle} size={38} /> : null}
      <PopUpContentView>
        <TextWrapper fontFamily={FONT_FAMILY.BOLD} size={SIZE.XXXLARGE} color={color.white} alignCenter>
          {type === NFT_POPUP_TYPE.CLAIM ? popUpStrings.claimNft : popUpStrings.confirmNft}
        </TextWrapper>

        <TextWrapper
          marginTop={10}
          marginBottom={20}
          fontFamily={FONT_FAMILY.MEDIUM}
          size={SIZE.SMALL}
          color={color.white}
          alignCenter
        >
          {type === NFT_POPUP_TYPE.CLAIM ? popUpStrings.claimNftBody : popUpStrings.confirmNftBody}
        </TextWrapper>

        <InputBoxContainer>
          <InputBox
            multiline
            placeholder={popUpStrings.claimNftPlaceholder}
            placeholderTextColor={color.daisyBush}
            onChangeText={onChangeText}
            value={value}
            autoCorrect={false}
            editable={type === NFT_POPUP_TYPE.CLAIM}
            returnKeyType="done"
            onSubmitEditing={type === NFT_POPUP_TYPE.CLAIM ? onPressContinue : onPressConfirm}
            blurOnSubmit
          />
        </InputBoxContainer>

        {walletAddressError ? (
          <TextWrapper fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XXSMALL} color={color.warningRed} marginTop={6}>
            {walletAddressError}
          </TextWrapper>
        ) : null}

        <ButtonWrapper
          disabled={isLoading}
          borderRadius={44}
          marginTop={25}
          height={53}
          width={200}
          onPress={type === NFT_POPUP_TYPE.CLAIM ? onPressContinue : onPressConfirm}
        >
          <ButtonContentContainer>
            <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.darkNavyBlue} size={SIZE.LARGE}>
              {type === NFT_POPUP_TYPE.CLAIM ? popUpStrings.continue : popUpStrings.confirm}
            </ButtonText>
            {isLoading ? <ButtonLoader color={color.darkNavyBlue} /> : null}
          </ButtonContentContainer>
        </ButtonWrapper>

        {!isLoading ? (
          <TextButtonWrapper color={color.white} isUnderlined label={popUpStrings.cancel} onPress={onPressCancel} />
        ) : null}
      </PopUpContentView>
    </StampPopUp>
  );
};

NftPopUp.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  type: PropTypes.oneOf([NFT_POPUP_TYPE.CLAIM, NFT_POPUP_TYPE.CONFIRM]),
  onPressContinue: PropTypes.func.isRequired,
  onPressConfirm: PropTypes.func.isRequired,
  onPressCancel: PropTypes.func.isRequired,
  walletAddressError: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired
};

NftPopUp.defaultProps = {
  type: NFT_POPUP_TYPE.CLAIM
};

export default NftPopUp;
