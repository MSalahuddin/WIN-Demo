import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import { scale, scaleHeight } from '../../platformUtils';
import { hitSlop } from '../../styles';

const Button = styled.TouchableOpacity`
  margin-left: ${scale(16)};
  margin-top: ${scaleHeight(24)};
`;

const BackIcon = styled.Image`
  height: ${({ size }) => scale(size)};
  width: ${({ size }) => scale(size)};
  border-radius:${scale(150)}
`;

function ProfileIconButton({ icon, onPress, size, iconOpacity, ...rest }) {
  return (
    <Button testID="icon-button" onPress={onPress} hitSlop={hitSlop(12, 12)} {...rest}>
      <BackIcon source={icon} size={size} resizeMode="contain" opacity={iconOpacity} />
    </Button>
  );
}

ProfileIconButton.defaultProps = {
  iconOpacity: 1,
  size: 40
};

ProfileIconButton.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]).isRequired,
  iconOpacity: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  size: PropTypes.number
};

export default ProfileIconButton;
