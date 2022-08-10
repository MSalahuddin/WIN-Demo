import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import MockProvider from '../../MockProvider';
import ProfileHeader from '../../../js/components/common/ProfileHeader';

describe('Component ProfileHeader', () => {
  const navigation = { dispatch: jest.fn(), navigate: jest.fn(), goBack: jest.fn() };

  test('renders component with profile image correctly', () => {
    const output = render(
      <MockProvider>
        <ProfileHeader navigation={navigation} isProfileImageShown />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders component when isUserLoggedIn', () => {
    const output = render(
      <MockProvider isUserLoggedIn>
        <ProfileHeader navigation={navigation} isProfileImageShown />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders component with back button correctly', () => {
    const output = render(
      <MockProvider>
        <ProfileHeader navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls goBack when profile icon is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <ProfileHeader navigation={navigation} />
      </MockProvider>
    );
    fireEvent(getByTestId('back-button'), 'press');
    expect(navigation.goBack).toHaveBeenCalled();
  });

  test('calls navigate when coin icon is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <ProfileHeader navigation={navigation} />
      </MockProvider>
    );
    fireEvent(getByTestId('coin-button'), 'press');
    expect(navigation.navigate).toHaveBeenCalled();
  });

  test('calls navigate when ticket is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <ProfileHeader navigation={navigation} />
      </MockProvider>
    );
    fireEvent(getByTestId('ticket-button'), 'press');
    expect(navigation.navigate).toHaveBeenCalled();
  });
});
