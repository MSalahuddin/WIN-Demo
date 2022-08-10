import React from 'react';
import { render } from 'react-native-testing-library';

import TokensRow from '../../../js/components/game-card-reload/TokensRow';

describe('Component TokensRow', () => {
  test('renders correctly', () => {
    const output = render(<TokensRow monthlyTokenAmount={1} oneTimeTokenAmount={1} name="" />);
    expect(output).toMatchSnapshot();
  });
});
