/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components/native';
import { Platform, TouchableOpacity } from 'react-native';
import { ExitCircle, howtoBackgroundPopUp, coin, join } from '../../../assets/images';
import PropTypes from 'prop-types';
import IconButton from '../common/IconButton';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import { scale, scaleHeight, scaleWidth, heightRatio } from '../../platformUtils';
import { popUpStrings, gameRoomStrings } from '../../stringConstants';
import { color } from '../../styles';
import { convertNumberToStringWithComma } from '../../utils';
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
`: styled.View`
flex-direction: row;
padding-horizontal: ${scale(24)};
position: absolute;
top:${scale(heightRatio > -1 ? -40: 0)}
right:${scale(heightRatio > -1 ? -35: 0)}
width: 100%;
justify-content: flex-end;
z-index: 1;
`;
const TextWrapper = styled.View`
align-items: center;
justify-content: center;
padding-top: ${scaleHeight(10)};
padding-bottom: ${heightRatio < 0.9 ? scaleHeight(2) : scaleHeight(15)};
padding-horizontal: ${scaleWidth(40)};
`;
const TextTitleWrapper = styled.View`
align-items: center;
justify-content: center;
padding-top: ${scaleHeight(5)};
padding-bottom: ${heightRatio < 1 ? scaleHeight(0) : scaleHeight(5)};
padding-horizontal: ${scaleWidth(10)};
`;
const TokenContainer = styled(TouchableOpacity)`
background-color: ${color.white};
align-items: center;
justify-content: space-between;
flex-direction: row;
border-radius: 50;
height: ${scaleHeight(40)}
width: ${scaleWidth(130)}
padding-horizontal:${scaleWidth(30)}
`;
const TextContainer = styled(TouchableOpacity)`
`;
const RandomText = styled(Text)`
margin-Vertical: 20;
text-decoration: underline;
`;
const ButtonText = styled(Text)``;
const CoinIcon = styled.Image``;

const LiveHostedJoinPopUp = ({ isVisible, onJoin, onDissmiss, isFree, ticketPrize, tokensCost }) => {

  const JoinContestText = () => {
    return (
      <TextWrapper>
        <Text alignCenter size={SIZE.XLARGE} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
          {`${ticketPrize} ${popUpStrings.joinContestTickets}` }
        </Text>
      </TextWrapper>
    );
  };

  const JoinContest = () => {
    return (
      <TextTitleWrapper>
        <Text alignCenter size={SIZE.LARGEST} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
          {popUpStrings.joinContest}
        </Text>
      </TextTitleWrapper>
    );
  };

  const JoinContestTitle = () => {
    return (
      <TextTitleWrapper>
        <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
          {popUpStrings.joinContestTitle}
        </Text>
      </TextTitleWrapper>
    );
  };

  return (
    <StampPopUp stampIcon={join} isVisible={isVisible} backgroundImage={howtoBackgroundPopUp}>
      <Header>
        <IconButton testID="cancel-button" onPress={onDissmiss} icon={ExitCircle} size={45} />
      </Header>
      <JoinContest />
      <JoinContestTitle />
      <JoinContestText />
      <TokenContainer onPress={onJoin}>
        <ButtonText
          size={SIZE.LARGE}
          color={color.black}
          fontFamily={FONT_FAMILY.BOLD}
          marginTop={Platform.OS === 'ios' ? 10 : 0}
          marginHorizontal={20}
        >
          {isFree ? gameRoomStrings.free : convertNumberToStringWithComma(tokensCost)}
        </ButtonText>
        <CoinIcon source={coin} resizeMode="contain" />
      </TokenContainer>
      <TextContainer  onPress={onDissmiss}>
        <RandomText alignCenter size={SIZE.XSMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
          {popUpStrings.continueWatching}
        </RandomText>
      </TextContainer>

    </StampPopUp>
  );
};

LiveHostedJoinPopUp.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onDissmiss: PropTypes.func.isRequired,
};

export default LiveHostedJoinPopUp;
