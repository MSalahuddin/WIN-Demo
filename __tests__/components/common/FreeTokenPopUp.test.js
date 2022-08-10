import React from 'react';
import { render } from 'react-native-testing-library';
import MockProvider from '../../MockProvider';
import FreeTokenPopUp from '../../../js/components/common/FreeTokenPopUp';

describe('Component FreeTokenPopUp', () => {
  const onPress = jest.fn();
  const freeToken = '1000';

  test('show FreeTokenPopUp', () => {
    const output = render(
      <MockProvider>
        <FreeTokenPopUp freeToken={freeToken} isVisible onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
