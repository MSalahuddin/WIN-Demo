import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import IconButton from '../../../js/components/common/IconButton';

describe('Component IconButton', () => {
  const onPress = jest.fn();

  test('renders correctly', () => {
    const output = render(<IconButton icon={1} onPress={onPress} />);
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when button is pressed', () => {
    const { getByTestId } = render(<IconButton icon={1} onPress={onPress} />);
    fireEvent(getByTestId('icon-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
