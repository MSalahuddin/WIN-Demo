import React from 'react';

import { UserContext } from '../js/context/User.context';
import { PopupContext } from '../js/context/Popup.context';
import { BackgroundMusicContext } from '../js/context/BackgroundMusic.context';

const firstName = '';
const freeToken = 0;
const geoRestrictedStatusCode = null;
const showNetworkAlert = true;
const isPersistedDataLoaded = true;
const isNetworkConnected = true;
const isVip = false;
const lastName = '';
const playerId = '';
const profilePicture = '';
const setIsUserLoggedIn = jest.fn();
const setUserName = jest.fn();
const ticketBonus = 0;
const tickets = 0;
const tokenBonus = 0;
const tokens = 0;
const setShowNetworkAlert = jest.fn();
const userName = '';
const vipPoints = 0;
const isMusicEnabled = true;
const isSoundEffectEnabled = true;
export const login = jest.fn();

const setIsCreateAccountPopUpShown = jest.fn();
const setIsBecomeVipPopUpShown = jest.fn();
const shippingInformation = {};
const setShippingInformation = jest.fn();
const isVipModalVisible = false;
const setIsVipModalVisible = jest.fn();
const playBackgroundMusic = jest.fn();
const pauseBackgroundMusic = jest.fn();
const playMusic = jest.fn();
const setIsMusicEnabled = jest.fn();
const setIsSoundEffectEnabled = jest.fn();
const playSoundEffect = jest.fn();
const setGeoRestrictedStatusCode = jest.fn();
const vipLevel = { vipLevelId: 1, points: 40, maxLevelId: 22, nextVipLevel: { points: 80, vipLevelId: 2 } };

/* eslint-disable react/prop-types */
const MockProvider = ({
  children,
  isUserLoggedIn = false,
  isUserNameRequired = false,
  isCreateAccountPopUpShown = false,
  isBecomeVipPopUpShown = false
}) => (
  <UserContext.Provider
    value={{
      firstName,
      isUserLoggedIn,
      isPersistedDataLoaded,
      isUserNameRequired,
      lastName,
      profilePicture,
      setIsUserLoggedIn,
      setUserName,
      userName,
      login,
      tokens,
      isVip,
      tickets,
      tokenBonus,
      ticketBonus,
      freeToken,
      playerId,
      setShippingInformation,
      shippingInformation,
      isVipModalVisible,
      setIsVipModalVisible,
      geoRestrictedStatusCode,
      setGeoRestrictedStatusCode,
      vipLevel,
      vipPoints
    }}
  >
    <PopupContext.Provider
      value={{
        isCreateAccountPopUpShown,
        setIsCreateAccountPopUpShown,
        isBecomeVipPopUpShown,
        setIsBecomeVipPopUpShown,
        showNetworkAlert,
        setShowNetworkAlert,
        isNetworkConnected
      }}
    >
      <BackgroundMusicContext.Provider
        value={{
          isMusicEnabled,
          isSoundEffectEnabled,
          playBackgroundMusic,
          pauseBackgroundMusic,
          playMusic,
          setIsMusicEnabled,
          setIsSoundEffectEnabled,
          playSoundEffect
        }}
      >
        {children}
      </BackgroundMusicContext.Provider>
    </PopupContext.Provider>
  </UserContext.Provider>
);
/* eslint-enable react/prop-types */

export default MockProvider;
