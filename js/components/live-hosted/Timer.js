import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import BackgroundTimer from 'react-native-background-timer';
import PropTypes from 'prop-types';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import { scaleHeight } from '../../platformUtils';
import { color } from '../../styles';

const TriviaTimerContainer = styled.View``;
const RandomText = styled(Text)`
  text-align: center;
  margin-vertical: ${scaleHeight(10)};
`;

const Timer = ({ remainingTimeInSec, setShouldStartGame, setShouldEndTime }) => {
  const DELAY = 1000;
  const [secondsLeft, setSecondsLeft] = useState(remainingTimeInSec ?? 0);

  const displayRemainingTime = () => {
    const days = Math.floor(secondsLeft / (3600 * 24));
    const hours = Math.floor((secondsLeft % (3600 * 24)) / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = Math.floor(secondsLeft % 60);

    const displaydays = days < 10 ? `0${days}:` : `${days}:`;
    const displayHours = hours < 10 ? `0${hours}` : hours;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${days ? displaydays : ''}${displayHours}:${displayMinutes}:${displaySeconds}`;
  };

  const startTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setSecondsLeft(sec => {
        if (sec > 0) return sec - 1;
        return 0;
      });
    }, DELAY);
  };

  useEffect(() => {
    if (secondsLeft === 3 && setShouldStartGame) {
      setShouldStartGame(false);
    } else if (secondsLeft === 0 && setShouldEndTime) {
      BackgroundTimer.stopBackgroundTimer();
      setShouldEndTime(true);
    }
  }, [secondsLeft, setShouldStartGame, setShouldEndTime]);

  useEffect(() => {
    startTimer();
    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, []);

  return (
    <TriviaTimerContainer>
      <RandomText aligncenter fontFamily={FONT_FAMILY.BOLD} size={SIZE.XXLARGE} color={color.white}>
        {displayRemainingTime()}
      </RandomText>
    </TriviaTimerContainer>
  );
};

Timer.defaultProps = {
  setShouldStartGame: null
};

Timer.propTypes = {
  remainingTimeInSec: PropTypes.number.isRequired,
  setShouldStartGame: PropTypes.func
};

export default Timer;