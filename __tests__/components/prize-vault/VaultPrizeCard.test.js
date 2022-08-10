import React from 'react';
import { render } from 'react-native-testing-library';

import VaultPrizeCard from '../../../js/components/prize-vault/VaultPrizeCard';
import { PRIZE_STATUS } from '../../../js/constants';
import MockProvider from '../../MockProvider';

describe('Component VaultPrizeCard', () => {
  test('renders correctly for shipped type', () => {
    const output = render(
      <MockProvider>
        <VaultPrizeCard
          imageUrl="imageURL"
          title="title"
          type={PRIZE_STATUS.SHIPPED}
          actionDatetime="2012-01-26T13:51:50.417-07:00"
          onInfoPress={() => {}}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
  test('renders correctly for swapped type', () => {
    const output = render(
      <MockProvider>
        <VaultPrizeCard
          imageUrl="imageURL"
          title="title"
          type={PRIZE_STATUS.SWAPPED}
          actionDatetime="2012-01-26T13:51:50.417-07:00"
          onInfoPress={() => {}}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
  test('renders correctly for packing type', () => {
    const output = render(
      <MockProvider>
        <VaultPrizeCard
          imageUrl="imageURL"
          title="title"
          type={PRIZE_STATUS.PACKING}
          actionDatetime="2012-01-26T13:51:50.417-07:00"
          onInfoPress={() => {}}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
  test('renders correctly for new type', () => {
    const output = render(
      <MockProvider>
        <VaultPrizeCard imageUrl="imageURL" title="title" type={PRIZE_STATUS.NEW} onInfoPress={() => {}} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly for new type and hideSwapButton={true}', () => {
    const output = render(
      <MockProvider>
        <VaultPrizeCard
          imageUrl="imageURL"
          title="title"
          type={PRIZE_STATUS.NEW}
          hideSwapButton
          onInfoPress={() => {}}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
