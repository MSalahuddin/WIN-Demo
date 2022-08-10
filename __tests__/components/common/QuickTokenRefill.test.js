import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import MockProvider from '../../MockProvider';
import QuickTokenRefill from '../../../js/components/common/QuickTokenRefill';



describe('Component QuickTokenRefill', () => {
    const onPress = jest.fn();
    const onPressClose = jest.fn();
    test('renders correctly when isUserLoggedIn', () => {
        const output = render(
            <MockProvider>
                <QuickTokenRefill
                    isVisible
                    onPress={onPress}
                    onPressClose={onPressClose}
                />
            </MockProvider>
        );
        expect(output).toMatchSnapshot();
    });

    test('renders correctly when isVisible={false}', () => {
        const output = render(
            <MockProvider>
                <QuickTokenRefill isVisible={false}
                    onPress={onPress}
                    onPressClose={onPressClose}
                />
            </MockProvider>
        );
        expect(output).toMatchSnapshot();
    });

    test('renders correctly when onPress', () => {
        const {getByTestId} = render(
            <MockProvider>
                <QuickTokenRefill
                    isVisible
                    onPress={onPress}
                    onPressClose={onPressClose}
                />
            </MockProvider>
        );
        fireEvent(getByTestId('quick-token-store-button'), 'press');
      expect(onPress).toHaveBeenCalled();
    });
    test('renders correctly when onPressClose', () => {
        const {getByTestId} = render(
            <MockProvider>
                <QuickTokenRefill
                    isVisible
                    onPress={onPress}
                    onPressClose={onPressClose}
                />
            </MockProvider>
        );
        fireEvent(getByTestId('exit-circle'), 'press');
        expect(onPressClose).toHaveBeenCalled();
    });
});
