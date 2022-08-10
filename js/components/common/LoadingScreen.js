import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';

import { gamePlayLoading } from '../../../assets/gifs';
import {
  gamePlayAnimation
} from '../../../assets/animations';
const StyledModal = styled(Modal)`
  align-items: center;
  justify-content: flex-start;
  margin: 0;
`;
const GamePlayLoadingGif = styled.Image`
  height: 100%;
  width: 100%;
`;

const LoadingScreen = ({ isVisible }) => {
  if (isVisible) {
    return <LottieView source={gamePlayAnimation} autoPlay loop resizeMode="cover" />;
  }
  return null;
};

LoadingScreen.propTypes = {
  isVisible: PropTypes.bool.isRequired
};

export default LoadingScreen;