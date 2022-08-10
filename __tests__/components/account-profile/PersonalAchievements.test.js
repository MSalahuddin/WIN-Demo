import React from 'react';
import { render } from 'react-native-testing-library';

import MockProvider from '../../MockProvider';
import PersonalAchievements from '../../../js/components/account-profile/PersonalAchievements';

describe('Component PersonalAchievements', () => {
  const navigation = {
    goBack: jest.fn(),
    replace: jest.fn(),
    navigate: jest.fn()
  };

  const vipBannerOnPress = jest.fn();

  const profileData = {
    userName: '',
    firstName: '',
    lastName: ''
  };

  const achievementData = [
    {
      playerId: 1,
      achievementName: '',
      imageUrl: '',
      progress: 1,
      maxProgress: 2
    },
    { playerId: 1, achievementName: '', imageUrl: '', progress: 1, maxProgress: 2 }
  ];

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <PersonalAchievements
          navigation={navigation}
          medalData={achievementData}
          vipBannerOnPress={vipBannerOnPress}
          profileData={profileData}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
