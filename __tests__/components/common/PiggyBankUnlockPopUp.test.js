import React from 'react';
import { render } from 'react-native-testing-library';
import PiggyBankUnlockPopUp from '../../../js/components/common/PiggyBankUnlockPopUp';
import MockProvider from '../../MockProvider';


describe('Component PiggyBankUnlockPopUp', () => {
  const onClose = jest.fn();
  const onUnlock  = jest.fn();
  const userNotLoggedIn  = jest.fn();

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

  test('render PiggyBankUnlockPopUp', () => {
    const output = render( 
    <MockProvider>
      <PiggyBankUnlockPopUp
          data={data}
          isVisibles
          onClose={onClose}
          onUnlock={onUnlock}
          userNotLoggedIn={userNotLoggedIn}
        />
      </MockProvider>
        );
    expect(output).toMatchSnapshot();
  });

 
});
