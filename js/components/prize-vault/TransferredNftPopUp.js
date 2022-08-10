import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import StampPopUp from '../common/StampPopUp';
import Button, { BUTTON_COLOR_SCHEME } from '../common/Button';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import { scaleHeight } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings } from '../../stringConstants';
import { howtoBackgroundPopUp, transferredPopupIcon } from '../../../assets/images';
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

const TransferredNftPopUp = ({ isVisible, onPressAwesome }) => {
  return (
    <StampPopUp isVisible={isVisible} backgroundImage={howtoBackgroundPopUp} stampIcon={transferredPopupIcon}>
      <PopUpContentView>
        <TextWrapper fontFamily={FONT_FAMILY.BOLD} size={SIZE.XXXLARGE} color={color.white} alignCenter>
          {popUpStrings.transferredNft}
        </TextWrapper>

        <TextWrapper
          marginTop={10}
          marginBottom={20}
          fontFamily={FONT_FAMILY.MEDIUM}
          size={SIZE.SMALL}
          color={color.white}
          alignCenter
        >
          {popUpStrings.transferredNftBody}
        </TextWrapper>

        <ButtonWrapper
          borderRadius={44}
          marginTop={20}
          height={53}
          width={200}
          onPress={onPressAwesome}
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

TransferredNftPopUp.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onPressAwesome: PropTypes.func.isRequired
};

TransferredNftPopUp.defaultProps = {};

export default TransferredNftPopUp;
