import React from 'react';
import { render } from 'react-native-testing-library';

import LoadingSpinner from '../../../js/components/common/LoadingSpinner';

describe('Component LoadingSpinner', () => {
  test('renders correctly', () => {
    const output = render(<LoadingSpinner />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when isLoading', () => {
    const output = render(<LoadingSpinner isLoading />);
    expect(output).toMatchSnapshot();
  });
});
