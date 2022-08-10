import React from 'react';
import { render } from 'react-native-testing-library';
import MockProvider from '../../MockProvider';
import InviteFriendPopUp from '../../../js/components/common/InviteFriendPopUp';

describe('Component InviteFriendPopUp', () => {
  const onDissmiss = jest.fn();
  const footerPress = jest.fn();
  const onShare = jest.fn();
  const isVisible = true;

  test('renders InviteFriendPopUp', () => {
    const output = render(
      <MockProvider>
        <InviteFriendPopUp 
          isVisible={isVisible} 
          onDissmiss={onDissmiss} 
          footerPress={footerPress} 
          onShare={onShare} 
          />
      </MockProvider>

    );
    expect(output).toMatchSnapshot();
  });

});
