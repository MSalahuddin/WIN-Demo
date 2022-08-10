import sinon from 'sinon';
import * as Keychain from 'react-native-keychain';

import { getTokens, storeTokens, clearTokens, updateStoredTokens } from '../../js/utils/keychainUtils';

describe('keychainUtils/getTokens', () => {
  it('should call getInternetCredentials', () => {
    const spy = sinon.spy(Keychain, 'getInternetCredentials');
    getTokens();
    expect(spy.calledOnce).toBe(true);
    expect(getTokens().password).toBeUndefined();
    expect(spy.callCount).toBe(2);
  });
});
describe('keychainUtils/storeTokens', () => {
  const spy = sinon.spy(Keychain, 'setInternetCredentials');
  it('should call setInternetCredentials', () => {
    const tokens = { accessToken: '', idToken: '', tokenType: '', isAnon: true };
    storeTokens(tokens);
    expect(spy.calledOnce).toBe(true);
  });
  it('should call update setInternetCredentials', () => {
    const tokens = { accessToken: '', idToken: '', tokenType: '' };
    updateStoredTokens(tokens);
    expect(spy.calledOnce).toBe(true);
  });
});
describe('keychainUtils/clearTokens', () => {
  it('should call resetInternetCredentials', () => {
    const spy = sinon.spy(Keychain, 'resetInternetCredentials');
    clearTokens();
    expect(spy.calledOnce).toBe(true);
  });
});
