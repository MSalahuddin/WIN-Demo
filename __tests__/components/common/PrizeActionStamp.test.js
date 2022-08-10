import React from 'react';
import { render } from 'react-native-testing-library';

import PrizeActionStamp from '../../../js/components/common/PrizeActionStamp';
import { PRIZE_STATUS } from '../../../js/constants';

describe('Component PrizeActionStamp', () => {
  const timestamp = '2012-01-26T13:51:50.417-07:00';
  test('renders correctly - prize not been swapped or shipped.', () => {
    const output = render(<PrizeActionStamp type={PRIZE_STATUS.NEW} datetime={timestamp} />);
    expect(output).toMatchSnapshot();
  });
  test('renders correctly when type="shipped"', () => {
    const output = render(<PrizeActionStamp type={PRIZE_STATUS.SHIPPED} datetime={timestamp} />);
    expect(output).toMatchSnapshot();
  });
  test('renders correctly when type="swapped"', () => {
    const output = render(<PrizeActionStamp type={PRIZE_STATUS.SWAPPED} datetime={timestamp} />);
    expect(output).toMatchSnapshot();
  });
  test('renders correctly when type="packing"', () => {
    const output = render(<PrizeActionStamp type={PRIZE_STATUS.PACKING} datetime={timestamp} />);
    expect(output).toMatchSnapshot();
  });
});
