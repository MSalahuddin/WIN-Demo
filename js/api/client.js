/* eslint-disable no-else-return */
/* istanbul ignore file */
import Config from 'react-native-config';
import axios from 'axios';
import { HEADER } from '../constants';
import { getTokens, clearTokens } from '../utils/keychainUtils';
import { refreshTokens, shouldRefreshToken } from '../utils/auth';

const client = axios.create({
  baseURL: Config.WW_API
});

client.interceptors.response.use(
  response => response,
  error => {
    if (error.message === "Network Error") {
      return Promise.reject(error);
    } else if (!error.response) {
      return Promise.reject(error);
    }
    else if (error.response.status === 401) {
      clearTokens();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }

);

client.interceptors.request.use(
  async configuration => {
    const originalConfig = configuration;
    try {

      originalConfig.headers[HEADER.Request_Origin] = 'App';

      const tokens = await getTokens();
      const TokenURL = `${Config.WW_API}/token`
      // handle 401 for token api
      if (!tokens && TokenURL === originalConfig.url) {
        return originalConfig;
      }
      if (!tokens && TokenURL !== originalConfig.url) {
        return 0
      }
      const { accessToken, refreshToken } = tokens;

      // Set auth header if empty
      if (!originalConfig.headers.Authorization && !!accessToken) {
        originalConfig.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Refresh token if it has expired for known users
      if (shouldRefreshToken(tokens)) {
        const refreshedCredentials = await refreshTokens(refreshToken);
        originalConfig.headers.Authorization = `Bearer ${refreshedCredentials.accessToken}`;
      }
      return originalConfig;
    } catch (_) {
      return originalConfig;
    }
  },
  err => Promise.reject(err)
);

export default client;
