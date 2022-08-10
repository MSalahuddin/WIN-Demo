import React from 'react';
import { render } from 'react-native-testing-library';

import BottomNavigator from '../../../js/components/game-room/BottomBar';
import MockProvider from '../../MockProvider';

describe('Component BottomNavigator', () => {
  const onPiggyBankPress = jest.fn();
  const navigation = { replace: jest.fn(), navigate: jest.fn(), goBack: jest.fn(), dispatch: jest.fn() };
  test('renders regular BottomNavigator correctly', () => {
    const output = render(
      <MockProvider>
        <BottomNavigator
         navigation={navigation}
         onPiggyBankPress= {onPiggyBankPress}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

 
});
