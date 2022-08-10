import React from 'react';
import { render } from 'react-native-testing-library';

import WatchDisplay from '../../../js/components/common/WatchDisplay';
import { eye } from '../../../assets/images';

describe('Component WatchDisplay', () => {
  test('renders correctly', () => {
    const output = render(<WatchDisplay icon={eye} numberOfPeople={20} />);
    expect(output).toMatchSnapshot();
  });
});
