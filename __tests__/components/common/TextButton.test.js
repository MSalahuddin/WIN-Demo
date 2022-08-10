import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import TextButton from '../../../js/components/common/TextButton';

describe('Component TextButton', () => {
  const onPress = jest.fn();

  test('renders correctly', () => {
    const output = render(<TextButton onPress={onPress} label="" />);
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when button is pressed', () => {
    const { getByTestId } = render(<TextButton onPress={onPress} label="" />);
    fireEvent(getByTestId('button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
