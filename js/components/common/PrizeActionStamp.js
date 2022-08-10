import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import Text, { FONT_FAMILY, SIZE } from './Text';
import { scale, scaleHeight } from '../../platformUtils';
import { parseDatetime } from '../../utils';
import { color } from '../../styles';
import { PRIZE_STATUS } from '../../constants';

const OuterCircle = styled.View`
  width: ${scale(106)};
  height: ${scale(106)};
  border-radius: ${scale(53)};
  border-width: ${scale(3)};
  border-color: ${({ bodyColor }) => bodyColor};
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const InnerCircle = styled.View`
  width: ${scale(95)};
  height: ${scale(95)};
  border-width: ${scale(1)};
  border-color: ${({ bodyColor }) => bodyColor};
  border-radius: ${scale(47.5)};
  justify-content: center;
  align-items: center;
  transform: rotate(-30deg);
`;

const TextStrip = styled.View`
  height: ${scaleHeight(29)};
  width: ${scale(101)};
  background-color: ${({ bodyColor }) => bodyColor};
  justify-content: center;
  align-items: center;
  margin-bottom: ${scaleHeight(3)};
`;

const CenterText = styled(Text)`
  color: ${color.white};
  margin-top: ${scaleHeight(6)};
`;

const DatetimeText = styled(Text)`
  color: ${({ bodyColor }) => bodyColor};
`;

const ContentBody = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const PrizeActionStamp = ({ datetime, type }) => {
  const getStampColor = () => {
    switch (type) {
      case PRIZE_STATUS.SWAPPED:
        return color.blue;
      case PRIZE_STATUS.SHIPPED:
        return color.green;
      case PRIZE_STATUS.CLAIMED:
        return color.green;
      default:
        return color.pinkRed;
    }
  };
  const stampColor = getStampColor();
  const { date, time } = parseDatetime(datetime);
  return (
    <OuterCircle bodyColor={stampColor}>
      <InnerCircle bodyColor={stampColor}>
        <ContentBody>
          <DatetimeText bodyColor={stampColor} size={SIZE.XXXSMALL}>
            {date}
          </DatetimeText>
          <TextStrip bodyColor={stampColor}>
            <CenterText fontFamily={FONT_FAMILY.BOLD} size={SIZE.XSMALL}>
              {type}
            </CenterText>
          </TextStrip>
          <DatetimeText bodyColor={stampColor} size={SIZE.XXXSMALL}>
            {time}
          </DatetimeText>
        </ContentBody>
      </InnerCircle>
    </OuterCircle>
  );
};

PrizeActionStamp.propTypes = {
  datetime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  type: PropTypes.oneOf([
    PRIZE_STATUS.SWAPPED,
    PRIZE_STATUS.SHIPPED,
    PRIZE_STATUS.PENDING,
    PRIZE_STATUS.NEW,
    PRIZE_STATUS.PACKING
  ]).isRequired
};

export default PrizeActionStamp;
