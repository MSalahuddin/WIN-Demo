import { StyleSheet } from 'react-native';
import { hasNotch } from 'react-native-device-info';
import { registerGlobals } from 'react-native-webrtc';
import styled from 'styled-components/native';
import { scale, scaleHeight, getWindowWidth } from './platformUtils';

export const fontFamily = {
  calibreBold: 'CalibreBold',
  calibreBoldItalic: 'CalibreBoldItalic',
  calibreBlack: 'Calibre-Black',
  calibreLight: 'CalibreLight',
  calibreLightItalic: 'CalibreLightItalic',
  calibreMedium: 'Calibre-Medium',
  calibreRegular: 'CalibreRegular',
  calibreRegularItalic: 'CalibreRegularItalic',
  calibreSemiBold: 'Calibre-Semibold',
  calibreThin: 'Calibre-Thin',
  calibreThinItalic: 'Calibre-ThinItalic',
  robotoMedium: 'Roboto-Medium',
  sanFranMedium: 'SFUIDisplay-Medium'
};

export const color = {
  dailyRewardProgressBarColor: '#A37CD8',
  aliceBlue: '#DAE6FF',
  black: '#000000',
  infoButton:'rgba(9,21,204,0.2)',
  blackBorder: 'rgba(0, 0, 0, 0.2)',
  blackShadow: 'rgba(53, 53, 53, 0.3)',
  whiteTransparent :'rgba(255, 255, 255, 0.42)',
  blue: '#7C89D8',
  skyDarkBlue: '#5229C8',
  brightYellow: '#FFEA5C',
  cornFlowerBlue: '#A5C1FF',
  darkerWhite: 'rgba(249,249,249,0.9)',
  darkGrey: '#BFBFBF',
  darkPurple: '#5F6EAF',
  facebookBlue: '#4267B2',
  gold: '#FFDB4F',
  googleGrey: 'rgba(0,0,0,0.54)',
  gradientBackgroundDark: 'rgba(101,117,182,1)',
  gradientBackgroundLight: 'rgba(165,193,255,1)',
  grayBlack: '#353535',
  grayPlaceholder: '#ADADAD',
  grayWhite: '#F9F9F9',
  green: '#5EC98C',
  greenValid: '#80E5AD',
  lightBlack: '#222222',
  lightGrey: '#B7B7B7',
  lightYellow: '#FFF3A3',
  pink: '#FFC0B8',
  pinkRed: '#F06B59',
  popupOpaqueBlack: 'rgba(0,0,0,0.1)',
  popupBlack: 'rgba(34,34,34, 0.6)',
  powderBlack: '#333333',
  powderGreen: '#72D59E',
  powderPink: '#FF7B6C',
  purple: '#C4D1FA',
  silver: '#8B8B8B',
  silverWhite: '#E5E5E5',
  transparent: 'transparent',
  warningRed: '#C54E3E',
  white: '#FFFFFF',
  whitePurple: '#5F6EAF',
  yellow: '#FFF1A0',
  yellowDark: '#F2C201',
  darkRed: '#E6604E',
  governorBay: '#311CA8',
  havelockBlue: '#751EEE',
  gradientDarkBlue: '#0079FF',
  gradientLightBlue: '#00FFFC',
  heliotrope: '#7267C8',
  fuchsiaBlue: '#A499FA',
  midBlue: '#4D0CF3',
  darkBlue: '#4A1F95',
  gameBackground: '#433896',
  leaderboardCardTextColor: '#45FFF7',
  leaderBoardcardBackgroundColor: '#181B54',
  prizePopupCardTextBackground: '#182061',
  myRankBackground: '#0915CC',
  bottomNavColor1: '#74A9FF',
  bottomNavColor2: '#708DEA',
  bottomNavColor3: '#7477D7',
  tagBlue: '#230E5C',
  borderBlue: '#5927B5',
  iceBlue: '#47539E',
  lightIceBlue: '#7780BC',
  goldentGradientLight: '#FFF300',
  goldentGradientMid: '#D7C22B',
  goldentGradientDark: '#D86513',
  PurpleProgress: '#4B1F9F',
  orangeRed: '#ea442e',
  navyBlue: '#423D9E',
  fadeBlue: '#708EEA',
  cardBorderBlue: '#82CEFF',
  rust: '#CB5656',
  bloodRed: '#A63333',
  darkViolet: '#362D7A',
  lightViolet: '#433899',
  shippingBgColor: '#29dbff7a',
  gameCardGradient1: '#6244F1',
  gameCardGradient2: '#35A1E5',
  neonGreen: '#04ff7e',
  bestValueBgColor: '#43D41B',
  popularBgColor: '#FF1AD7',
  darkNavyBlue: '#181b54',
  daisyBush: '#3A1F90',
  cyanBlue: '#004CB6',
  prussianBlue: '#002f71',
  gradientNeonGreen: '#6eeef3',
  graphite: '#7c7c7c',
  gradientAquaBlue: '#36daef',
  gradientSeaBlue: '#2166cd',
  gradientBorderColor: '#7cbae1',
  gradientDisabledButton: '#d2d2d2',
  gradientDisabledButtonBgColor: '#ececec',
  disabledButtonBorderColor: '#bfbfbf',
  gameCardGradient1: '#6244F1',
  gameCardGradient2: '#35A1E5',
  profileNavigationPrimary: '#181B54',
  profileNavigationSecondary1: '#F806FF',
  profileNavigationInner1: '#AB27FC',
  profileNavigationborder1: '#883BB7',
  profileNavigationSecondary2: '#24A5FC',
  profileNavigationInner2: '#2264D2',
  profileNavigationborder2: '#3361AE',
  profileNavigationSecondary3: '#00FF71',
  profileNavigationInner3: '#23BA66',
  profileNavigationborder3: '#0C6F38',
  profileNavigationSecondary4: '#00C7FF',
  profileNavigationInner4: '#38A3F9',
  profileNavigationborder4: '#114874',
  profilegradientCircleTotal1: '#FDC66F',
  profilegradientCircleTotal2: '#E0FF00',
  profilegradientCircleCurrent1: '#00FFF9',
  profilegradientCircleCurrent2: '#2ADE53',
  neonAqua: '#45FFF9',
  skyBlue: '#56C7FB',
  playForFreeBorderColor: 'rgba(89, 195, 212,0.3)',
  playForFreeUpperShadow: 'rgba(114, 220, 237,0.4)',
  playForFreeLinearShadow1: 'rgba(0, 151, 255,0.9)',
  playForFreeLinearShadow2: 'rgba(103, 162, 251,0.9)',
  darkShadow: 'rgba(0, 0, 0,0.4)',
  appBarIcon: '#fc03cf',
  darkPink: '#ff1a6d',
  onBoardingScreenHeadingColor: '#6EEEF3',
  dustyGray: 'rgba(255,255,255, 0.6)',
  blueViolet: '#5853B5',
  cornflowerBlue: '#6195ED',
  rankingBarBackground: '#5e3ddf',
  deepDarkBlue:"#070828",
  watchAdDarkBlue: "#233066",
  watchAdLightBlue: "#121e50",
  watchAdDisableText: "#71738D",
  watchAdDisableBtn: "#545574",
  prizeCardGradient1:"#151EBE",
  prizeCardGradient2:"#005FFF",
  searchCategoryText: "#2F1FA8", 
  deleteAccountButton: "#D4D3D9", 
  deleteAccountCloseButton: "#1E2A62",
  deleteAccountNote: "#FF0000",
  bluishColor : "#1B2860",
  questionMarkIcon: "#D8D8D8",
};

