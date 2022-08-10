import React from 'react';
import { View } from 'react-native';
import { render } from 'react-native-testing-library';

import DottedBoxContainer from '../../../js/components/common/DottedBoxContainer';

describe('Component DottedBoxContainer', () => {
  test('renders correctly', () => {
    const output = render(
      <DottedBoxContainer>
        <View />
      </DottedBoxContainer>
    );
    expect(output).toMatchSnapshot();
  });
});
