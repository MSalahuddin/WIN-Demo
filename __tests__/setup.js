import React from 'react';
import * as ReactNative from 'react-native';
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
import mock from 'react-native-permissions/mock'

jest.mock('react-native-permissions', () => { 
  mock.requestNotifications()
  mock.openSettings()
  mock.requestNotifications() 
})

jest.mock('getsocial-react-native-sdk', () => ({ 
  registerForPushNotifications: jest.fn(),
  onNotificationReceived: jest.fn(),
  sendInvite:  jest.fn(),
  getInviteChannels: jest.fn(),
}))


jest.mock('react-native-config', () => {
  return {
    AUTH0_DOMAIN: 'test.com',
    AUTH0_CLIENT_ID: 'test',
    AUTH0_SCOPE: '',
    AUTH0_BASE_URL: '',
    LOG_OUT_ENABLED: 'false',
    WW_API: '',
    AUTH0_FIELD_URL: '',
    SERVER_SOCKET_URL: '',
    WINNER_CIRCLE_FILTER_ENABLED: true
  };
});

jest.mock('react-navigation', () => ({
  NavigationActions: {
    navigate: jest.fn()
  },
  NavigationEvents: 'NavigationEvents',
  StackActions: { reset: jest.fn() },
  withNavigation: Component => props => (
    <Component navigation={{ dispatch: jest.fn(), navigate: jest.fn(), setParams: jest.fn() }} {...props} />
  )
}));

jest.mock('react-native-device-info', () => ({
  hasNotch: jest.fn(),
  getUniqueId: jest.fn()
}));
jest.mock('rn-keyboard-sticky-view', () => ({
  KeyboardStickyView: jest.fn()
}));
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

jest.mock('react-native-amplitude-analytics', () => () => ({ logEvent: jest.fn() }));



jest.autoMockOff();
jest.mock('react-native-keychain', () => ({
  setInternetCredentials: jest.fn(),
  getInternetCredentials: jest.fn(),
  resetInternetCredentials: jest.fn()
}));

jest.mock('react-native-iap', () => ({
  purchaseErrorListener: jest.fn(),
  purchaseUpdatedListener: jest.fn()
}));

jest.doMock('react-native', () => {
  // Extend ReactNative
  return Object.setPrototypeOf(
    {
      // Redefine an export, like a component
      Alert: {
        ...ReactNative.Alert,
        alert: jest.fn()
      },
      NativeModules: {
        ...ReactNative.NativeModules,
        RNCNetInfo: {
          getCurrentConnectivity: jest.fn(),
          isConnectionMetered: jest.fn(),
          addListener: jest.fn(),
          removeListeners: jest.fn()
        }
      }
    },
    ReactNative
  );
});

jest.mock('@react-native-community/viewpager', () => 'ViewPager');

Date.now = jest.fn(() => new Date('2019-05-14T18:30:58.135Z').valueOf());

/* eslint-disable no-underscore-dangle */
jest.mock('react-native-sound', () => {
  let _filename = null;
  let _basePath = null;

  const SoundMocked = (filename, basePath, onError = jest.fn()) => {
    _filename = filename;
    _basePath = basePath;
    onError();
  };

  SoundMocked.prototype.basePath = () => _basePath;
  SoundMocked.prototype.filename = () => _filename;
  SoundMocked.prototype.getDuration = () => {};
  SoundMocked.prototype.pause = () => {};
  SoundMocked.prototype.play = () => {};
  SoundMocked.prototype.release = () => {};
  SoundMocked.prototype.reset = () => {};
  SoundMocked.prototype.setCategory = () => {};
  SoundMocked.prototype.stop = () => {};
  SoundMocked.prototype.setSpeakerphoneOn = () => {};
  SoundMocked.prototype.isLoaded = () => {};
  SoundMocked.prototype.isPlaying = () => {};

  SoundMocked.LIBRARY = 2;

  return SoundMocked;
});

jest.mock('react-native-localize', () => ({
  getLocales: jest.fn()
}));

jest.mock('react-native-video', () => 'Video');

jest.mock('react-native-fs', () => ({
  exists: jest.fn(),
  unlink: jest.fn(),
  downloadFile: jest.fn()
}));

jest.mock('react-native-share', () => ({
  default: jest.fn()
}));

jest.mock('react-native-branch', () => ({
  getLatestReferringParams: jest.fn(() => Promise.resolve({}))
}));

jest.mock('react-native-localize', () => ({
  getLocales: () => [{ countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false }]
}));

/* eslint-enable no-underscore-dangle */
