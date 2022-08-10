import React from 'react';
import { render } from 'react-native-testing-library';

import PrizeCircle from '../../../js/components/winners-circle/PrizeCircle';

describe('Component PrizeCircle', () => {
  test('renders correctly when type is swap', () => {
    const output = render(<PrizeCircle imageUrl="a" type="SWAP" />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly', () => {
    const output = render(<PrizeCircle imageUrl="a" />);
    expect(output).toMatchSnapshot();
  });
});
