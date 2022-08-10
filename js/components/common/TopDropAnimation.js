import React from 'react';
import {Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';

const STAR_DIMENSIONS = { width: 49, height: 26 };
const SCREEN_DIMENSIONS = Dimensions.get('window');
const WIGGLE_ROOM = 50;

const FlippingImage = ({
  back = false,
  delay,
  duration = 1000,
  source,
  style = {},
}) => (
  <Animatable.Image
    animation={{
      from: {
        rotateX: back ? '0deg' : '180deg',
        rotate: !back ? '180deg' : '0deg',
      },
      to: {
        rotateX: back ? '360deg' : '-180deg',
        rotate: !back ? '180deg' : '0deg',
      },
    }}
    duration={duration}
    delay={delay}
    easing="linear"
    iterationCount="infinite"
    useNativeDriver
    source={source}
    style={{
      ...style,
      backfaceVisibility: 'hidden',
    }}
  />
);

FlippingImage.propTypes = {
  back: PropTypes.bool.isRequired,
  delay: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  source: PropTypes.node.isRequired,
  style: PropTypes.node.isRequired,
};

const Swinging = ({
  amplitude,
  rotation = 7,
  delay,
  duration = 700,
  children,
}) => (
  <Animatable.View
    animation={{
      0: {
        translateX: -amplitude,
        translateY: -amplitude * 0.8,
        rotate: `${rotation}deg`,
      },
      0.5: {
        translateX: 0,
        translateY: 0,
        rotate: '0deg',
      },
      1: {
        translateX: amplitude,
        translateY: -amplitude * 0.8,
        rotate: `${-rotation}deg`,
      },
    }}
    delay={delay}
    duration={duration}
    direction="alternate"
    easing="ease-in-out"
    iterationCount="infinite"
    useNativeDriver>
    {children}
  </Animatable.View>
);

Swinging.propTypes = {
  amplitude: PropTypes.number.isRequired,
  rotation: PropTypes.number.isRequired,
  delay: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

const Falling = ({ duration, delay, style, children }) => (
  <Animatable.View
    animation={{
      from: { translateY: -STAR_DIMENSIONS.height - WIGGLE_ROOM },
      to: { translateY: SCREEN_DIMENSIONS.height + WIGGLE_ROOM },
    }}
    duration={duration}
    delay={delay}
    easing={t => Math.pow(t, 1.6555)}
    iterationCount="infinite"
    useNativeDriver
    style={style}>
    {children}
  </Animatable.View>
)

Falling.propTypes = {
  delay: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.node.isRequired,
};

const randomize = max => Math.random() * max;

const range = count => {
  const array = [];
  for (let i = 0; i < count; i += 1) {
    array.push(i);
  }
  return array;
};

const TopDropAnimation = ({image}) => {

  const count = 15
  const duration = 3000

    return(
        range(15)
            .map(i => randomize(1000))
            .map((flipDelay, i) => (
              <Falling
                key={i}
                duration={duration}
                delay={i * (duration / count)}
                style={{
                  position: 'absolute',
                  top: 0,
                  paddingHorizontal: WIGGLE_ROOM,
                  left:
                    randomize(SCREEN_DIMENSIONS.width - STAR_DIMENSIONS.width) -
                    WIGGLE_ROOM,
                }}>
                <Swinging
                  amplitude={STAR_DIMENSIONS.width / 5}
                  delay={randomize(duration)}>
                  <FlippingImage source={image} delay={flipDelay}
                    style={{ height: 30, width: 30 }}
                  />
                  <FlippingImage
                    source={image}
                    delay={flipDelay}
                    back
                    style={{ position: 'absolute', height: 30, width: 30 }}
                  />
                </Swinging>
              </Falling>
            ))
    )
}

export default TopDropAnimation;
