import React from 'react';
import { render } from 'react-native-testing-library';

import LoadingScreen from '../../../js/components/common/LoadingScreen';

describe('Component LoadingScreen', () => {
  test('renders correctly', () => {
    const output = render(<LoadingScreen isVisible />);
    expect(output).toMatchSnapshot();
  });
});
