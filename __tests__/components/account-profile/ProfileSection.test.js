import React from 'react';
import { View } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';

import ProfileSection from '../../../js/components/account-profile/ProfileSection';
import MockProvider from '../../MockProvider';

describe('Component ProfileSection', () => {
  const onPress = jest.fn();

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <ProfileSection onPress={onPress} bannerTitle="" buttonTitle="">
          <View />
        </ProfileSection>
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when hideButton={true}', () => {
    const output = render(
      <MockProvider>
        <ProfileSection onPress={onPress} bannerTitle="" buttonTitle="" hideButton>
          <View />
        </ProfileSection>
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly with banner values', () => {
    const output = render(
      <MockProvider>
        <ProfileSection
          onPress={onPress}
          bannerTitle=""
          buttonTitle=""
          bannerType="NORMAL"
          backdropSubtext=""
          backdropText=""
          hideButton
        >
          <View />
        </ProfileSection>
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when SectionButton is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <ProfileSection onPress={onPress} bannerTitle="" buttonTitle="">
          <View />
        </ProfileSection>
      </MockProvider>
    );
    fireEvent(getByTestId('section-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });
});
