import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import {Platform} from 'react-native';
import Text, { SIZE } from './Text';
import { scale, scaleHeight, getWindowWidth } from '../../platformUtils';
import { color } from '../../styles';
import { ticket } from '../../../assets/images';
import { convertNumberToStringWithComma } from '../../utils';

const cardWidth = (getWindowWidth() - 3 * scale(16)) / 2;
const Container = styled.TouchableOpacity`
  background-color: ${color.white};
  border-radius: ${scale(8)};
  margin-top: ${scale(12)};
  margin-horizontal: ${scale(5)};
  shadow-color: ${color.blackShadow};
  shadow-offset: 4px 4px;
  shadow-opacity: ${1};
  shadow-radius: 2px;
  width: ${cardWidth};
  overflow: hidden;
  flex-direction: column;
`;

const PrizeImage = styled.Image`
  width: ${cardWidth};
  height: ${cardWidth};
  overflow: hidden;
`;

const TitleBar = styled.View`
  flex: 1;
  padding-horizontal: ${scale(20)};
  padding-vertical: ${scaleHeight(10)};
  justify-content: center;
  align-items: center;
`;

const TicketBar = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-horizontal: ${scale(20)};
  padding-vertical: ${scaleHeight(10)};
  background-color: ${color.grayWhite};
`;

const TicketWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const TicketImage = styled.Image`
  height: ${scaleHeight(14)};
  width: ${scale(18)};
  margin-right: ${scale(5)};
`;

const TicketText = styled(Text)`
  padding-top: ${Platform.OS==='android'?scaleHeight(0):scaleHeight(4)};
`;

const PrizeCard = ({ title, imageUrl, ticketQuantity, onPress }) => {
  return (
    <Container testID="prize-card-button" activeOpacity={1} onPress={onPress}>
      <PrizeImage source={{ uri: imageUrl }} resizeMode="cover" />
      <TitleBar>
        <Text size={SIZE.XXSMALL} alignCenter ellipsizeMode="tail">
          {title}
        </Text>
      </TitleBar>
      <TicketBar>
        <TicketWrapper>
          <TicketImage source={ticket} />
          <TicketText size={SIZE.XXSMALL} ellipsizeMode="tail">
            {`x${convertNumberToStringWithComma(ticketQuantity)}`}
          </TicketText>
        </TicketWrapper>
      </TicketBar>
    </Container>
  );
};

PrizeCard.defaultProps = {
  ticketQuantity: 0,
  onPress: () => {}
};

PrizeCard.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  ticketQuantity: PropTypes.number,
  onPress: PropTypes.func
};

export default PrizeCard;
