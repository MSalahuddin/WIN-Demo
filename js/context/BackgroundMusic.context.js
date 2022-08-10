/* istanbul ignore file */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../api';
import { playSound, SOUNDS, pauseSound } from '../soundUtils';
import { logEvent } from '../amplitudeUtils';
import { APP_STATE, ANALYTICS_EVENTS, LOCAL_STORAGE_NAME, BLUSHIFT_EVENT, BLUESHIFT_ANALYTICS_PROPERTIES } from '../constants';
import { logBlushiftEvent } from '../blushiftutils';

export const BackgroundMusicContext = React.createContext();

export default class BackgroundMusicProvider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      isMusicEnabled: false,
      isLobbyMusicPlaying: false,
      isSoundEffectEnabled: false,
      sound: SOUNDS.LOBBY_BACKGROUND_MUSIC,
    };
  }

  componentDidMount() {
    const { appState } = this.state;
    AppState.addEventListener('change', this.handleAppStateChange);
    if (appState !== APP_STATE.BACKGROUND) {
      this.checkSoundPreferences();
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  componentDidUpdate(prevProps, prevState) {
    const { appState } = this.state;
    if (prevState.appState !== appState) {
      if (appState !== APP_STATE.BACKGROUND) {
        this.checkSoundPreferences();
      }
    }
  }

  checkSoundPreferences = async () => {
    let soundPreferences = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.SOUND_PREFERENCES);
    soundPreferences = JSON.parse(soundPreferences);

    if (!soundPreferences || soundPreferences.isMusicEnabled === true) {
      this.setState({ isMusicEnabled: true }, () => this.playBackgroundMusic());
    }

    if (!soundPreferences || soundPreferences.isSoundEffectEnabled === true) {
      this.setState({ isSoundEffectEnabled: true });
    }
  };

  handleAppStateChange = async nextAppState => {
    const { appState } = this.state;
    const appInBackground = new RegExp(`${APP_STATE.INACTIVE}|${APP_STATE.BACKGROUND}`);
    const appClosed = new RegExp(`${APP_STATE.INACTIVE}`);
    if (appState.match(appInBackground) && nextAppState === APP_STATE.ACTIVE) {
      this.playBackgroundMusic();

      try {
        await api.getActivePlayer();
      } catch (error) {
        // fail silently
      }
    }
    if (nextAppState.match(appInBackground)) {
      this.pauseBackgroundMusic();
    }
    if (nextAppState.match(appClosed)) {
      const utcTime = new Date();
      logEvent(ANALYTICS_EVENTS.APP_CLOSED);
      logBlushiftEvent(BLUSHIFT_EVENT.APP_CLOSED, { [BLUESHIFT_ANALYTICS_PROPERTIES.TIME]: utcTime.toISOString() })
    }
    this.setState({ appState: nextAppState });
  };

  playBackgroundMusic = (callback = () => { }) => {
    const { isMusicEnabled, sound } = this.state;
    if (isMusicEnabled) {
      playSound(sound, callback);
    }
  };

  playMusic = music => {
    const { isMusicEnabled, sound } = this.state;
    if (isMusicEnabled) {
      pauseSound(sound);
      playSound(music);
      this.setState({ sound: music })
    }
  };

  pauseBackgroundMusic = (callback = () => { }) => {
    const { sound } = this.state;
    pauseSound(sound, callback);
  };

  setIsMusicEnabled = isMusicEnabled => {
    const { isSoundEffectEnabled } = this.state;
    AsyncStorage.setItem(
      LOCAL_STORAGE_NAME.SOUND_PREFERENCES,
      JSON.stringify({ isMusicEnabled, isSoundEffectEnabled })
    );

    this.setState({ isMusicEnabled }, () => {
      if (isMusicEnabled) {
        this.playBackgroundMusic();
      } else {
        this.pauseBackgroundMusic();
      }
    });
  };

  setIsSoundEffectEnabled = isSoundEffectEnabled => {
    const { isMusicEnabled } = this.state;
    AsyncStorage.setItem(
      LOCAL_STORAGE_NAME.SOUND_PREFERENCES,
      JSON.stringify({ isSoundEffectEnabled, isMusicEnabled })
    );
    this.setState({ isSoundEffectEnabled });
  };

  playSoundEffect = soundEffect => {
    const { isSoundEffectEnabled } = this.state;
    if (isSoundEffectEnabled) {
      playSound(soundEffect);
    }
  };

  render() {
    const { children } = this.props;
    return (
      <BackgroundMusicContext.Provider
        value={{
          ...this.state,
          setIsMusicEnabled: this.setIsMusicEnabled,
          playBackgroundMusic: this.playBackgroundMusic,
          pauseBackgroundMusic: this.pauseBackgroundMusic,
          playMusic: this.playMusic,
          setIsSoundEffectEnabled: this.setIsSoundEffectEnabled,
          playSoundEffect: this.playSoundEffect
        }}
      >
        {children}
      </BackgroundMusicContext.Provider>
    );
  }
}

export const withBackgroundMusic = Wrapped => props => (
  <BackgroundMusicContext.Consumer>
    {value => <Wrapped {...props} backgroundMusicContextValue={value} />}
  </BackgroundMusicContext.Consumer>
);

BackgroundMusicProvider.propTypes = {
  children: PropTypes.node
};

BackgroundMusicProvider.defaultProps = {
  children: null
};
