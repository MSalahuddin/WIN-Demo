import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import SocialButton from '../../../js/components/common/SocialButton';
import { color } from '../../../js/styles';

describe('Component SocialButton', () => {
  const onPress = jest.fn();

  test('renders correctly', () => {
    const output = render(
      <SocialButton media={1} onPress={onPress} backgroundColor={color.black} buttonText="" fontColor={color.black} />
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when button is pressed', () => {
    const { getByTestId } = render(
      <SocialButton media={1} onPress={onPress} backgroundColor={color.black} buttonText="" fontColor={color.black} />
    );
    fireEvent(getByTestId('button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
