import React from 'react';
import { render } from 'react-native-testing-library';
import MockProvider from '../../MockProvider';
import DealOfTheDayPopUp from '../../../js/components/common/DealOfTheDayPopUp';

describe('Component PromoCard', () => {
  const createYourAccount = jest.fn();
  const data = {
    androidProductId: 'ww_beta_token_pack_550',
    dealOfDayId: 48,
    iosProductId: 'ww_beta_token_pack_550',
    isDealActive: true,
    isVip: true,
    localizedPrice: 'Rs 820.00',
    newValue: 785,
    tokenPackAndroid: {
      androidProductId: 'ww_beta_token_pack_550',
      createdAt: null,
      createdBy: null,
      description: null,
      iOSProductId: 'ww_beta_token_pack_550',
      imageUrl: 'https://wwstagingdata.blob.core.windows.net/images/tokenpacks/550%403x.png',
      isAvailable: true,
      isOnSale: true,
      name: 'BASIC PACK',
      promoCodes: null,
      ribbonColor: null,
      ribbonName: null,
      saleTokenAmount: 300,
      tokenAmount: 485,
      tokenPackId: 1,
      updatedAt: '2020-10-01T20:30:28.41889',
      updatedBy: 'Admin,Player : testcf'
    },
    tokenPackIOS: {
      androidProductId: 'ww_beta_token_pack_550',
      createdAt: null,
      createdBy: null,
      description: null,
      iOSProductId: 'ww_beta_token_pack_550',
      imageUrl: 'https://wwstagingdata.blob.core.windows.net/images/tokenpacks/550%403x.png',
      isAvailable: true,
      isOnSale: true,
      name: 'BASIC PACK',
      promoCodes: null,
      ribbonColor: null,
      ribbonName: null,
      saleTokenAmount: 300,
      tokenAmount: 485,
      tokenPackId: 1,
      updatedAt: '2020-10-01T20:30:28.41889',
      updatedBy: 'Admin,Player : testcf'
    },
    value: 300
  };

  test('when user logged in', () => {
    const output = render(
      <MockProvider>
        <DealOfTheDayPopUp isUserLoggedIn isVisible data={data} createYourAccount={createYourAccount} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('when user logged out', () => {
    const output = render(
      <MockProvider>
        <DealOfTheDayPopUp isUserLoggedIn={false} isVisible data={data} createYourAccount={createYourAccount} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
