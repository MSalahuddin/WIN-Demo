import React from 'react';
import { render } from 'react-native-testing-library';

import VaultButton from '../../../js/components/prize-vault/VaultButton';
import { PRIZE_ACTION_TYPE } from '../../../js/constants';
import MockProvider from '../../MockProvider';

describe('Component VaultButton', () => {
  test('renders ship button correctly', () => {
    const output = render(
      <MockProvider>
        <VaultButton type={PRIZE_ACTION_TYPE.SHIP} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders swap button correctly', () => {
    const output = render(
      <MockProvider>
        <VaultButton type={PRIZE_ACTION_TYPE.SWAP} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
