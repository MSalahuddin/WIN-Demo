import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import InputFormBox from '../../../js/components/shipping/InputFormBox';

describe('Component InputFormBox', () => {
  const onChangeText = jest.fn();

  test('renders correctly in default state', () => {
    const output = render(<InputFormBox title="a" error={null} value="a" onChangeText={onChangeText} />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when there is an error', () => {
    const output = render(<InputFormBox title="a" error="error" value="a" onChangeText={onChangeText} />);
    expect(output).toMatchSnapshot();
  });

  test('calls onChangeText when inputs are being entered', () => {
    const { getByTestId } = render(<InputFormBox title="a" error={null} value="a" onChangeText={onChangeText} />);
    fireEvent(getByTestId('input-box'), 'onChangeText', 'a');
    expect(onChangeText).toHaveBeenCalled();
  });
});
