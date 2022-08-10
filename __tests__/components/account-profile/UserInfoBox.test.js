import React from 'react';
import { render } from 'react-native-testing-library';

import MockProvider from '../../MockProvider';
import UserInfoBox from '../../../js/components/account-profile/UserInfoBox';

describe('Component UserInfoBox', () => {
  const vipBannerOnPress = jest.fn();

  const profileData = {
    userName: '',
    firstName: '',
    lastName: ''
  };

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <UserInfoBox vipBannerOnPress={vipBannerOnPress} profileData={profileData} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when isVip', () => {
    const output = render(
      <MockProvider value={{ isVip: true }}>
        <UserInfoBox vipBannerOnPress={vipBannerOnPress} profileData={profileData} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
