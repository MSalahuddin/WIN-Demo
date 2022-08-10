import React from 'react';
import { Linking } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';
import sinon from 'sinon';

import GeoRestrictedModal from '../../../js/components/common/GeoRestrictedModal';
import MockProvider from '../../MockProvider';

describe('Component GeoRestrictedModal', () => {
  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <GeoRestrictedModal />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when geoRestrictedStatusCode = 451', () => {
    const output = render(
      <MockProvider geoRestrictedStatusCode={451}>
        <GeoRestrictedModal />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when geoRestrictedStatusCode = 551', () => {
    const output = render(
      <MockProvider geoRestrictedStatusCode={551}>
        <GeoRestrictedModal />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls Linking when geo-restricted-popup is pressed', () => {
    const openURLSpy = sinon.spy(Linking, 'openURL');
    const { getByTestId } = render(
      <MockProvider>
        <GeoRestrictedModal />
      </MockProvider>
    );
    fireEvent(getByTestId('geo-restricted-popup'), 'press');
    expect(openURLSpy).toHaveBeenCalled();
  });
});
