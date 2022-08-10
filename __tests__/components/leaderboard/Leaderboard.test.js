import React from 'react';
import { render } from 'react-native-testing-library';

import Leaderboard from '../../../js/components/leaderboard';
import MockProvider from '../../MockProvider';

describe('Component Leaderboard', () => {
  const navigation = { navigate: jest.fn() };

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <Leaderboard navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
