import React from 'react';
import { render } from 'react-native-testing-library';

import ExpandedBottomNav from '../../../js/components/game-room/ExpandedBottomNav';
import MockProvider from '../../MockProvider';

describe('Component ExpandedBottomNav', () => {
    const onSearch = jest.fn();
    const navigation = { replace: jest.fn(), navigate: jest.fn(), goBack: jest.fn(), dispatch: jest.fn() };
  test('renders regular ExpandedBottomNav correctly', () => {
    const output = render(
      <MockProvider>
        <ExpandedBottomNav
          navigation={navigation}
          onSearch= {onSearch}

        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

 
});
