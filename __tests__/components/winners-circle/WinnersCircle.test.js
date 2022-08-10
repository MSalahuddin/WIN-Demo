import React from 'react';
import { render } from 'react-native-testing-library';

import WinnersCircle from '../../../js/components/winners-circle';
import MockProvider from '../../MockProvider';

describe('Component WinnersCircle', () => {
  const navigation = { dispatch: jest.fn(), navigate: jest.fn() };
  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <WinnersCircle navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
