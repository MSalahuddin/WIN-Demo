import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import ProfileIcon from '../../../js/components/common/ProfileIcon';

describe('Component ProfileIcon', () => {
  const onPress = jest.fn();

  test('renders correctly', () => {
    const output = render(<ProfileIcon onPress={onPress} profileImageUri="a" />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when profileImageUri is not provided', () => {
    const output = render(<ProfileIcon onPress={onPress} profileImageUri="" />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly with prize available', () => {
    const output = render(<ProfileIcon isPrizeAvailable onPress={onPress} profileImageUri="a" />);
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when profile icon is pressed', () => {
    const { getByTestId } = render(<ProfileIcon onPress={onPress} />);
    fireEvent(getByTestId('profile-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
