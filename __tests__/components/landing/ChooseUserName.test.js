import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import MockProvider from '../../MockProvider';
import ChooseUserName from '../../../js/components/landing/ChooseUserName';

describe('Component ChooseUserName', () => {
  const navigation = { navigate: jest.fn() };
  const auth0Credentials = {
    accessToken: '',
    idToken: '',
    refreshToken: ''
  };

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <ChooseUserName navigation={navigation} auth0Credentials={auth0Credentials} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls navigate when TermsText is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <ChooseUserName navigation={navigation} auth0Credentials={auth0Credentials} />
      </MockProvider>
    );
    fireEvent(getByTestId('terms-text'), 'press');
    expect(navigation.navigate).toHaveBeenCalled();
  });

  test('fire changeText event', () => {
    const { getByTestId } = render(
      <MockProvider>
        <ChooseUserName navigation={navigation} auth0Credentials={auth0Credentials} />
      </MockProvider>
    );
    const userNameBox = getByTestId('user-name-box');
    fireEvent(userNameBox, 'onChangeText', 'test');
    expect(userNameBox.props.value).toBe('test');
  });
});
