import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Text from './Text';
import { formatTimeString } from '../../utils';

const CountdownTimer = ({ time, onTimerEnd, onFiveSecondsLeft, ...rest }) => {
  const [remainingTime, setRemainingTime] = useState(time);
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime(remainingTime - 1);
      }
    }, 1000);

    if (remainingTime === 5) {
      onFiveSecondsLeft();
    }

    if (remainingTime === 0) {
      onTimerEnd();
      clearInterval(countdownInterval);
    }
    return () => {
      clearInterval(countdownInterval);
    };
  }, [onFiveSecondsLeft, onTimerEnd, remainingTime]);

  const formatString = formatTimeString(remainingTime);
  return <Text allowFontScaling={false} {...rest}>{formatString}</Text>;
};

CountdownTimer.propTypes = {
  time: PropTypes.number.isRequired,
  onTimerEnd: PropTypes.func,
  onFiveSecondsLeft: PropTypes.func
};

CountdownTimer.defaultProps = {
  onTimerEnd: () => {},
  onFiveSecondsLeft: () => {}
};

export default CountdownTimer;
