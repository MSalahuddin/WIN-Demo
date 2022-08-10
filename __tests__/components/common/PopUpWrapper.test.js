import React from 'react';
import { render } from 'react-native-testing-library';

import PopUpWrapper from '../../../js/components/common/PopUpWrapper';
import MockProvider from '../../MockProvider';

describe('Component PopUpWrapper', () => {
  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <PopUpWrapper />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when isCreateAccountPopUpShown', () => {
    const output = render(
      <MockProvider isCreateAccountPopUpShown>
        <PopUpWrapper />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when isBecomeVipPopUpShown', () => {
    const output = render(
      <MockProvider isBecomeVipPopUpShown>
        <PopUpWrapper />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
