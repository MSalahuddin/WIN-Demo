import React from 'react';
import { render } from 'react-native-testing-library';
import MockProvider from '../../MockProvider';
import NotificationsPopUp from '../../../js/components/common/NotificationsPopUp';
import { mobileChicken } from '../../../assets/images';

describe('Component NotificationsPopUp', () => {
  const onPress = jest.fn();
  const secondaryButtonOnPress = jest.fn();

  test('show NotificationsPopUp', () => {
    const output = render(
      <MockProvider>
        <NotificationsPopUp
          buttonText="a"
          bannerLabel="a"
          backdropText="a"
          icon={mobileChicken}
          isVisible
          onPress={onPress}
          secondaryButtonOnPress={secondaryButtonOnPress}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
});
