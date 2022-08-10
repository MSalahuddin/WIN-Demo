import React from 'react';
import { render } from 'react-native-testing-library';

import GameRoom from '../../../js/components/game-room';
import MockProvider from '../../MockProvider';

describe('Component GameRoom', () => {
  const navigation = { replace: jest.fn(), navigate: jest.fn(), goBack: jest.fn(), dispatch: jest.fn() };

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <GameRoom navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });


});
