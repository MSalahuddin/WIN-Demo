import React from 'react';
import { render } from 'react-native-testing-library';

import Banner from '../../../js/components/common/Banner';

describe('Component Banner', () => {
  test('renders correctly', () => {
    const output = render(<Banner label="" width={100} />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly without label', () => {
    const output = render(<Banner width={100} />);
    expect(output).toMatchSnapshot();
  });
});
