import React from 'react';
import { render } from 'react-native-testing-library';

import DotComponent from '../../../js/components/common/Dot';

describe('Component Dot', () => {
  test('renders correctly with default props', () => {
    const output = render(<DotComponent />);
    expect(output).toMatchSnapshot();
  });
  test('renders correctly when active', () => {
    const output = render(<DotComponent isActive />);
    expect(output).toMatchSnapshot();
  });
  test('renders correctly when not active', () => {
    const output = render(<DotComponent isActive={false} />);
    expect(output).toMatchSnapshot();
  });
  test('renders correctly with different size', () => {
    const output = render(<DotComponent size={20} />);
    expect(output).toMatchSnapshot();
  });
  test('renders correctly with different color', () => {
    const output = render(<DotComponent dotColor="#000" />);
    expect(output).toMatchSnapshot();
  });
});
