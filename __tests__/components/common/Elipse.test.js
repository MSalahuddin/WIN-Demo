import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import Ellipse from '../../../js/components/common/Ellipse';
import { coin } from '../../../assets/images';

describe('Component Ellipse', () => {
  const onPress = jest.fn();

  test('renders correctly', () => {
    const output = render(<Ellipse width={5} borderRadius={5} icon={coin} amount={0} isPlusPresent />);
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when Ellipse is pressed', () => {
    const { getByTestId } = render(
      <Ellipse width={5} borderRadius={5} icon={coin} amount={0} isPlusPresent onPress={onPress} />
    );
    fireEvent(getByTestId('ellipse-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
