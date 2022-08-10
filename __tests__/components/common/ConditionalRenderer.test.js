import React from 'react';
import { render } from 'react-native-testing-library';
import { View } from 'react-native';

import ConditionalRenderer from '../../../js/components/common/ConditionalRenderer';

describe('Component ConditionalRenderer', () => {
  test('renders correctly when condition is true', () => {
    const output = render(
      <ConditionalRenderer enabled>
        <View />
      </ConditionalRenderer>
    );
    expect(output).toMatchSnapshot();
  });
  test('renders correctly when condition is false', () => {
    const output = render(
      <ConditionalRenderer enabled={false}>
        <View />
      </ConditionalRenderer>
    );
    expect(output).toMatchSnapshot();
  });
});
