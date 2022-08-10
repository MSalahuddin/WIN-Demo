/* eslint-disable no-nested-ternary */
import React, { } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Text, { SIZE, FONT_FAMILY } from './Text';
import { scale, scaleWidth, scaleHeight, getWindowWidth, heightRatio } from '../../platformUtils';
import { color } from '../../styles';


// container width is the full window minus padding 96 each side
const containerWidth = getWindowWidth() - scaleWidth(292);
const Container = styled.View`
  width: ${containerWidth};
`;

const Row = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: ${({ isCenter }) => (isCenter ? 'center' : 'space-between')};
  margin-top: ${({ marginTop }) => (marginTop ? scaleHeight(9) : 0)};
`;

const Circle = styled(LinearGradient)`
  align-items: center;
  justify-content: center;
  height: ${scaleHeight(17)};
  width: ${scaleHeight(17)};
  border-radius: ${scaleHeight(12)};
`;

const CircleText = styled(Text)`
  color: ${color.white};
  margin-top: ${Platform.OS === 'android' ? -1 : 1};
  margin-right: ${Platform.OS === 'android' ? 0 : -1};
  line-height: ${scaleHeight(20)};
  color: ${color.prussianBlue};
`;

const ProgressBar = styled.View`
  border-radius: ${scale(12)};
  background-color: ${color.prussianBlue};
  height: ${scaleHeight(12)};
  margin-horizontal: ${scale(5)};
  width: 85%;
  border-width: ${scaleHeight(2)};
  border-color: ${color.prussianBlue};
`;

const Progress = styled.View`
  position: absolute;
  border-radius: ${scale(8)};
  background-color:${color.neonGreen};
  height: ${scaleHeight(8)};
  width: ${({ width }) => width}%;
  border-color: ${color.borderBlue};
  border-width:0px;
`;







const PointProgressBar = ({ displayProgressInText, startPoint, EndPoint, ...rest }) => {


  const progressWidth = (startPoint / EndPoint) * 100;

  const renderProgressBar = () => {
    return (
      <Row isCenter>
        <Circle colors={[color.goldentGradientLight, color.goldentGradientDark]}>
          <CircleText size={SIZE.XXXXSMALL} fontFamily={FONT_FAMILY.BOLD}>
            {startPoint}
          </CircleText>
        </Circle>
        <ProgressBar>
          <Progress width={progressWidth} />
        </ProgressBar>
        <Circle colors={[color.gradientNeonGreen, color.neonGreen]} >
          <CircleText size={SIZE.XXXXSMALL} fontFamily={FONT_FAMILY.BOLD}>
            {EndPoint}
          </CircleText>
        </Circle>
      </Row>
    );
  };

  return (
    <Container {...rest}>
      {renderProgressBar()}

    </Container>
  );
};

PointProgressBar.propTypes = {
  displayProgressInText: PropTypes.bool,
  startPoint: PropTypes.number,
  EndPoint: PropTypes.number,
};

PointProgressBar.defaultProps = {
  displayProgressInText: false,
  startPoint: 0,
  EndPoint: 0,
};

export default PointProgressBar;
