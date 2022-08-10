import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import Text, { SIZE } from './Text';
import { hitSlop } from '../../styles';

function TextButton({ isUnderlined, onPress, label, disabled, ...rest }) {
  return (
    <TouchableOpacity onPress={onPress} testID="button" hitSlop={hitSlop(10, 10)} disabled={disabled}>
      <Text size={SIZE.XXSMALL} isUnderlined={isUnderlined} {...rest}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

TextButton.defaultProps = {
  disabled: false,
  isUnderlined: true
};

TextButton.propTypes = {
  disabled: PropTypes.bool,
  isUnderlined: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

export default TextButton;
