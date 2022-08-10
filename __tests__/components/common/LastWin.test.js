import React from 'react';
import { render } from 'react-native-testing-library';

import LastWin from '../../../js/components/common/LastWin';

describe('Component LastWin', () => {
  test('renders correctly', () => {
    const output = render(<LastWin timestamp="" />);
    expect(output).toMatchSnapshot();
  });
});
