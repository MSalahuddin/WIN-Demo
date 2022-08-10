import React from 'react';
import { render } from 'react-native-testing-library';

import BonusContainer from '../../../js/components/game-card-reload/BonusContainer';
import MockProvider from '../../MockProvider';

describe('Component BonusContainer', () => {
    const navigation = { navigate: jest.fn(), dispatch: jest.fn() };

    test('renders correctly when', () => {
        const output = render(
            <MockProvider>
                <BonusContainer navigation={navigation} />
            </MockProvider>
        );
        expect(output).toMatchSnapshot();
    });
});
