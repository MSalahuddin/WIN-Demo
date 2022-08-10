import React from 'react';
import { render } from 'react-native-testing-library';

import Toggle from '../../../js/components/common/Toggle';

describe('Component Toggle', () => {
  const onToggle = jest.fn();

  test('renders correctly when it is enabled', () => {
    const output = render(<Toggle enabled onToggle={onToggle} label="a" />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when it is enabled=false', () => {
    const output = render(<Toggle enabled={false} onToggle={onToggle} label="a" />);
    expect(output).toMatchSnapshot();
  });
});
