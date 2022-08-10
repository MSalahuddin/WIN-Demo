import React from 'react';
import styled from 'styled-components/native';
import { scale, scaleHeight, scaleWidth } from '../../platformUtils';
import { buttonColor, color } from '../../styles';
const AnswerChartContainer = styled.View`
background-color: ${color.darkShadow};
align-items: flex-end;
justify-content: center;
flex-direction: row;
border-radius: ${scale(15)};
width: ${scale(280)}
padding-horizontal:${scale(30)};
padding-vertical:${scale(9)};
`;
const AnswerBar = styled.View`
background-color: ${({ backgroundColor }) => backgroundColor};
flex-direction: row;
border-radius: ${scale(5)};
height: ${({ height }) => scaleHeight(height)};
width: ${scaleWidth(14)};
margin-left: ${scale(4)};
`;
const AnswerChart = ({ noOfTotalQuestion, selectedQuestionNo }) => {
  const bars = new Array(noOfTotalQuestion).fill(5);
  let HEIGHT = scale(20);
  let BACKGROUNDCOLOR = color.profilegradientCircleCurrent2;
  return (
    <AnswerChartContainer>
      {bars.map((item, index) => {
        HEIGHT += scale(item);
        index = index + 1;
        if (selectedQuestionNo === index) {
          BACKGROUNDCOLOR = buttonColor.RED.inner;
        } else if (index < selectedQuestionNo) {
          BACKGROUNDCOLOR = color.profilegradientCircleCurrent2;
        } else {
          BACKGROUNDCOLOR = color.disabledButtonBorderColor;
        }
        return <AnswerBar key={index} height={HEIGHT} backgroundColor={BACKGROUNDCOLOR} />;
      })}
    </AnswerChartContainer>
  );
};
export default AnswerChart;