import React from 'react';
import { render } from 'react-native-testing-library';

import MockProvider from '../../MockProvider';
import LeaderboardPreview from '../../../js/components/account-profile/LeaderboardPreview';

describe('Component LeaderboardPreview', () => {
  const navigation = { navigate: jest.fn() };

  const leaderboardData = {
    top10: [
      {
        userName: 'Player0',
        totalPoints: 54321,
        position: 0
      },
      {
        userName: 'Player1',
        totalPoints: 54322,
        position: 1
      },
      {
        userName: 'Player2',
        totalPoints: 54323,
        position: 2
      },
      {
        userName: 'Player3',
        totalPoints: 54324,
        position: 3
      }
    ],
    player: {
      userName: 'PlayerOne',
      totalPoints: 54321,
      position: 45
    },
    lastUpdate: '2020-04-28T00:00:00+00:00',
    lastUpdateDuration:'86.11:52:04.2731777'
  };

  const leaderboardDataInTop4 = {
    top10: [
      {
        userName: 'Player0',
        totalPoints: 54321,
        position: 0
      },
      {
        userName: 'PlayerOne',
        totalPoints: 54321,
        position: 1
      },
      {
        userName: 'Player2',
        totalPoints: 54323,
        position: 2
      },
      {
        userName: 'Player3',
        totalPoints: 54324,
        position: 3
      }
    ],
    player: {
      userName: 'PlayerOne',
      totalPoints: 54321,
      position: 1
    },
    lastUpdate: '2020-04-28T00:00:00+00:00',
    lastUpdateDuration:'86.11:52:04.2731777'
  };

  let dateNowMock;

  beforeAll(() => {
    dateNowMock = jest.spyOn(Date, 'now').mockImplementation(() => new Date(1588105067000));
  });
  afterAll(() => {
    dateNowMock.mockRestore();
  });

  test('renders correctly when top10 is available and user is not in top 4', () => {
    const output = render(
      <MockProvider>
        <LeaderboardPreview data={leaderboardData} navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when user is in the top 4', () => {
    const output = render(
      <MockProvider>
        <LeaderboardPreview data={leaderboardDataInTop4} navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when user is not on leaderboard', () => {
    leaderboardData.player = null;
    const output = render(
      <MockProvider>
        <LeaderboardPreview data={leaderboardData} navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when top10 data is not available', () => {
    const output = render(
      <MockProvider>
        <LeaderboardPreview data={{ top10: [], player: null, lastUpdate: null }} navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
