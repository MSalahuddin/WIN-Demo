import React, { useEffect, useContext } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import { SOUNDS } from '../../soundUtils';
import { countdownOne, countdownThree, countdownTwo } from '../../../assets/images';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';

const Container = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;

const CountdownImage = styled(Animated.Image)`
  position: absolute;
`;

const Countdown = ({ onCountdownComplete }) => {
  const { playSoundEffect } = useContext(BackgroundMusicContext);
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const countdownAnimation = () => {
      Animated.timing(animatedValue, { toValue: 3, duration: 4000, useNativeDriver: true }).start(() => {
        onCountdownComplete();
      });
    };
    countdownAnimation();
  }, [animatedValue, onCountdownComplete]);

  useEffect(() => {
    playSoundEffect(SOUNDS.COUNT_DOWN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const numberThreeInterpolation = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1, 2, 3],
      outputRange: [1, 0, 0, 0]
    }),
    transform: [
      {
        scaleX: animatedValue.interpolate({
          inputRange: [0, 1, 2, 3],
          outputRange: [1, 1.5, 0, 0]
        })
      },
      {
        scaleY: animatedValue.interpolate({
          inputRange: [0, 1, 2, 3],
          outputRange: [1, 1.5, 0, 0]
        })
      }
    ]
  };

  const numberTwoInterpolation = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1, 2, 3],
      outputRange: [0, 1, 0, 0]
    }),
    transform: [
      {
        scaleX: animatedValue.interpolate({
          inputRange: [0, 1, 2, 3],
          outputRange: [1, 1, 1.5, 0]
        })
      },
      {
        scaleY: animatedValue.interpolate({
          inputRange: [0, 1, 2, 3],
          outputRange: [1, 1, 1.5, 0]
        })
      }
    ]
  };

  const numberOneInterpolation = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1, 2, 3],
      outputRange: [0, 0, 1, 0]
    }),
    transform: [
      {
        scaleX: animatedValue.interpolate({
          inputRange: [0, 1, 2, 3],
          outputRange: [1, 1, 1, 1.5]
        })
      },
      {
        scaleY: animatedValue.interpolate({
          inputRange: [0, 1, 2, 3],
          outputRange: [1, 1, 1, 1.5]
        })
      }
    ]
  };

  return (
    <Container>
      <CountdownImage source={countdownThree} resizeMode="contain" style={numberThreeInterpolation} />
      <CountdownImage source={countdownTwo} resizeMode="contain" style={numberTwoInterpolation} />
      <CountdownImage source={countdownOne} resizeMode="contain" style={numberOneInterpolation} />
    </Container>
  );
};

Countdown.defaultProps = {
  onCountdownComplete: () => {}
};

Countdown.propTypes = {
  onCountdownComplete: PropTypes.func
};

export default Countdown;
