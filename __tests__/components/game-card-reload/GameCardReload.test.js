import React from 'react';
import { render } from 'react-native-testing-library';

import GameCardReload from '../../../js/components/game-card-reload';
import MockProvider from '../../MockProvider';

describe('Component GameCardReload', () => {
  const navigation = (initialPage = 0) => ({
    dispatch: jest.fn(),
    navigate: jest.fn(),
    state: {
      routeName: '',
      params: {
        initialPage
      }
    }
  });

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <GameCardReload navigation={navigation()} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly for isUserLoggedIn', () => {
    const output = render(
      <MockProvider isUserLoggedIn>
        <GameCardReload navigation={navigation()} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when initialPage={1}', () => {
    const output = render(
      <MockProvider>
        <GameCardReload navigation={navigation(1)} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
