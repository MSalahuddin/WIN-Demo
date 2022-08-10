import React from 'react';
import { render } from 'react-native-testing-library';
import MockProvider from '../../MockProvider';
import PurchasePrompt from '../../../js/components/common/PurchasePrompt';

describe('Component PurchasePrompt', () => {

  const isVisible = true;
  const data = {
    "activeRefillTokenPackProductId": "ww_beta_token_pack_refill_basic",
    "showPopup": true,
    "tokenAmount": 500,
    "localizedPrice": "l00"
  }

  test('renders PurchasePrompt', () => {
    const output = render(
      <MockProvider>
        <PurchasePrompt 
          isVisible={isVisible} 
          data={data} 
          />
      </MockProvider>

    );
    expect(output).toMatchSnapshot();
  });

});
