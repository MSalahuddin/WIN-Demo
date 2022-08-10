import React from 'react';
import { render } from 'react-native-testing-library';

import TopSearchBar from '../../../js/components/game-room/TopBarSearch';
import MockProvider from '../../MockProvider';

describe('Component BottomNavigator', () => {
  const onSearch = jest.fn();
  const onSelect = jest.fn();
  const onExploreTap = jest.fn();
  test('renders regular top bar correctly', () => {
    const output = render(
      <MockProvider>
        <TopSearchBar
          onSearch={onSearch}
          onSelect={onSelect}
          categoryIndex={1}
          onExploreTap={onExploreTap}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });



});
