import React from 'react';
import { render } from 'react-native-testing-library';

import SubscriptionContainer from '../../../js/components/game-card-reload/SubscriptionContainer';
import MockProvider from '../../MockProvider';

describe('Component SubscriptionContainer', () => {
  test('renders correctly when isUserLoggedIn={false}', () => {
    const output = render(
      <MockProvider>
        <SubscriptionContainer isUserLoggedIn={false} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when isUserLoggedIn', () => {
    const output = render(
      <MockProvider isUserLoggedIn>
        <SubscriptionContainer isUserLoggedIn />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
