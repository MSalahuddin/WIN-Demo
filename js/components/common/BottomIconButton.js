import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import { scale, scaleHeight } from '../../platformUtils';
import { hitSlop } from '../../styles';

const Button = styled.TouchableOpacity`
  margin-horizontal: ${scale(16)};
  margin-top: ${scaleHeight(24)};
`;

const BackIcon = styled.Image`
  height: ${({ size }) => scale(size)};
  width: ${({ size }) => scale(size)};
`;

function BottomIconButton({ icon, onPress, size, iconOpacity, ...rest }) {
  return (
    <Button testID="icon-button" onPress={onPress} hitSlop={hitSlop(12, 12)} {...rest}>
      <BackIcon source={icon} size={size} resizeMode="contain" opacity={iconOpacity} />
    </Button>
  );
}

BottomIconButton.defaultProps = {
  iconOpacity: 1,
  size: 40
};

BottomIconButton.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]).isRequired,
  iconOpacity: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  size: PropTypes.number
};

export default BottomIconButton;
