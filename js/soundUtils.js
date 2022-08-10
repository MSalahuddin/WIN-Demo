/* istanbul ignore file */
import Sound from 'react-native-sound';
import {
  blueButtonAudio,
  countDownAudio,
  downButtonAudio,
  gameLostAudio,
  gamePlayMusic,
  gameWonAudio,
  greenButtonAudio,
  leftButtonAudio,
  lobbyBackgroundMusic,
  minorButtonAudio,
  negativePopupSound,
  playGrabButtonAudio,
  positivePopupSound,
  purchaseTokensSound,
  rightButtonAudio,
  upButtonAudio,
  congratsYouWonMusic,
} from '../assets/sounds';
import { SOUND_CATEGORY } from './constants';

export const SOUNDS = {
  // ensure lobby background music is the first sound loaded
  LOBBY_BACKGROUND_MUSIC: new Sound(lobbyBackgroundMusic),
  BLUE_BUTTON: new Sound(blueButtonAudio),
  COUNT_DOWN: new Sound(countDownAudio),
  DOWN_BUTTON: new Sound(downButtonAudio),
  GAME_LOST: new Sound(gameLostAudio),
  GAME_PLAY_MUSIC: new Sound(gamePlayMusic),
  GAME_WON: new Sound(gameWonAudio),
  GREEN_BUTTON: new Sound(greenButtonAudio),
  LEFT_BUTTON: new Sound(leftButtonAudio),
  MINOR_BUTTON: new Sound(minorButtonAudio),
  NEGATIVE_POPUP: new Sound(negativePopupSound),
  PLAY_GRAB_BUTTON: new Sound(playGrabButtonAudio),
  POSITIVE_POPUP: new Sound(positivePopupSound),
  PURCHASE_TOKENS: new Sound(purchaseTokensSound),
  RIGHT_BUTTON: new Sound(rightButtonAudio),
  UP_BUTTON: new Sound(upButtonAudio),
  CONGRATS_YOU_WON_MUSIC: new Sound(congratsYouWonMusic),
};

export const playSound = (sound, successCallback = () => {}) => {
  if (sound.isLoaded()) {
    sound.setCategory(SOUND_CATEGORY.AMBIENT);
    sound.setSpeakerphoneOn(true);
    if(sound === SOUNDS.LOBBY_BACKGROUND_MUSIC || sound === SOUNDS.GAME_PLAY_MUSIC){
    sound.setNumberOfLoops(-1);
    }
    sound.play(() => {
      sound.reset();
      successCallback();
    });
  }
};

export const pauseSound = (sound, callback = () => {}) => {
  if (sound.isPlaying()) {
    sound.setCategory(SOUND_CATEGORY.AMBIENT);
    sound.setSpeakerphoneOn(true);
    sound.pause(callback);
  }
};
