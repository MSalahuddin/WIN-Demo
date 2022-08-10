import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import AccountProfileButtons from '../../../js/components/account-profile/AccountProfileButtons';
import MockProvider from '../../MockProvider';

describe('Component AccountProfileButtons', () => {
  const navigation = {
    goBack: jest.fn(),
    replace: jest.fn(),
    navigate: jest.fn()
  };

  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <AccountProfileButtons navigation={navigation} />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });



  test('calls navigate when subscription button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <AccountProfileButtons navigation={navigation} />
      </MockProvider>
    );
    fireEvent(getByTestId('subscription-button'), 'press');
    expect(navigation.navigate).toHaveBeenCalled();
  });

  test('calls navigate when history button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <AccountProfileButtons navigation={navigation} />
      </MockProvider>
    );
    fireEvent(getByTestId('history-button'), 'press');
    expect(navigation.navigate).toHaveBeenCalled();
  });
});
