import React from 'react';
import { render } from 'react-native-testing-library';

import BottomPicker from '../../../js/components/common/BottomPicker';

describe('Component BottomPicker', () => {
  const onPress = jest.fn();
  const options = [
    { label: 'foo', value: 'foo' },
    { label: 'bar', value: 'bar' }
  ];
  test('renders correctly', () => {
    const output = render(<BottomPicker onValueChange={onPress} options={options} selectedValue="" />);
    expect(output).toMatchSnapshot();
  });
});
