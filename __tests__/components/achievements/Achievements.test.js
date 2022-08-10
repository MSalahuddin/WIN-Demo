import React from 'react';
import { render } from 'react-native-testing-library';

import Achievements from '../../../js/components/achievements';
import MockProvider from '../../MockProvider';

describe('Component Achievements', () => {
  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <Achievements />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
