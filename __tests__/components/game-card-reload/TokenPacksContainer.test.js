import React from 'react';
import { render } from 'react-native-testing-library';

import MockProvider from '../../MockProvider';
import TokenPacksContainer from '../../../js/components/game-card-reload/TokenPacksContainer';



describe('Component TokenPacksContainer', () => {
  test('renders correctly when isUserLoggedIn', () => {
    const output = render(
      <MockProvider isUserLoggedIn>
        <TokenPacksContainer isUserLoggedIn />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when isUserLoggedIn={false}', () => {
    const output = render(
      <MockProvider>
        <TokenPacksContainer isUserLoggedIn={false} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
