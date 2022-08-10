import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import Text, { SIZE } from './Text';
import { downArrow } from '../../../assets/images';
import { color } from '../../styles';
import { scale, scaleHeight } from '../../platformUtils';

const StyledContainer = styled.View`
  flex: 1;
  background-color: ${color.white};
  border-radius: ${scale(5)};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AlignedText = styled(Text)`
  margin-top: ${scaleHeight(5)};
`;

const DownArrowImage = styled.Image`
  height: ${scale(16)};
  width: ${scale(16)};
`;

const DropdownButton = ({ label, onPress, fontFamily, fontColor, ...rest }) => {
  return (
    <TouchableOpacity onPress={onPress} {...rest}>
      <StyledContainer>
        <AlignedText size={SIZE.XXSMALL} fontFamily={fontFamily} color={fontColor}>
          {label}
        </AlignedText>
        <DownArrowImage source={downArrow} resizeMode="contain" />
      </StyledContainer>
    </TouchableOpacity>
  );
};

DropdownButton.defaultProps = {
  fontColor: color.black,
  fontFamily: null,
  label: ''
};

DropdownButton.propTypes = {
  fontFamily: PropTypes.string,
  fontColor: PropTypes.string,
  label: PropTypes.string,
  onPress: PropTypes.func.isRequired
};

export default DropdownButton;
