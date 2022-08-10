/* eslint-disable no-nested-ternary */
import React, { useEffect} from 'react';
import { StatusBar, LogBox } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { GetSocial } from 'getsocial-react-native-sdk';
import UserProvider, { UserContext } from './context/User.context';


import PopupProvider from './context/Popup.context';
import BackgroundMusicProvider from './context/BackgroundMusic.context';
import Navigation from './components/navigation';
import {
  LOCAL_STORAGE_NAME,
} from './constants';

if (__DEV__) {
  import('./ReactotronConfig');
}

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications


function App() {
  // We don't use Async Storage directly. This message came from Reactotron which would
  // only appear in dev


  const saveReferrerPayLoad = async (payload) => {
    await AsyncStorage.setItem(LOCAL_STORAGE_NAME.REFERRER_DATA, JSON.stringify(payload));
  }

  const getSocialHandler = () => {
    GetSocial.registerForPushNotifications()
    GetSocial.onNotificationReceived((notification, wasClicked) => {
      try {
        const data = JSON.parse(JSON.stringify(notification.action))
        const DATA = JSON.parse(data)
        saveReferrerPayLoad(DATA)
        if (wasClicked) {
          // click silently
        }
      }
      catch (e) {
        // catch silently
      }
    });
  }


  useEffect(() => {
    GetSocial.init()
    getSocialHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BackgroundMusicProvider>

      <PopupProvider>
        <UserProvider>

          <StatusBar hidden />
          <Navigation />
        </UserProvider>
      </PopupProvider>

    </BackgroundMusicProvider>
  );
}

export default App;
