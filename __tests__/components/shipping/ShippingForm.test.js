import React from 'react';
import { render } from 'react-native-testing-library';

import ShippingForm from '../../../js/components/shipping/ShippingForm';
import MockProvider from '../../MockProvider';

describe('Component ShippingForm', () => {
  test('renders correctly', () => {
    const setIsNotSupportedStatePopUpAvailable = jest.fn();
    const setIsShippingSuccessful = jest.fn();
    const prize = { name: 'a', prizeId: 1 };

    const output = render(
      <MockProvider>
        <ShippingForm
          playerPrizeId={1}
          setIsNotSupportedStatePopUpAvailable={setIsNotSupportedStatePopUpAvailable}
          setIsShippingSuccessful={setIsShippingSuccessful}
          prize={prize}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
