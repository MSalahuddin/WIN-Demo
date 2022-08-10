import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import { color } from '../../styles';
import { scale } from '../../platformUtils';

const Container = styled.View`
  align-items: center;
  height: ${({ height }) => scale(height)};
  justify-content: center;
  width: ${({ width }) => scale(width)};
`;

const BaseLayer = styled.View`
  border-radius: ${({ borderRadius }) => scale(borderRadius)};
  height: ${({ height }) => scale(height)};
  position: absolute;
  width: ${({ width }) => scale(width)};
`;

const FirstProgressLayer = styled.View`
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-right-color: ${({ ringColor }) => ringColor};
  border-top-color: ${({ ringColor }) => ringColor};
  border-radius: ${({ borderRadius }) => scale(borderRadius)};
  border-width: ${({ borderWidth }) => scale(borderWidth)};
  height: ${({ height }) => scale(height)};
  position: absolute;
  width: ${({ width }) => scale(width)};
`;

const SecondProgressLayer = styled.View`
  border-left-color: transparent;
  border-bottom-color: transparent;
  border-right-color: ${({ ringColor }) => ringColor};
  border-top-color: ${({ ringColor }) => ringColor};
  border-radius: ${({ borderRadius }) => scale(borderRadius)};
  border-width: ${({ borderWidth }) => scale(borderWidth)};
  height: ${({ height }) => scale(height)};
  position: absolute;
  width: ${({ width }) => scale(width)};
`;

const OffsetLayer = styled.View`
  position: absolute;
  border-left-color: transparent;
  border-bottom-color: transparent;
  border-right-color: ${({ ringBgColor }) => ringBgColor};
  border-top-color: ${({ ringBgColor }) => ringBgColor};
  border-radius: ${({ borderRadius }) => scale(borderRadius)};
  border-width: ${({ borderWidth }) => scale(borderWidth + 2)};
  height: ${({ height }) => scale(height)};
  width: ${({ width }) => scale(width)};
`;

const MedalImage = styled.Image`
  border-radius: ${({ borderRadius }) => scale(borderRadius)};
  height: ${({ height }) => scale(height)};
  width: ${({ width }) => scale(width)};
`;

/**
 * Function that calculates rotation of the semicircle for firstProgressLayer
 * ( when percent is less than equal to 50 ) or for the secondProgressLayer
 * when percent is greater than 50.
 * */
const rotateByStyle = (percent, baseDegrees) => {
  const rotateBy = baseDegrees + percent * 3.6;

  return {
    transform: [{ rotateZ: `${rotateBy}deg` }]
  };
};

const renderThirdLayer = (percent, progressRingWidth, radius, ringColor, ringBgColor) => {
  const rotation = 45;
  const diameter = radius * 2;
  const offsetLayerRotation = -135;

  if (percent > 50) {
    /**
     * Third layer circles default rotation is kept 45 degrees for clockwise rotation,
     * so by default it occupies the right half semicircle.
     * Since first 50 percent is already taken care  by second layer circle, hence we subtract it
     * before passing to the rotateByStyle function
     * */

    return (
      <SecondProgressLayer
        height={diameter}
        width={diameter}
        borderRadius={radius}
        borderWidth={progressRingWidth}
        ringColor={ringColor}
        style={[rotateByStyle(percent - 50, rotation)]}
      />
    );
  }
  return (
    <OffsetLayer
      width={diameter}
      height={diameter}
      borderRadius={radius}
      ringBgColor={ringBgColor}
      borderWidth={radius}
      style={[{ transform: [{ rotateZ: `${offsetLayerRotation}deg` }] }]}
    />
  );
};

const CircularProgress = ({ percent, radius, progressRingWidth, ringColor, ringBgColor, imageSource }) => {
  const rotation = -135;
  const firstProgressLayerStyle = rotateByStyle(percent > 50 ? 50 : percent, rotation);
  const diameter = radius * 2;
  const opacity = percent === 100 ? 1.0 : 0.5;

  return (
    <Container height={diameter} width={diameter}>
      <BaseLayer height={diameter} width={diameter} borderRadius={radius} />
      <FirstProgressLayer
        height={diameter}
        width={diameter}
        borderRadius={radius}
        borderWidth={progressRingWidth}
        ringColor={ringColor}
        style={[firstProgressLayerStyle]}
      />
      {renderThirdLayer(percent, progressRingWidth, radius, ringColor, ringBgColor)}
      <MedalImage
        source={{ uri: imageSource }}
        resizeMode="cover"
        height={diameter - 2 * progressRingWidth + progressRingWidth / 2}
        borderRadius={radius - progressRingWidth + progressRingWidth / 4}
        width={diameter - 2 * progressRingWidth + progressRingWidth / 2}
        opacity={opacity}
      />
    </Container>
  );
};

CircularProgress.propTypes = {
  radius: PropTypes.number,
  progressRingWidth: PropTypes.number,
  ringColor: PropTypes.string,
  ringBgColor: PropTypes.string,
  imageSource: PropTypes.string,
  percent: PropTypes.number.isRequired
};

CircularProgress.defaultProps = {
  radius: 26,
  progressRingWidth: 4,
  ringColor: color.powderGreen,
  ringBgColor: color.grayWhite,
  imageSource: ''
};

export default CircularProgress;
