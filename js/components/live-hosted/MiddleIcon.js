import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { scale, scaleHeight, scaleWidth } from '../../platformUtils';
import { liveHostedStrings } from '../../stringConstants';
import { color, buttonColor } from '../../styles';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import ProgressCircle from 'react-native-progress-circle';
import Timer from './Timer';
const MiddleIconContainer = styled.View``;
const TimerContainer = styled.View`
align-items: center;
justify-content: center;
`;
const MiddleTimerContainer = styled.View`
align-items: center;
align-self: center;
justify-content: center;
border-radius: ${scale(50)};
height: ${scale(60)};
width: ${scale(60)};
background-color: ${buttonColor.RED.inner};
`;
const TimeContainer = styled.View`
background-color: ${buttonColor.RED.inner};
color: ${color.white};
height: ${scaleHeight(40)};
width: ${scaleHeight(130)};
padding-horizontal: ${scaleWidth(10)};
border-radius: ${scale(50)};
align-items: center;
justify-content: center;
`;
const ThreeDot = styled.View`
background-color: ${color.white};
height: ${scale(10)};
width: ${scale(10)};
margin-horizontal: ${scale(2)}
border-radius: ${scale(50)};
`;
const ThreeDotContainer = styled.View`
flex-direction: row;
`;
const ContestStartText = styled(Text)``;
const AfterContestStartTime = styled(Text)`
margin-top: ${Platform.OS === 'ios' ? scale(10) : 0};
color: ${color.white};
text-align: center;
`;

const MiddleIcon = ({ setShouldStartGame, setShouldEndTime, timerTime, question, isTriviaStarted, showThreeDots }) => {
  const [contestStartedStopwatchTime, setContestStartedStopwatchTime] = useState(timerTime);
  const [contestStartedMin, setContestStartedMin] = useState(Math.floor(contestStartedStopwatchTime / 60));
  const [contestStartedSec, setContestStartedSec] = useState(contestStartedStopwatchTime % 60);
  useEffect(() => {
    if (contestStartedStopwatchTime > 0) {
      setTimeout(() => {
        setContestStartedStopwatchTime(contestStartedStopwatchTime - 1);
        if (contestStartedSec === 0) {
          setContestStartedSec(59);
        } else {
          setContestStartedSec(contestStartedSec - 1);
        }
        setContestStartedMin(Math.floor(contestStartedStopwatchTime / 60));
      }, 1000);
    } else {
      setContestStartedStopwatchTime('! Finish !');
    }
  }, [contestStartedSec])
  // const new1 = contestStartedStopwatchTime
  const percentage = (contestStartedStopwatchTime / timerTime) * 100
  return (
    <>
      {showThreeDots ? (
        <MiddleTimerContainer>
          <ThreeDotContainer>
            <ThreeDot />
            <ThreeDot />
            <ThreeDot />
          </ThreeDotContainer>
        </MiddleTimerContainer>
      )
        :
        (
          <MiddleIconContainer>
            {question !== null ? <ProgressCircle
              percent={percentage}
              radius={33}
              borderWidth={5}
              color="#3399FF"
              shadowColor={color.white}
              bgColor="#fff"
            >
              <MiddleTimerContainer>
                <AfterContestStartTime fontFamily={FONT_FAMILY.BOLD} size={SIZE.XXXLARGE}>
                  {contestStartedSec}
                </AfterContestStartTime>
              </MiddleTimerContainer>
            </ProgressCircle>
              :
              <TimerContainer>
                <ContestStartText alignCenter fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.XSMALL}>
                  {liveHostedStrings.contestStartIn}
                </ContestStartText>
                <TimeContainer>
                  <Timer setShouldEndTime={setShouldEndTime} setShouldStartGame={setShouldStartGame} remainingTimeInSec={timerTime} />
                </TimeContainer>
              </TimerContainer>
            }
          </MiddleIconContainer>
        )
      }
    </>
  );
};
export default MiddleIcon;