export const buttonColor = {
  GREY: {
    outer: 'rgba(160,160,160,1)',
    inner: 'rgba(183,183,183,1)',
    highlight: 'rgba(209,209,209,1)'
  },
  NORMAL: {
    outer: 'rgba(116, 158, 253, 1)',
    inner: 'rgba(127, 166, 253, 1)',
    highlight: 'rgba(165, 193, 255, 1)'
  },
  GREEN: {
    outer: 'rgba(96,202,142,1)',
    inner: 'rgba(114,213,158,1)',
    highlight: 'rgba(128,229,173,1)'
  },
  RED: {
    outer: 'rgba(197,78,62,1)',
    inner: 'rgba(240, 107, 89, 1)',
    highlight: 'rgba(255,132,115,1)'
  },
  PURPLE: {
    outer: 'rgba(95,110,175,1)',
    inner: 'rgba(124,137,216,1)',
    highlight: 'rgba(140,158,221,1)'
  },
  NORMAL_INVERTED: {
    outer: '#4E5C9A',
    inner: '#4A5D98',
    highlight: '#3C4C7F'
  },
  WHITE: {
    outer: '#E5E5E5',
    inner: '#F9F9F9',
    highlight: '#FFFFFF'
  },
  BLUE: {
    outer: '#35d6ed',
    inner: '#32c8e9',
    highlight: '#6eeef3'
  }
};

export const GradientButtonColor = {
  BLUE: {
    outer: '#7CBAE1',
    highlight: '#6EEEF3',
    inner: ['#37E1F0', '#1A3CC2']
  },
  GREY: {
    outer: '#BFBFBF',
    inner: ['#ECECEC', '#C2C2C2', '#818181'],
    highlight: '#ECECEC'
  },
  GREEN: {
    outer: '#60ca8e',
    inner: ['#ace3c5', '#60ca8e'],
    highlight: '#80e5ad'
  }
};

export const hitSlop = (vertical, horizontal) => ({
  top: vertical,
  bottom: vertical,
  left: horizontal,
  right: horizontal
});

export const flatListStyles = StyleSheet.create({
  columnStyle: {
    alignItems: 'flex-end',
    marginHorizontal: scale(16),
    justifyContent: 'space-between'
  },
  historyColumnStyle: {
    marginLeft: (getWindowWidth() - 3 * scale(16)) / 6
  },
  filterColumnStyle: {
    marginHorizontal: scale(16),
    marginVertical: scale(25),
    justifyContent: 'space-between'
  },
  rowStyle: {
    flexDirection: 'row'
  },

  containerStyle: {
    paddingBottom: scaleHeight(16)
  }
});

export const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  margin-top: ${hasNotch() ? scaleHeight(88) : scaleHeight(68)};
`;
