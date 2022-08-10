import React from 'react';
import { render } from 'react-native-testing-library';

import AppWebView from '../../../js/components/common/AppWebView';

describe('Component AppWebView', () => {
  const navigation = {
    goBack: jest.fn(),
    state: {
      params: {
        url: ''
      }
    }
  };

  test('renders correctly', () => {
    const output = render(<AppWebView navigation={navigation} />);
    expect(output).toMatchSnapshot();
  });
});
