import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import { scale, scaleHeight } from '../../platformUtils';
import { hitSlop } from '../../styles';

const Button = styled.TouchableOpacity`
  margin-left: ${scale(16)};
  margin-top: ${scaleHeight(24)};
  ${({ paddingBottom }) => paddingBottom && `padding-bottom: ${paddingBottom}`};
   ${({ paddingHorizontal }) => paddingHorizontal && `padding-horizontal: ${paddingHorizontal}`};
   ${({ paddingVertical }) => paddingVertical && `padding-vertical: ${paddingVertical}`};
  ${({ backGroundColor }) => backGroundColor && `background-color: ${backGroundColor}`};
  ${({ borderRadius }) => borderRadius && `border-radius : ${borderRadius}`};
`;

const BackIcon = styled.Image`
  height: ${({ size }) => scale(size)};
  width: ${({ size }) => scale(size)};
`;

function IconButton({
  icon,
  onPress,
  size,
  iconOpacity,
  backGroundColor,
  paddingHorizontal,
  borderRadius,
  paddingBottom,
  isUrl,
  paddingVertical,
  isSvg,
  ...rest
}) {
  return (
    <Button testID="icon-button"
      borderRadius={borderRadius}
      paddingHorizontal={paddingHorizontal}
      paddingBottom={paddingBottom}
      backGroundColor={backGroundColor}
      paddingVertical={paddingVertical}
      onPress={onPress}
      hitSlop={hitSlop(12, 12)}
      {...rest}
    >
      {isSvg ? icon() : <BackIcon source={isUrl ? { uri: icon } : icon} size={size} resizeMode="contain" opacity={iconOpacity} />}
    </Button>
  );
}

IconButton.defaultProps = {
  iconOpacity: 1,
  size: 40,
  borderRadius: 0,
  backGroundColor: 'transparent',
  paddingBottom: 0,
  paddingHorizontal: 0,
  isUrl: false,
  isSvg: false,
};

IconButton.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]).isRequired,
  isUrl: PropTypes.bool,
  iconOpacity: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  size: PropTypes.number,
  backGroundColor: PropTypes.string,
  borderRadius: PropTypes.number,
  paddingBottom: PropTypes.number,
  paddingHorizontal: PropTypes.number,
  isSvg: PropTypes.bool,
};

export default IconButton;
