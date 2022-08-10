import React from 'react';
import { render } from 'react-native-testing-library';

import AchievementCard from '../../../js/components/achievements/AchievementCard';

describe('Component AchievementCard', () => {
  const achievementDetails = { achievementUnit: 2 };
  test('renders AchievementCard correctly when awarded={true}', () => {
    const achievementInfo1 = {
      achievementDetails,
      achievementName: '',
      awarded: true,
      awardedAt: '',
      imageUrl: '',
      maxProgress: 10,
      progress: 10
    };
    const output = render(<AchievementCard achievementInfo={achievementInfo1} />);
    expect(output).toMatchSnapshot();
  });

  test('renders AchievementCard correctly when awarded={false}', () => {
    const achievementInfo2 = {
      achievementDetails,
      achievementName: '',
      awarded: false,
      awardedAt: '',
      imageUrl: '',
      maxProgress: 10,
      progress: 5
    };
    const output = render(<AchievementCard achievementInfo={achievementInfo2} />);
    expect(output).toMatchSnapshot();
  });
});
