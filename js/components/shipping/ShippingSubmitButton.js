import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import Button, { BUTTON_COLOR_SCHEME } from '../common/Button';
import { scaleHeight } from '../../platformUtils';
import { color } from '../../styles';
import { shippingStrings } from '../../stringConstants';

const ButtonWrapper = styled(Button)`
  margin-top: ${scaleHeight(32)};
`;

const Container = styled.View`
  align-items: center;
  margin-bottom: ${scaleHeight(74)};
`;

const TextContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: ${scaleHeight(30)};
`;

const ValidationContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const TextWrapper = styled(Text)`
  color: ${color.bluishColor};
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(8)};
`;

const ShippingSubmitButton = ({ fieldsNeedValidate, error, onPress, touched, disabledButton }) => {
  const isFormUntoched = fieldsNeedValidate.length === 8;
  // form is complete when every field is prepopulated or
  // at least one field is touched with no error occurs
  const isFormComplete =
    fieldsNeedValidate.length === 0 || (Object.keys(touched).length >= 1 && Object.keys(error).length === 0);
  const fieldsTouchedHasError = Object.keys(error).filter(value => Object.keys(touched).includes(value));
  const isFormErrored = fieldsTouchedHasError.length > 0;

  const validationSummary = Object.keys(error).map(x => 
  (<Text
    fontFamily={FONT_FAMILY.BOLD}
    size={SIZE.SMALL}
    color={color.warningRed}
  >
  {error[x]}
  </Text>))

  const bannerMessage = () => {
    switch (true) {
      case isFormUntoched:
        return shippingStrings.fillOutForm;
      case isFormErrored:
        return shippingStrings.oopsCorrectErrors;
      default:
        return shippingStrings.yourPrizeAwaits;
    }
  };
  const theme = () => {
    if (disabledButton || isFormErrored) {
      return BUTTON_COLOR_SCHEME.GREY
    }
    if (isFormComplete) {
      return BUTTON_COLOR_SCHEME.WHITE
    }
    return BUTTON_COLOR_SCHEME.WHITE
  }

  const disabled = () => {
    if (disabledButton) {
      return disabledButton
    }
    return !isFormComplete || isFormErrored
  }

  return (
    <Container>
      <ButtonWrapper
        testID="shipping-button"
        height={88}
        width={271}
        borderRadius={44}
        theme={theme()}
        disabled={disabled()}
        onPress={onPress}
      >
        <TextWrapper size={SIZE.XLARGE}>{shippingStrings.submitShip}</TextWrapper>
      </ButtonWrapper>
      <TextContainer>
        <Text
          fontFamily={FONT_FAMILY.BOLD}
          size={SIZE.SMALL}
          color={isFormErrored ? color.warningRed : color.white}
        >
          {bannerMessage()}
        </Text>
      </TextContainer>
      <ValidationContainer>
          {validationSummary}
      </ValidationContainer>
    </Container>
  );
};

ShippingSubmitButton.propTypes = {
  error: PropTypes.shape({}).isRequired,
  onPress: PropTypes.func.isRequired,
  touched: PropTypes.shape({}).isRequired,
  fieldsNeedValidate: PropTypes.arrayOf(PropTypes.string).isRequired,
  disabledButton: PropTypes.func.isRequired
};

export default ShippingSubmitButton;
