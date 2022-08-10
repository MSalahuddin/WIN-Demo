import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import FerrisWheelCart from '../../../js/components/landing/FerrisWheelCart';
import MockProvider from '../../MockProvider';

describe('Component FerrisWheelCart', () => {
  const action = jest.fn();
  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <FerrisWheelCart prizeImage={1} prizeTitle="prize" buttonAction={action} buttonTitle="button" />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when ferris wheel button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <FerrisWheelCart prizeImage={1} prizeTitle="prize" buttonAction={action} buttonTitle="button" />
      </MockProvider>
    );
    fireEvent(getByTestId('ferris-wheel-button'), 'press');
    expect(action).toHaveBeenCalled();
  });
});
