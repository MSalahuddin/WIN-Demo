import React from 'react';
import { render } from 'react-native-testing-library';

import MockProvider from '../../MockProvider';
import AuthenticationInterface from '../../../js/components/landing/AuthenticationInterface';
import { SCREENS } from '../../../js/constants';

describe('Component AuthenticationInterface', () => {
  const navigation = {
    dispatch: jest.fn(),
    navigate: jest.fn(),
    goBack: () => {},
    replace: () => {},
    state: { params: { newUserCredentials: {} }, routeName: '' }
  };

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <AuthenticationInterface navigation={navigation} type="" />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when isUserNameRequired', () => {
    const output = render(
      <MockProvider>
        <AuthenticationInterface navigation={navigation} type="" isUserNameRequired />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly for Sign In', () => {
    const output = render(
      <MockProvider>
        <AuthenticationInterface navigation={navigation} type={SCREENS.SIGN_IN} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  // TODO: Add test back for custom login UI
  // test('calls login when social button is pressed', () => {
  //   const { getAllByType } = render(
  //     <MockProvider>
  //       <AuthenticationInterface navigation={navigation} type={SCREENS.SIGN_IN} />
  //     </MockProvider>
  //   );
  //   const socialButtons = getAllByType(SocialButton);
  //   socialButtons.forEach(button => {
  //     fireEvent(button, 'press');
  //     expect(login).toHaveBeenCalled();
  //   });
  // });
});
