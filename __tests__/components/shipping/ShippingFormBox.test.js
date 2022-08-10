import React from 'react';
import { Text } from 'react-native';
import { render } from 'react-native-testing-library';

import ShippingFormBox from '../../../js/components/shipping/ShippingFormBox';

describe('Component ShippingFormBox', () => {
  test('renders correctly', () => {
    const output = render(
      <ShippingFormBox title="a">
        <Text>test</Text>
      </ShippingFormBox>
    );
    expect(output).toMatchSnapshot();
  });
});
