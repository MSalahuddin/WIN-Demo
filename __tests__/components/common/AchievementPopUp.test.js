import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import AchievementPopUp from '../../../js/components/common/AchievementPopUp';
import MockProvider from '../../MockProvider';

describe('Component AchievementPopUp', () => {
  const dismissPopup = jest.fn();
  const navigateToAchievements = jest.fn();

  const achievementDataOne = [
    {
      achievementName: '',
      achievementDetails: { rewardPoints: 0 },
      imageUrl: ''
    }
  ];
  test('renders AchievementPopUp when there is one achievement', () => {
    const output = render(
      <MockProvider>
        <AchievementPopUp
          achievementData={achievementDataOne}
          isVisible
          navigateToAchievements={navigateToAchievements}
          dismissPopup={dismissPopup}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders AchievementPopUp when there is multiple achievement', () => {
    const achievementDataMultiple = [
      {
        achievementName: '',
        achievementDetails: { rewardPoints: 0 },
        imageUrl: ''
      },
      {
        achievementName: '',
        achievementDetails: { rewardPoints: 0 },
        imageUrl: ''
      }
    ];

    const output = render(
      <MockProvider>
        <AchievementPopUp
          achievementData={achievementDataMultiple}
          isVisible
          navigateToAchievements={navigateToAchievements}
          dismissPopup={dismissPopup}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls navigateToAchievements when main button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <AchievementPopUp
          achievementData={achievementDataOne}
          isVisible
          navigateToAchievements={navigateToAchievements}
          dismissPopup={dismissPopup}
        />
      </MockProvider>
    );
    fireEvent(getByTestId('achievement-popup-button'), 'press');
    expect(navigateToAchievements).toHaveBeenCalled();
  });

  test('calls dismissPopup when cancel button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <AchievementPopUp
          achievementData={achievementDataOne}
          isVisible
          navigateToAchievements={navigateToAchievements}
          dismissPopup={dismissPopup}
        />
      </MockProvider>
    );
    fireEvent(getByTestId('achievement-cancel-button'), 'press');
    expect(dismissPopup).toHaveBeenCalled();
  });
});
