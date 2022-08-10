import React from 'react';
import { render } from 'react-native-testing-library';

import PromoCodeBox from '../../../js/components/game-card-reload/PromoCodeBox';

describe('Component PromoCodeBox', () => {
  test('renders correctly', () => {
    const setPromoCode = jest.fn();
    const onPromoCodeEnter = jest.fn();
    const setIsPromoCodeCorrect = jest.fn();
    const setIsPromoCodeValid = jest.fn();

    const output = render(
      <PromoCodeBox
        setPromoCode={setPromoCode}
        onPromoCodeEnter={onPromoCodeEnter}
        setIsPromoCodeCorrect={setIsPromoCodeCorrect}
        setIsPromoCodeValid={setIsPromoCodeValid}
        isPromoCodeCorrect={null}
      />
    );
    expect(output).toMatchSnapshot();
  });
});
