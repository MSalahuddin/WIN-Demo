import React from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'react-native';

const renderOptions = options =>
  options.map(({ label, value }, index) => <Picker.Item key={index} label={label} value={value} />);

const BottomPicker = ({ options, onValueChange, selectedValue }) => (
  <Picker onValueChange={onValueChange} selectedValue={selectedValue} testID="bottom-picker-container">
    {renderOptions(options)}
  </Picker>
);

BottomPicker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.any.isRequired }))
    .isRequired,
  selectedValue: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired
};

export default BottomPicker;
