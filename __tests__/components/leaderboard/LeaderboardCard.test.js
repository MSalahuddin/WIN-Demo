import React from 'react';
import { render } from 'react-native-testing-library';

import LeaderBoardCards from '../../../js/components/leaderboard/LeaderBoardCards';
import MockProvider from '../../MockProvider';

describe('Component LeaderboardCard', () => {
  const leaderboardData = {
    position: 0,
    playerProfileImageUrl: 'a',
    totalWins: 0,
    userName: '',
    vipLevel: 0
  };

  test('renders correctly when isCurrentPlayer={true}', () => {
    const output = render(
      <MockProvider>
        <LeaderBoardCards leaderboardData={leaderboardData} isCurrentPlayer />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when isCurrentPlayer={false}', () => {
    const output = render(
      <MockProvider>
        <LeaderBoardCards
          leaderboardData={leaderboardData}
          isCurrentPlayer={false}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when playerProfileImageUrl=null', () => {
    leaderboardData.playerProfileImageUrl = null;
    const output = render(
      <MockProvider>
        <LeaderBoardCards
          leaderboardData={leaderboardData}
          isCurrentPlayer={false}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });


});
