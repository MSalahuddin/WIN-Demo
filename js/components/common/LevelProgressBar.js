import React, { useContext } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { Platform } from 'react-native';
import Text, { SIZE, FONT_FAMILY } from './Text';
import { scale, scaleWidth, scaleHeight, getWindowWidth } from '../../platformUtils';
import { color } from '../../styles';
import { UserContext } from '../../context/User.context';
import { star } from '../../../assets/images';
import { accountProfileStrings } from '../../stringConstants';
import { convertNumberToStringWithComma } from '../../utils';

// container width is the full window minus padding 96 each side
const containerWidth = getWindowWidth() - scaleWidth(162);
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
  height: ${scaleHeight(22)};
  width: ${scaleHeight(22)};
  border-radius: ${scaleHeight(18)};
 
`;

const CircleText = styled(Text)`
  color: ${color.black};
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(5)};
  line-height: ${scaleHeight(18)};
 `;

const ProgressBar = styled.View`
  border-radius: ${scale(20)};
  border-width:${scaleHeight(3)};
  background-color: ${color.profileNavigationPrimary};
  height: ${scaleHeight(15)};
  margin-horizontal: ${scale(8)};
  overflow:hidden
  width: 65%;
`;

const Progress = styled.View`
  position: absolute;
  border-radius: ${scale(8)};
  background-color: ${color.profilegradientCircleCurrent2};
  height: ${scaleHeight(9)};
  width: ${({ width }) => width}%;
`;



const PointDisplay = styled(Text)`
  margin-left: ${scaleWidth(5)};
  padding-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(6)};
`;

const TextWrapper = styled(Text)`
  margin-top: ${scaleHeight(5)};
`;

const LevelProgressBar = ({ displayProgressInText, ...rest }) => {
  const { vipLevel, vipPoints } = useContext(UserContext);
  const { vipLevelId, nextVipLevel, maxLevelId } = vipLevel;
  const nextLevel = vipLevelId + 1;
  const pointsToNextLevel = nextVipLevel ? nextVipLevel.points : 0;
  const progressWidth = (vipPoints / pointsToNextLevel) * 100;

  const displayPoints = pointsValue => {
    return (
      <PointDisplay color={color.white} size={SIZE.XXSMALL}>
        {pointsValue}
      </PointDisplay>
    );
  };

  const renderText = () => {
    if (displayProgressInText) {
      return (
        <PointDisplay color={color.white} size={SIZE.XXSMALL}>
          {accountProfileStrings.pointsAwayFromLevel(pointsToNextLevel, nextLevel)}
        </PointDisplay>
      );
    }

    if (vipLevelId === maxLevelId) {
      return displayPoints(convertNumberToStringWithComma(vipPoints));
    }

    const pointsComparison = `${convertNumberToStringWithComma(vipPoints)} / ${convertNumberToStringWithComma(
      pointsToNextLevel
    )}`;
    return displayPoints(pointsComparison);
  };

  const renderProgressBar = () => {
    if (vipLevelId === maxLevelId) {
      return (
        <Row isCenter>
          <TextWrapper fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.XSMALL} color={color.silver} alignCenter>
            {accountProfileStrings.maxLevelReached}
          </TextWrapper>
        </Row>
      );
    }

    return (
      <Row isCenter>
        <Circle colors={[color.profilegradientCircleTotal1, color.profilegradientCircleTotal2]}>
          <CircleText size={SIZE.XSMALL} fontFamily={FONT_FAMILY.BOLD}>
            {vipLevelId}
          </CircleText>
        </Circle>
        <ProgressBar>
          <Progress width={progressWidth} />
        </ProgressBar>
        <Circle colors={[color.profilegradientCircleCurrent1, color.profilegradientCircleCurrent2]}>
          <CircleText size={SIZE.XSMALL} fontFamily={FONT_FAMILY.BOLD}>
            {nextLevel}
          </CircleText>
        </Circle>
      </Row>
    );
  };

  return (
    <Container {...rest}>
      <Row isCenter marginTop={displayProgressInText}>
        {renderText()}
        {/* <StarIcon resizeMode="cover" source={star} /> */}
      </Row>
      {renderProgressBar()}
    </Container>
  );
};

LevelProgressBar.propTypes = {
  displayProgressInText: PropTypes.bool
};

LevelProgressBar.defaultProps = {
  displayProgressInText: false
};

export default LevelProgressBar;
