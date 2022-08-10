import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import AchievementMedals from '../../../js/components/account-profile/AchievementMedals';

describe('Component AchievementMedals', () => {
  const navigation = { replace: jest.fn(), navigate: jest.fn(), goBack: jest.fn() };
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
    const output = render(<AchievementMedals data={achievementData} navigation={navigation} />);
    expect(output).toMatchSnapshot();
  });

  test('calls navigate when medal icon is pressed', () => {
    const { getByTestId } = render(<AchievementMedals data={achievementData} navigation={navigation} />);
    fireEvent(getByTestId('medal-button'), 'press');
    expect(navigation.navigate).toHaveBeenCalled();
  });
});
