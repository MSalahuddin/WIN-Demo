import React from 'react';
import { render } from 'react-native-testing-library';

import RewardSection from '../../../js/components/game-result/RewardSection';
import { happyChicken } from '../../../assets/images';
import MockProvider from '../../MockProvider';

describe('Component RewardSection', () => {
  const onPress = jest.fn();
  const machineData = {
    prize: {
      imageUrl: '',
      name: 'test',
      ticketsValue: 1
    }
  };

  test('renders correctly when user is logged in', () => {
    const output = render(
      <MockProvider isUserLoggedIn>
        <RewardSection
          onPress={onPress}
          isGameWon
          lostMascot={happyChicken}
          machineData={machineData}
          rewardIndex={0}
          setRewardIndex={() => {}}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when user is not logged in', () => {
    const output = render(
      <MockProvider isUserLoggedIn={false}>
        <RewardSection
          onPress={onPress}
          isGameWon
          lostMascot={happyChicken}
          machineData={machineData}
          rewardIndex={0}
          setRewardIndex={() => {}}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
