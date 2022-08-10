import React from 'react';
import { render } from 'react-native-testing-library';

import MockProvider from '../../MockProvider';
import SignIn from '../../../js/components/landing/SignIn';

describe('Component SignIn', () => {
  const navigation = {
    dispatch: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
    state: { params: { newUserCredentials: {} }, routeName: '' }
  };

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <SignIn navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when isUserNameRequired', () => {
    const output = render(
      <MockProvider isUserNameRequired>
        <SignIn navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
