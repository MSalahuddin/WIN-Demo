import React from 'react';
import { render } from 'react-native-testing-library';

import MockProvider from '../../MockProvider';
import Landing from '../../../js/components/landing';

describe('Component Landing Page', () => {
  test('renders correctly', () => {
    const navigation = { navigate: jest.fn(), dispatch: jest.fn() };

    const output = render(
      <MockProvider>
        <Landing navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
