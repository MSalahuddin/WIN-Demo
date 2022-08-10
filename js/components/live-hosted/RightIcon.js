import React, { useState } from 'react';
import styled from 'styled-components/native';
import {
  play_button,
  active_players_icon
} from '../../../assets/images';
import { scale, scaleHeight, scaleWidth } from '../../platformUtils';
import { color } from '../../styles';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import LiveHostedJoinPopUp from './LiveHostedJoinPopUp';

const RightIconContainer = styled.View``;
const PlayIconContainer = styled.TouchableOpacity``;
const EmptyView = styled.View`
height: ${scale(60)};
width: ${scale(60)};
`;
const PlayIcon = styled.Image`
height: ${scale(60)};
width: ${scale(60)};
`;
const ActivePlayerIconContainer = styled.TouchableOpacity``;
const ActivePlayerIcon = styled.Image`
height: ${scale(65)};
width: ${scale(65)};
`;
const ActivePlayerIconText = styled(Text)`
position: absolute;
top: ${scaleHeight(22)}
left: ${scaleWidth(16)}
`;

const RightIcon = ({ startGame, isTriviaPlayer, isTriviaStarted }) => {
  return (
    <RightIconContainer>
      {!isTriviaStarted ? 
      <PlayIconContainer disabled={isTriviaPlayer} onPress={() => { startGame() }}>
        <PlayIcon source={play_button} />
      </PlayIconContainer> : 
      <EmptyView></EmptyView>
      }

      {/* <ActivePlayerIconContainer onPress={() => {}}>
        <ActivePlayerIcon source={active_players_icon} />
        <ActivePlayerIconText alignCenter color={color.darkGrey} fontFamily={FONT_FAMILY.BOLD} size={SIZE.NORMAL}>
          10K
        </ActivePlayerIconText>
      </ActivePlayerIconContainer> */}
    </RightIconContainer>
  );
};

export default RightIcon;
