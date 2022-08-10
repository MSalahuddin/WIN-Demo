import React from 'react';
import { render } from 'react-native-testing-library';
import MockProvider from '../../MockProvider';
import ReferringRewardPopUp from '../../../js/components/common/ReferringRewardPopUp';

describe('Component InviteFriendPopUp', () => {
  const tokens = '1000';
  const isVisible = true;
  const onPress = jest.fn();

  test('sender mode', () => {
    const output = render(
      <MockProvider>
        <ReferringRewardPopUp isVisible={isVisible} mode="sender" tokens={tokens} onPress={onPress} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('receiver mode', () => {
    const output = render(
      <MockProvider>
        <ReferringRewardPopUp isVisible={isVisible} mode="receiver" tokens={tokens} onPress={onPress} />
      </MockProvider>

    );
    expect(output).toMatchSnapshot();
  });
});
