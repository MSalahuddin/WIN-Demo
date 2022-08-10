import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import { fontFamily as fontFamilyConstant, color as colorConstant } from '../../styles';
import { scale } from '../../platformUtils';

export const FONT_FAMILY = {
  BOLD: 'BOLD',
  BOLD_ITALIC: 'BOLD ITALIC',
  BLACK: 'BLACK',
  LIGHT: 'LIGHT',
  LIGHT_ITALIC: 'LIGHT ITALIC',
  MEDIUM: 'MEDIUM',
  REGULAR: 'REGULAR',
  REGULAR_ITALIC: 'REGULAR ITALIC',
  SEMI_BOLD: 'SEMI BOLD',
  THIN: 'THIN',
  THIN_ITALIC: 'THIN ITALIC',
  ROBOTO_MEDIUM: 'ROBOTO MEDIUM',
  SF_MEDIUM: 'SF MEDIUM'
};

const getFontFamily = fontFamilyProp => {
  switch (fontFamilyProp) {
    case FONT_FAMILY.BOLD:
      return fontFamilyConstant.calibreBold;
    case FONT_FAMILY.BOLD_ITALIC:
      return fontFamilyConstant.calibreBoldItalic;
    case FONT_FAMILY.BLACK:
      return fontFamilyConstant.calibreBlack;
    case FONT_FAMILY.LIGHT:
      return fontFamilyConstant.calibreLight;
    case FONT_FAMILY.LIGHT_ITALIC:
      return fontFamilyConstant.calibreLightItalic;
    case FONT_FAMILY.REGULAR:
      return fontFamilyConstant.calibreRegular;
    case FONT_FAMILY.REGULAR_ITALIC:
      return fontFamilyConstant.calibreRegularItalic;
    case FONT_FAMILY.SEMI_BOLD:
      return fontFamilyConstant.calibreSemiBold;
    case FONT_FAMILY.THIN:
      return fontFamilyConstant.calibreThin;
    case FONT_FAMILY.THIN_ITALIC:
      return fontFamilyConstant.calibreThinItalic;
    case FONT_FAMILY.ROBOTO_MEDIUM:
      return fontFamilyConstant.robotoMedium;
    case FONT_FAMILY.SF_MEDIUM:
      return fontFamilyConstant.sanFranMedium;
    default:
      return fontFamilyConstant.calibreMedium;
  }
};

export const SIZE = {
  NORMAL: 'NORMAL',
  LARGE: 'LARGE',
  XLARGE: 'XLARGE',
  BANNER_LARGE: 'BANNER_LARGE',
  XXLARGE: 'XXLARGE',
  XXXLARGE: 'XXXLARGE',
  LARGEST: 'LARGEST',
  SMALL: 'SMALL',
  XSMALL: 'XSMALL',
  XXSMALL: 'XXSMALL',
  XXXSMALL: 'XXXSMALL',
  XXXXSMALL: 'XXXXSMALL'
};

const getFontSize = sizeProp => {
  switch (sizeProp) {
    case SIZE.XXXXSMALL:
      return scale(12);
    case SIZE.XXXSMALL:
      return scale(13);
    case SIZE.XXSMALL:
      return scale(14);
    case SIZE.XSMALL:
      return scale(16);
    case SIZE.SMALL:
      return scale(18);
    case SIZE.LARGE:
      return scale(21);
    case SIZE.XLARGE:
      return scale(24);
    case SIZE.BANNER_LARGE:
      return scale(23);
    case SIZE.XXLARGE:
      return scale(28);
    case SIZE.XXXLARGE:
      return scale(32);
    case SIZE.LARGEST:
      return scale(38);
    default:
      return scale(20);
  }
};

const StyledText = styled.Text`
  font-family: ${({ fontFamily }) => getFontFamily(fontFamily)};
  font-size: ${({ size }) => getFontSize(size)};
  text-transform: ${({ isUppercase }) => (isUppercase ? 'uppercase' : 'none')};
  text-align: ${({ alignCenter }) => (alignCenter ? 'center' : 'left')};
  justify-content: center;
  color: ${({ color }) => color};
  text-decoration: ${({ isUnderlined }) => (isUnderlined ? 'underline' : 'none')};
  text-decoration-color: ${({ color }) => color};
`;

const Text = ({ children, fontFamily, size, color, isUppercase, isUnderlined, alignCenter, 
  allowFontScaling, ...rest }) => (
  <StyledText
    maxFontSizeMultiplier={1.3}
    allowFontScaling={allowFontScaling}
    fontFamily={fontFamily}
    color={color}
    size={size}
    isUppercase={isUppercase}
    isUnderlined={isUnderlined}
    alignCenter={alignCenter}
    {...rest}
  >
    {children}
  </StyledText>
);

Text.defaultProps = {
  fontFamily: FONT_FAMILY.MEDIUM,
  color: colorConstant.black,
  size: SIZE.NORMAL,
  isUppercase: false,
  isUnderlined: false,
  alignCenter: false,
  allowFontScaling: true
};

Text.propTypes = {
  children: PropTypes.node.isRequired,
  fontFamily: PropTypes.oneOf([
    FONT_FAMILY.BOLD,
    FONT_FAMILY.BOLD_ITALIC,
    FONT_FAMILY.LIGHT,
    FONT_FAMILY.LIGHT_ITALIC,
    FONT_FAMILY.MEDIUM,
    FONT_FAMILY.REGULAR,
    FONT_FAMILY.REGULAR_ITALIC,
    FONT_FAMILY.SEMI_BOLD,
    FONT_FAMILY.THIN,
    FONT_FAMILY.THIN_ITALIC,
    FONT_FAMILY.ROBOTO_MEDIUM,
    FONT_FAMILY.SF_MEDIUM
  ]),
  size: PropTypes.oneOf([
    SIZE.NORMAL,
    SIZE.LARGE,
    SIZE.BANNER_LARGE,
    SIZE.XLARGE,
    SIZE.XXLARGE,
    SIZE.LARGEST,
    SIZE.SMALL,
    SIZE.XSMALL,
    SIZE.XXSMALL,
    SIZE.XXXSMALL,
    SIZE.XXXXSMALL
  ]),
  color: PropTypes.string,
  isUppercase: PropTypes.bool,
  isUnderlined: PropTypes.bool,
  alignCenter: PropTypes.bool,
  allowFontScaling: PropTypes.bool
};

export default Text;
