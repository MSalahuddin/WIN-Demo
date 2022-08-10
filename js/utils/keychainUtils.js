import * as Keychain from 'react-native-keychain';
import Config from 'react-native-config';

const { AUTH0_DOMAIN } = Config;
const username = 'tokenInfo';
const calculateExpiration = expiresIn => JSON.stringify(expiresIn * 1000 + new Date().getTime());

export const getTokens = async () => {
  try {
    const storedTokens = await Keychain.getInternetCredentials(AUTH0_DOMAIN);

    if (storedTokens && storedTokens.password) {
      return JSON.parse(storedTokens.password);
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
};

export const storeTokens = async ({
  accessToken,
  expiresIn,
  idToken,
  tokenType,
  userId,
  refreshToken,
  isAnon = false
}) => {
  const password = JSON.stringify({
    accessToken,
    expiresAt: calculateExpiration(expiresIn),
    idToken,
    tokenType,
    userId,
    isAnon,
    refreshToken
  });
  await Keychain.setInternetCredentials(AUTH0_DOMAIN, username, password);
};

export const updateStoredTokens = async ({
  accessToken,
  expiresIn,
  idToken,
  tokenType,
  isAnon = false,
  refreshToken
}) => {
  const tokenPayload = await getTokens();
  const password = JSON.stringify({
    accessToken: accessToken || tokenPayload.accessToken,
    expiresAt: calculateExpiration(expiresIn) || tokenPayload.expiresAt,
    idToken: idToken || tokenPayload.idToken,
    tokenType: tokenType || tokenPayload.tokenType,
    isAnon,
    refreshToken: refreshToken || tokenPayload.refreshToken
  });

  await Keychain.setInternetCredentials(AUTH0_DOMAIN, username, password);
};

export const clearTokens = async () => {
  await Keychain.resetInternetCredentials(AUTH0_DOMAIN);
};
