import React from 'react';
import { render } from 'react-native-testing-library';

import PointProgressBar from '../../../js/components/common/ProgressBar';

describe('Component Text', () => {
    test('stack Em progress bar renders correctly ', () => {
        const output = render(<PointProgressBar
            displayProgressInText={false}
            startPoint={0}
            EndPoint={0}
        />);
        expect(output).toMatchSnapshot();
    });
});
