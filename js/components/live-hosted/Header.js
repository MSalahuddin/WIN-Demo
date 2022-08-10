import React from 'react';
import styled from 'styled-components/native';
import { players_watching, ww_logo_white } from '../../../assets/images';
import { scale, scaleHeight, scaleWidth } from '../../platformUtils';
import { color } from '../../styles';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
const RowContainer = styled.View`
margin-Horizontal: ${scaleWidth(20)}
margin-Top: ${scaleHeight(100)}
flex-direction: row;
align-items: center;
justify-content: space-between;
`;
const Logo = styled.Image`
height: ${scale(36)};
width: ${scale(95)};
margin-right:${scaleWidth(180)}
`;
const Viewers = styled.View`
width: ${scale(65)};
height: ${scale(65)};
border-width: ${scale(5)};
border-radius: ${scale(50)};
border-color: ${color.white};
align-items: center;
justify-content: center;
`;
const ViewerIcon = styled.Image`
height: ${scale(30)};
width: ${scale(30)};
top: ${scale(-12)}
left: ${scale(35)}
position: absolute;
`;
const ViewerText = styled(Text)``;
const Header = ({watcherCount}) => {
  return (
    <RowContainer>
      <Logo source={ww_logo_white} />
      <Viewers>
        <ViewerIcon source={players_watching} />
        <ViewerText alignCenter color={color.white} fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.XSMALL}>
          {watcherCount >= 1000 ? `${Number(watcherCount / 1000).toFixed(1)}K` : watcherCount}
        </ViewerText>
      </Viewers>
    </RowContainer>
  );
};
export default Header;