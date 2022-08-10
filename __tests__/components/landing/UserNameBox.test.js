import React from 'react';
import { render } from 'react-native-testing-library';

import UserNameBox from '../../../js/components/landing/UserNameBox';

describe('Component UserNameBox', () => {
  test('renders correctly', () => {
    const onChangeText = jest.fn();
    const onFocus = jest.fn();
    const output = render(<UserNameBox isOnFocus onChangeText={onChangeText} onFocus={onFocus} />);
    expect(output).toMatchSnapshot();
  });
});
