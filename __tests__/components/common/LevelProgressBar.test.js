import React from 'react';
import { render } from 'react-native-testing-library';

import MockProvider from '../../MockProvider';
import LevelProgressBar from '../../../js/components/common/LevelProgressBar';

describe('Component LevelProgressBar', () => {
  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <LevelProgressBar />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
