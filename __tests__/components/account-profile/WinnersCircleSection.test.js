import React from 'react';
import { render } from 'react-native-testing-library';

import WinnersCircleSection from '../../../js/components/account-profile/WinnersCircleSection';
import MockProvider from '../../MockProvider';

describe('Component WinnersCircleSection', () => {
  const navigation = {
    goBack: jest.fn(),
    replace: jest.fn(),
    navigate: jest.fn()
  };

  const prizes = [{ name: 'a', imageUrl: 'a', ticketsCost: 100 }];

  test('renders WinnersCircleSection correctly', () => {
    const output = render(
      <MockProvider>
        <WinnersCircleSection navigation={navigation} prizes={prizes} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
