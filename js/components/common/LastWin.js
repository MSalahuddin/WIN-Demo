import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import Text, { SIZE, FONT_FAMILY } from './Text';
import { scale, scaleHeight } from '../../platformUtils';
import { LastWinIcon} from '../../../assets/images';
import { gameRoomStrings } from '../../stringConstants';
import { color } from '../../styles';

const Container = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const Prize = styled.Image`
  height: ${scaleHeight(24)};
  margin-right: ${scale(8)};
  width: ${scaleHeight(24)};
`;

const TextWrapper = styled.View`
  flex-direction: row;
`;

const LastWin = ({ timestamp, ...rest }) => {
  return (
    <Container {...rest}>
      <Prize source={LastWinIcon} />
      <TextWrapper>
        <Text size={SIZE.XSMALL}>{`${gameRoomStrings.lastWin} `}</Text>
        <Text color={color.silver} size={SIZE.XSMALL} fontFamily={FONT_FAMILY.REGULAR}>
          {timestamp}
        </Text>
      </TextWrapper>
    </Container>
  );
};

LastWin.propTypes = {
  timestamp: PropTypes.string
};

LastWin.defaultProps = {
  timestamp: ''
};

export default LastWin;
