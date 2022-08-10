import React from 'react';
import { render } from 'react-native-testing-library';

import CircularProgress from '../../../js/components/common/CircularProgress';

describe('Component CircularProgress', () => {
  test('renders correctly when there is no imageSource', () => {
    const output = render(<CircularProgress percent={30} />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when there is imageSource', () => {
    const output = render(<CircularProgress percent={30} imageSource="a" />);
    expect(output).toMatchSnapshot();
  });
});
