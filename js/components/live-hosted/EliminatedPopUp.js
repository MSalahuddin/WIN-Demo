/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { ExitCircle, howtoBackgroundPopUp, eliminated } from '../../../assets/images';
import PropTypes from 'prop-types';
import IconButton from '../common/IconButton';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import { scale, scaleHeight, scaleWidth, heightRatio } from '../../platformUtils';
import { popUpStrings, liveHostedStrings } from '../../stringConstants';
import { color } from '../../styles';
import AnswerChart from './AnswerChart';
import StampPopUp from '../common/StampPopUp';

const Header =
Platform.OS === 'android'
? styled.View`
flex-direction: row;
width: 100%;
justify-content: flex-end;
position: absolute;
top: ${scaleHeight(-40)};
right: ${scaleWidth(-10)};
align-self: flex-end;
z-index: 1;
`
: styled.View`
flex-direction: row;
padding-horizontal: ${scale(24)};
position: absolute;
top:${scale(heightRatio > -1 ? -40: 0)}
right:${scale(heightRatio > -1 ? -35: 0)}
width: 100%;
justify-content: flex-end;
z-index: 1;
`;
const TextWrapper = styled(Text)``;
const TextTitleContainer = styled.View`
align-items: center;
justify-content: center;
padding-bottom: ${heightRatio < 1 ? scaleHeight(0) : scaleHeight(5)};
padding-horizontal: ${scaleWidth(10)};
`;
const TokenContainer = styled.TouchableOpacity`
background-color: ${color.white};
align-items: center;
justify-content: center;
border-radius: ${scale(50)};
height: ${scaleHeight(40)}
padding-horizontal:${scaleWidth(30)}
margin-Vertical: ${scaleHeight(10)};
`;
const RandomTextWrapper = styled.TouchableOpacity``;
const RandomText = styled(Text)`
text-decoration: underline;
`;
const ButtonText = styled(Text)``;

const EliminatedPopUp = ({ isVisible, onDissmiss, onBackPress, noOfTotalQuestion, selectedQuestionNo }) => {
  const renderAliminated = () => {
    return (
      <TextTitleContainer>
        <Text alignCenter size={SIZE.XXLARGE} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
          {popUpStrings.eliminatedContestLine1}
        </Text>
        <Text alignCenter size={SIZE.XXLARGE} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
          {popUpStrings.eliminatedContestLine2}
        </Text>
      </TextTitleContainer>
    );
  };
  const renderAliminatedText = () => {
    return (
      <TextTitleContainer>
        <TextWrapper alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
          {popUpStrings.eliminatedTextLine1}
        </TextWrapper>
        <TextWrapper alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
          {popUpStrings.eliminatedTextLine2}
        </TextWrapper>
        <TextWrapper alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
          {popUpStrings.eliminatedTextLine3}
        </TextWrapper>
      </TextTitleContainer>
    );
  };
  return (
    <StampPopUp isVisible={isVisible} backgroundImage={howtoBackgroundPopUp}>
      {/* stampIcon={eliminated} */}
      <Header>
        <IconButton testID="cancel-button" onPress={onDissmiss} icon={ExitCircle} size={45} />
      </Header>
      {renderAliminated()}
      <AnswerChart noOfTotalQuestion={noOfTotalQuestion} selectedQuestionNo={selectedQuestionNo}/>
      {renderAliminatedText()}
      <TokenContainer onPress={onBackPress}> 
        <ButtonText
          size={SIZE.LARGE}
          color={color.black}
          fontFamily={FONT_FAMILY.BOLD}
          marginTop={Platform.OS === 'ios' ? 10 : 0}
          marginHorizontal={20}
          alignCenter
        >
          {liveHostedStrings.goBack}
        </ButtonText>
      </TokenContainer>
      <RandomTextWrapper onPress={onDissmiss}>
        <RandomText alignCenter size={SIZE.XSMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
          {popUpStrings.continueWatching}
        </RandomText>
      </RandomTextWrapper>
    </StampPopUp>
  );
};

EliminatedPopUp.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  footerPress: PropTypes.func.isRequired,
  onDissmiss: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired
};

export default EliminatedPopUp;
