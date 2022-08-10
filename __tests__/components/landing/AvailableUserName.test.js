

import React from 'react';
import { render } from 'react-native-testing-library';
import AvailableUserName from '../../../js/components/landing/AvailableUserName';

describe('Component ChooseUserName', () => {

    const data = ['name1','name2','name3']
    const onSelect = jest.fn();

    test('renders correctly', () => {
        const output = render(
          <AvailableUserName
            data={data}
            onSelect={onSelect}
          />
        );
        expect(output).toMatchSnapshot();
      });
});