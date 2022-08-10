import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Platform } from 'react-native';

import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import { scale, scaleHeight, heightRatio, scaleWidth } from '../../platformUtils';
import { color } from '../../styles';
import { ticket } from '../../../assets/images';

export const REWARD_TYPE = {
  PRIZE: 'PRIZE',
  TICKETS: 'TICKETS'
};

const Container = styled.TouchableOpacity`
  height: ${heightRatio > 1 ? scaleHeight(152) : scaleHeight(160)};
  width: ${scale(150)};
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const OuterCircle = styled.View`
  width: ${scale(84)};
  height: ${scale(84)};
  border-radius: ${scale(42)};
  justify-content: center;
  align-items: center;
  background-color: ${color.white};
  position: absolute;
  top: ${heightRatio > 1 ? scale(20) : scaleHeight(7)};
`;

const InnerCircle = styled.View`
  width: ${scale(80)};
  height: ${scale(80)};
  background-color: ${({ type }) => (type === REWARD_TYPE.TICKETS ? color.purple : color.white)};
  border-color: ${({ borderColor }) => borderColor};
  border-width: ${scale(2)};
  border-radius: ${scale(40)};
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const OuterMainBody = styled.View`
  width: ${scale(140)};
  height: ${scaleHeight(105)};
  background-color: ${color.white};
  border-radius: 8;
  justify-content: center;
  align-items: center;
`;

const InnerMainBody = styled.View`
  width: ${scale(135)};
  height: ${scaleHeight(100)};
  background-color: ${color.white};
  border-color: ${({ borderColor }) => borderColor};
  border-width: ${scale(2)};
  border-radius: 8;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const RoundPill = styled.View`
  position: absolute;
  background-color: ${({ bgColor }) => bgColor};
  border-radius: ${scale(15)};
  border-color: ${({ bgColor }) => bgColor};
  justify-content: center;
  align-items: center;
  padding-top: ${scaleHeight(5)};
  bottom: -${scaleHeight(10)};
  padding-horizontal: ${scale(5)};
  min-width: ${scale(40)};
  max-width: ${scale(80)};
`;

const RewardImage = styled.Image`
  width: ${({ type }) => (type === REWARD_TYPE.TICKETS ? scale(48) : scale(100))};
  height: ${({ type }) => (type === REWARD_TYPE.TICKETS ? scale(48) : scale(150))};
`;

const PrizeNameContainer = styled.View`
  align-items: center;
  height: ${scaleHeight(55)};
  justify-content: center;
  margin-top: ${scaleHeight(50)};
  margin-horizontal: ${scaleWidth(3)};
`;

const getBorderColor = (type, isActive) => {
  if (type === REWARD_TYPE.PRIZE) {
    return isActive ? color.green : color.white;
  }
  return isActive ? color.blue : color.white;
};

const getBackgroundColor = type => {
  if (type === REWARD_TYPE.PRIZE) {
    return color.green;
  }

  return color.blue;
};

const RewardOption = ({ prizeImage, prizeName, prizeQty, ticketsValue, type, isActive, onPress }) => {
  const borderColor = getBorderColor(type, isActive);
  const bgColor = getBackgroundColor(type);
  const renderPillContent = () => {
    if (type === REWARD_TYPE.PRIZE) {
      return `x${prizeQty}`;
    }

    return `x${ticketsValue}`;
  };

  const rewardImage = type === REWARD_TYPE.TICKETS ? ticket : { uri: prizeImage };

  return (
    <Container testID="reward-button" activeOpacity={1} onPress={onPress}>
      <OuterMainBody>
        <InnerMainBody borderColor={borderColor}>
          <PrizeNameContainer>
            <Text size={SIZE.XXSMALL} color={bgColor} fontFamily={FONT_FAMILY.BOLD_ITALIC} isUppercase>
              {type}
            </Text>
            {!!prizeName && (
              <Text size={SIZE.XXXXSMALL} color={bgColor} alignCenter numberOfLines={1}>
                {prizeName}
              </Text>
            )}
          </PrizeNameContainer>
        </InnerMainBody>
      </OuterMainBody>
      <OuterCircle>
        <InnerCircle borderColor={borderColor} type={type}>
          <RewardImage source={rewardImage} resizeMode="contain" type={type} />
        </InnerCircle>
        <RoundPill bgColor={bgColor}>
          <Text 
           marginBottom={Platform.OS==='android'?5:0} 
           color={color.white} 
           size={SIZE.XSMALL}
          >
            {renderPillContent()}
          </Text>
        </RoundPill>
      </OuterCircle>
    </Container>
  );
};

RewardOption.defaultProps = {
  isActive: true,
  prizeQty: 1,
  prizeName: '',
  type: REWARD_TYPE.TICKETS,
  ticketsValue: 500,
  prizeImage: ticket,
  onPress: () => {}
};

RewardOption.propTypes = {
  isActive: PropTypes.bool,
  prizeQty: PropTypes.number,
  prizeName: PropTypes.string,
  ticketsValue: PropTypes.number,
  prizeImage: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf([REWARD_TYPE.PRIZE, REWARD_TYPE.TICKETS]),
  onPress: PropTypes.func
};

export default RewardOption;
