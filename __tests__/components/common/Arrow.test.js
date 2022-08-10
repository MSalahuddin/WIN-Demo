import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import Arrow from '../../../js/components/common/Arrow';

describe('Component Arrow', () => {
  test('renders correctly', () => {
    const output = render(<Arrow />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when arrowDirection="UP"', () => {
    const output = render(<Arrow arrowDirection="UP" />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when arrowDirection="LEFT"', () => {
    const output = render(<Arrow arrowDirection="LEFT" />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when arrowDirection="RIGHT"', () => {
    const output = render(<Arrow arrowDirection="RIGHT" />);
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when Arrow is pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<Arrow onPress={onPress} />);
    fireEvent(getByTestId('arrow'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
