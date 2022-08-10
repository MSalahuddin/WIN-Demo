import React from 'react';
import { render } from 'react-native-testing-library';

import MockProvider from '../../MockProvider';
import AccountProfile from '../../../js/components/account-profile';

describe('Component AccountProfile', () => {
  const navigation = {
    dispatch: jest.fn(),
    navigate: jest.fn()
  };

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <AccountProfile navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
