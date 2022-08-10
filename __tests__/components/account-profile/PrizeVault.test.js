import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import PrizeVault from '../../../js/components/account-profile/PrizeVault';
import MockProvider from '../../MockProvider';

describe('Component PrizeVault', () => {
  const navigation = {
    navigate: jest.fn()
  };

  const recentPlayerPrizes = [{ prize: { name: 'a', imageUrl: 'a' } }];

  test('renders empty prize vault correctly', () => {
    const output = render(
      <MockProvider>
        <PrizeVault navigation={navigation} recentPlayerPrizes={[]} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders regular vault correctly', () => {
    const output = render(
      <MockProvider>
        <PrizeVault navigation={navigation} recentPlayerPrizes={recentPlayerPrizes} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls navigate when Prize Card is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <PrizeVault navigation={navigation} recentPlayerPrizes={recentPlayerPrizes} />
      </MockProvider>
    );
    fireEvent(getByTestId('prize-card'), 'press');
    expect(navigation.navigate).toHaveBeenCalled();
  });

  test('calls navigate when Profile Section is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <PrizeVault navigation={navigation} recentPlayerPrizes={recentPlayerPrizes} />
      </MockProvider>
    );
    fireEvent(getByTestId('profile-section'), 'press');
    expect(navigation.navigate).toHaveBeenCalled();
  });
});
