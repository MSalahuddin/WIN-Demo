import React from 'react';
import { render } from 'react-native-testing-library';

import Shipping from '../../../js/components/shipping';
import MockProvider from '../../MockProvider';

describe('Component Shipping', () => {
  test('renders correctly', () => {
    const navigation = {
      navigate: jest.fn(),
      replace: jest.fn(),
      state: {
        params: {
          data: {
            playerPrizeId: 2,
            prize: { imageUrl: '', name: '', prizeId: 1 }
          }
        }
      }
    };

    const output = render(
      <MockProvider>
        <Shipping navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
