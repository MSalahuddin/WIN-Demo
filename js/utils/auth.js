/* istanbul ignore file */
import Auth0 from 'react-native-auth0';
import Config from 'react-native-config';

import { updateStoredTokens } from './keychainUtils';

const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_SCOPE } = Config;

export const auth0 = new Auth0({ domain: AUTH0_DOMAIN, clientId: AUTH0_CLIENT_ID });

// Giving a second window period for expiresAt
export const isAuthenticated = expiresAt => new Date().getTime() <= expiresAt - 1000;

export const shouldRefreshToken = ({ isAnon, expiresAt, refreshToken }) =>
  !isAnon && !isAuthenticated(expiresAt) && !!refreshToken;

export const refreshTokens = async refreshToken => {
  const credentials = await auth0.auth.refreshToken({
    scope: AUTH0_SCOPE,
    refreshToken
  });

  const storedData = { ...credentials, refreshToken, isAnon: false };
  try {
    await updateStoredTokens(storedData);
  } catch (_) {
    // Fail silently
    // If two or more calls trigger the refresh token function simultaneously, the keychain
    // throws an error while we try to write values to it at the same time.
    // Therefore, we fail silently here. This is fine because calling the refreshToken
    // function twice at the same time will result in the same response data
  }

  return storedData;
};
