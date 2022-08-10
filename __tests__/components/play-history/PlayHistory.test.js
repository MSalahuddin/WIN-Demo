import React from 'react';
import { render } from 'react-native-testing-library';

import PlayHistory from '../../../js/components/play-history';
import MockProvider from '../../MockProvider';

describe('Component PlayHistory', () => {
  const navigation = { navigate: jest.fn() };

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <PlayHistory navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
