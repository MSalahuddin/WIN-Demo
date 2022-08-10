import React from 'react';
import { render } from 'react-native-testing-library';
import MockProvider from '../../MockProvider';
import PiggyBankPopUp from '../../../js/components/common/PiggyBankPopUp';

describe('Component PiggyBankPopUp', () => {
  const onClose = jest.fn();
  const data = {
    androidProductId: 'ww_beta_piggy_bank_golden_pack',
    iosProductId: 'ww_beta_piggy_bank_golden_pack',
    isActive: true,
    isPiggyBankUnlocked: true,
    maxTokens: 750,
    minTokens: 1,
    piggyBankId: 1,
    playerPiggyBankTokens: 0,
    tokenPercent: 2
  };

  test('show PiggyBankPopUp', () => {
    const output = render(
      <MockProvider>
        <PiggyBankPopUp data={data} isVisible onClose={onClose} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
