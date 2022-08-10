import { Dimensions, Platform } from 'react-native';

export const getWindowWidth = () => Dimensions.get('window').width;

export const getWindowHeight = () => Dimensions.get('window').height;

/** The scale function is used to scale up
 * the app UI across different sized devices.
 * The guideline width is based on iPhone 6.
 */
const guidelineBaseWidth = 375;

const guidelineBaseHeight = 667;

const widthRatio = getWindowWidth() / guidelineBaseWidth;

export const heightRatio = getWindowHeight() / guidelineBaseHeight;

const baseScale = size => widthRatio * size;

export const scale = (size, factor = 0.5) => size + (baseScale(size) - size) * factor;

export const scaleHeight = size => heightRatio * size;

export const scaleWidth = size => widthRatio * size;

export const isAndroid = Platform.OS === 'android';
