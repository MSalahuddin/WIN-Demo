import React from 'react';
import { render } from 'react-native-testing-library';

import PlayersPointContainer from '../../../js/components/leaderboard/PlayersPointContainer';
import MockProvider from '../../MockProvider';

describe('Component PlayersPointContainer', () => {
    const playerData = {
        position: 0,
        totalWins: 0,
        playerProfileImageUrl: 'a',
    };

    test('renders correctly when PlayerData passes', () => {
        const output = render(
            <MockProvider>
                <PlayersPointContainer playerData={playerData} />
            </MockProvider>
        );
        expect(output).toMatchSnapshot();
    });

});