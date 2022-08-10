import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {Platform} from 'react-native';
import Button, { BUTTON_COLOR_SCHEME } from '../common/Button';
import Text, { SIZE } from '../common/Text';
import { giftBox, ticket } from '../../../assets/images';
import { scale, scaleHeight } from '../../platformUtils';
import { color } from '../../styles';
import { PRIZE_ACTION_TYPE } from '../../constants';
import { prizeVaultStrings } from '../../stringConstants';
import { convertNumberToStringWithComma } from '../../utils';

const IconWrapper = styled.View`
  width: ${scale(32)};
  height: ${scale(32)};
  background-color: ${color.white};
  opacity: 0.5;
  justify-content: center;
  align-items: center;
  border-radius: ${scale(16)};
  overflow: hidden;
`;

const ButtonRowView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: ${scale(7)};
`;

const StyledImage = styled.Image`
  width: ${scale(18)};
  height: ${scale(18)};
`;

const ContentWrapper = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ShipText = styled(Text)`
  margin-top: ${Platform.OS==='android'?scaleHeight(0):scaleHeight(6)};
  color: ${color.white};
`;
const SwapText = styled(Text)`
  margin-top: ${Platform.OS==='android'?scaleHeight(0):scaleHeight(6)};
  color: ${color.white};
`;
const TicketText = styled(Text)`
  margin-top: ${scaleHeight(-3)};
  color: ${color.white};
`;

const VaultButton = ({ action, type, ticketQty }) => {
  const icon = (type === PRIZE_ACTION_TYPE.SHIP || type === PRIZE_ACTION_TYPE.CLAIM) 
    ? giftBox : ticket;
  const theme = (type === PRIZE_ACTION_TYPE.SHIP || type === PRIZE_ACTION_TYPE.CLAIM) 
    ? BUTTON_COLOR_SCHEME.GREEN : BUTTON_COLOR_SCHEME.NORMAL;
  
  const renderContent = () => {
    if (type === PRIZE_ACTION_TYPE.SHIP || type === PRIZE_ACTION_TYPE.CLAIM) {
      return (
        <ShipText>
          {type === PRIZE_ACTION_TYPE.CLAIM ? prizeVaultStrings.claimNow : prizeVaultStrings.shipNow}
        </ShipText>
      )
    }

    return (
      <>
        <SwapText>{prizeVaultStrings.swapFor}</SwapText>
        <TicketText size={SIZE.XXSMALL}>
          {prizeVaultStrings.numberTickets(convertNumberToStringWithComma(ticketQty))}
        </TicketText>
      </>
    );
  };

  return (
    <Button onPress={action} theme={theme} height={48} width={140}>
      <ButtonRowView>
        <ContentWrapper>{renderContent()}</ContentWrapper>
        <IconWrapper>
          <StyledImage source={icon} resizeMode="contain" />
        </IconWrapper>
      </ButtonRowView>
    </Button>
  );
};

VaultButton.defaultProps = {
  ticketQty: 0,
  action: () => {}
};

VaultButton.propTypes = {
  ticketQty: PropTypes.number,
  action: PropTypes.func,
  type: PropTypes.oneOf([PRIZE_ACTION_TYPE.SHIP, PRIZE_ACTION_TYPE.SWAP, PRIZE_ACTION_TYPE.CLAIM]).isRequired
};

export default VaultButton;
