import React, { useState } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import {Platform} from 'react-native';
import DottedBoxContainer from '../common/DottedBoxContainer';
import { color, fontFamily } from '../../styles';
import { scale, getWindowWidth, scaleHeight, scaleWidth } from '../../platformUtils';
import { gameCardReloadStrings } from '../../stringConstants';
import { error } from '../../../assets/images';

const Container = styled.View`
  align-items: center;
`;

// full screen minus paddings (2 x 24) and outer box border (16)
const inputBoxWidth = getWindowWidth() - scale(48) - scale(16);
const InputBox = styled.TextInput`
  border-radius: ${scale(8)};
  font-size: ${scale(18)};
  height: ${scaleHeight(48)};
  justify-content: center;
  padding-top: ${Platform.OS ==='android' ?scaleHeight(10) : scaleHeight(3)};
  width: ${inputBoxWidth};
  ${({ backgroundColor }) => backgroundColor && `background-color: ${backgroundColor}`};
  ${({ customFont }) => customFont && `font-family: ${customFont}`};
  ${({ fontColor }) => fontColor && `color: ${fontColor}`};
`;

const Icon = styled.Image`
  height: 20px;
  width: 20px;
`;


const ExclamationMark = styled.View`
  position: absolute;
  right: ${scaleWidth(12)};
  top: ${scaleHeight(12)};
  height: ${scaleHeight(24)};
  width: ${scaleHeight(24)};
`;





const PromoCodeBox = ({ promoCode, setPromoCode, onPromoCodeEnter, isPromoCodeValid, setIsPromoCodeValid }) => {
  const [isFocused, setIsFocused] = useState(false);
  let backgroundColor = isFocused ? color.white : color.darkerWhite;
  let borderColor = isFocused ? color.whitePurple : color.lightGrey;
  let customFont = isFocused ? fontFamily.calibreSemiBold : fontFamily.calibreRegular;
  let dotColor = isFocused ? color.yellow : color.darkerWhite;
  let fontColor = isFocused ? color.lightBlack : color.darkGrey;
  let placeholderText = isFocused ? null : gameCardReloadStrings.enterCouponCode;
  if (isPromoCodeValid === false) {
    backgroundColor = color.darkerWhite;
    borderColor = color.pink;
    customFont = fontFamily.calibreSemiBold;
    dotColor = color.powderPink;
    fontColor = color.warningRed;
    placeholderText = null;
  }

  return (
    <Container>
      <DottedBoxContainer borderWidth={8} borderColor={borderColor} dotColor={dotColor} innerWidth={inputBoxWidth}>
        <InputBox
          allowFontScaling={false}
          testID="promo-code-box-input"
          backgroundColor={backgroundColor}
          textAlign="center"
          placeholder={placeholderText}
          placeholderTextColor={color.darkGrey}
          onChangeText={value => {
            setIsPromoCodeValid(null);
            setPromoCode(value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={!isPromoCodeValid ? promoCode : null}
          customFont={customFont}
          fontColor={fontColor}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={onPromoCodeEnter}
        />

        {isPromoCodeValid === false &&
          <ExclamationMark>
            <Icon source={error} resizeMode="contain" />
          </ExclamationMark>
        }
      </DottedBoxContainer>
    </Container>
  );
};

PromoCodeBox.propTypes = {
  promoCode: PropTypes.string,
  setPromoCode: PropTypes.func.isRequired,
  onPromoCodeEnter: PropTypes.func.isRequired,
  isPromoCodeValid: PropTypes.bool,
  setIsPromoCodeValid: PropTypes.func.isRequired,
};

PromoCodeBox.defaultProps = {
  promoCode: '',
  isPromoCodeValid: null
};

export default PromoCodeBox;
