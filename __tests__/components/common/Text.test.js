import React from 'react';
import { render } from 'react-native-testing-library';

import Text from '../../../js/components/common/Text';

describe('Component Text', () => {
  test('renders correctly', () => {
    const output = render(<Text>test</Text>);
    expect(output).toMatchSnapshot();
  });
});
