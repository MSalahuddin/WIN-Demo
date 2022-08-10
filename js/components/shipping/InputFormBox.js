import React, { useState } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import { scaleHeight, scaleWidth, scale } from '../../platformUtils';
import { color, fontFamily } from '../../styles';
import { error as errorIcon, tick } from '../../../assets/images';

const InputBox = styled.TextInput`
  border-color: ${({ borderColor }) => borderColor};
  border-width: ${({ borderWidth }) => borderWidth};
  border-radius: ${scaleHeight(5)};
  color: ${color.lightBlack};
  background-color:${color.white}
  font-size: ${scale(14)};
  height: ${Platform.OS === 'android' ? scaleHeight(50) : scaleHeight(35)};
  padding-left: ${scaleWidth(8)};
  padding-top: ${Platform.OS === 'android' ? scaleHeight(15) : scaleHeight(5)};
  width: 100%;
`;

const InputContainer = styled.View`
  justify-content: flex-end;
`;

const TextWrapper = styled(Text)`
  margin-bottom: ${scaleHeight(4)};
`;

const IconWrapper = styled.Image`
  height: ${scaleHeight(24)};
  position: absolute;
  right: ${scaleWidth(10)};
  width: ${scaleHeight(24)};
`;

const InputBoxContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const InputFormBox = ({ title, error, value, onChangeText, isRequired, onEndEditing, ...rest }) => {
  const [wasOnFocus, setWasOnFocus] = useState(false);
  let borderColor = color.silverWhite;
  let borderWidth = 1;
  let font = fontFamily.calibreRegular;

  if (value) {
    font = fontFamily.calibreSemiBold;
  }

  if (wasOnFocus) {
    if (isRequired) {
      borderColor = !error ? color.greenValid : color.pinkRed;
      borderWidth = 2;
    }
  }

  return (
    <InputContainer {...rest}>
      <TextWrapper fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XSMALL} color={color.white}>
        {title}
      </TextWrapper>
      <InputBoxContainer>
        <InputBox
          allowFontScaling={false}
          testID="input-box"
          borderColor={borderColor}
          borderWidth={borderWidth}
          placeholder={rest.placeholder}
          placeholderTextColor={color.grayPlaceholder}
          onChangeText={onChangeText}
          onBlur={() => setWasOnFocus(true)}
          value={value}
          fontFamily={font}
          autoCapitalize="none"
          autoCorrect={false}
          onEndEditing={onEndEditing}
        />
        {wasOnFocus && isRequired && <IconWrapper source={error === null ? tick : errorIcon} />}
      </InputBoxContainer>
    </InputContainer>
  );
};

InputFormBox.defaultProps = {
  error: null,
  isRequired: true,
  value: null,
};

InputFormBox.propTypes = {
  error: PropTypes.string,
  isRequired: PropTypes.bool,
  onChangeText: PropTypes.func.isRequired,
  onEndEditing: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default InputFormBox;
