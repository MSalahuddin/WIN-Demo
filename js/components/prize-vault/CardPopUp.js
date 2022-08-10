import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import { SafeAreaView, Platform } from 'react-native';
import PropTypes from 'prop-types';
import IconButton from '../common/IconButton';
import Button, { BUTTON_COLOR_SCHEME } from '../common/Button';
import TextButton from '../common/TextButton';
import PrizeCircle from '../winners-circle/PrizeCircle';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import { scale, scaleHeight, scaleWidth, getWindowWidth } from '../../platformUtils';
import { closeBlack } from '../../../assets/images';
import { color } from '../../styles';
import { popUpStrings } from '../../stringConstants';
import { PRIZE_ACTION_TYPE } from '../../constants';

const StyledModal = styled(Modal)`
  background-color: ${color.popupBlack};
  margin: 0;
  padding-horizontal: ${scaleWidth(28)};
  padding-top: ${scaleHeight(28)};
  justify-content: flex-start;
`;

const PopUpContainer = styled.View`
  background-color: ${color.white};
  border-radius: ${8};
  width: 100%;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  right: ${scaleWidth(20)};
`;

const ContentContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-horizontal: ${scaleWidth(38)};
  margin-top: ${scaleHeight(64)};
`;

const ButtonWrapper = styled(Button)`
  margin-vertical: ${scaleHeight(24)};
`;
const StyledText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(3)};
  margin-horizontal: ${scale(3)};
  text-align:center;
`;

const TicketBonusTextContainer = styled.View`
align-items: center;
justify-content: center;
  flex-direction: row;
  margin-top: ${({ marginTop }) => scaleHeight(marginTop)};
`;
const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  margin-top: ${({ marginTop }) => marginTop || Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(12)};
`;

// imageHeight should be proportional to image dimension 375:308
// scaleWidth(56) is padding 28 each
const imageHeight = getWindowWidth() - scaleWidth(56) * (375 / 308);
const PrizeImage = styled.Image`
  border-top-right-radius: 8;
  border-top-left-radius: 8;
  height: ${imageHeight};
  width: 100%;
`;

const CancelText = styled(TextButton)`
  margin-bottom: ${scaleHeight(32)};
  color: ${color.lightBlack};
`;

const CancelContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const PrizeCircleWrapper = styled.View`
  position: absolute;
  width: 100%;
  align-items: center;
  top: ${imageHeight - scaleHeight(40)};
`;

const CardPopUp = ({ isVisible, setVisible, data, onPress, cardPopUpButtonsDisabled, setCardPopUpButtonsDisabled }) => {
  if (!data) {
    return null;
  }

  const { prize, isForShipping, nft } = data;
  const { imageUrl, name, ticketsValue, ticketsValueWithBonus } = prize;
  const bonusValue = ticketsValueWithBonus - ticketsValue;
  const prizeCircleValue = (ticketsValueWithBonus && 
    ticketsValueWithBonus !== ticketsValue) ? 
    ticketsValueWithBonus : ticketsValue;
  const dismissPopUp = () => {
    setVisible(false);
  };

  const renderButton = () => {
    let theme = isForShipping ? BUTTON_COLOR_SCHEME.GREEN : BUTTON_COLOR_SCHEME.NORMAL;

    if (cardPopUpButtonsDisabled) {
      theme = BUTTON_COLOR_SCHEME.GREY;
    }

    return (
      <ButtonWrapper
        testID="card-button"
        borderRadius={44}
        height={88}
        width={271}
        theme={theme}
        onPress={() => {
          if (!isForShipping) {
            setCardPopUpButtonsDisabled(true);
          }
          onPress();
        }}
        disabled={cardPopUpButtonsDisabled}
      >

        <ButtonContentContainer>
          {(ticketsValueWithBonus && 
            ticketsValueWithBonus !== ticketsValue) ?
             <ButtonText size={SIZE.XLARGE} color={color.white}>
            {isForShipping ? popUpStrings.shipNow : popUpStrings.swapForNumberTickets(ticketsValueWithBonus)}
          </ButtonText>
            :
            <ButtonText size={SIZE.XLARGE} color={color.white}>
              {isForShipping ? popUpStrings.shipNow : popUpStrings.swapForNumberTickets(ticketsValue)}
            </ButtonText>
          }

        </ButtonContentContainer>
      </ButtonWrapper>
    );
  };

  return (
    <SafeAreaView>
      <StyledModal isVisible={isVisible}>
        <PopUpContainer>
          <PrizeImage source={nft && nft?.imageURL ? { uri: nft?.imageURL } : { uri: imageUrl }} resizeMode="cover" />
          <ContentContainer>
            <Text alignCenter color={color.grayBlack} size={SIZE.LARGE} fontFamily={FONT_FAMILY.REGULAR}>
              {isForShipping ? popUpStrings.ship : popUpStrings.swap}
              <Text color={color.grayBlack} size={SIZE.LARGE} fontFamily={FONT_FAMILY.SEMI_BOLD}>
                {` ${nft?.nftId ? nft?.name : name} `}
              </Text>
              {!isForShipping && popUpStrings.forTickets}
            </Text>
          </ContentContainer>
          {( !isForShipping && ticketsValueWithBonus && ticketsValueWithBonus !== ticketsValue) && 
            <TicketBonusTextContainer marginTop={9}>

              <StyledText fontFamily={FONT_FAMILY.REGULAR} size={SIZE.LARGE}>
              {popUpStrings.getText}
              <Text color={color.grayBlack} size={SIZE.LARGE} fontFamily={FONT_FAMILY.SEMI_BOLD}>
                {popUpStrings.ticketsValueText(ticketsValue)}
              </Text>
             {popUpStrings.plusText}
              <Text color={color.grayBlack} size={SIZE.LARGE} fontFamily={FONT_FAMILY.SEMI_BOLD}>
                {popUpStrings.extraTicketText(bonusValue)}
              </Text>
             {popUpStrings.forVipLevel}
              </StyledText>

            </TicketBonusTextContainer>}
          {renderButton()}
          {!cardPopUpButtonsDisabled && (
            <CancelContainer>
              <CancelText
                testID="cancel-text-button"
                onPress={dismissPopUp}
                label={isForShipping ? popUpStrings.cancelAndSaveForLater : popUpStrings.cancelAndKeepPrize}
              />
            </CancelContainer>
          )}
          {!cardPopUpButtonsDisabled && (
            <CloseButton testID="cancel-button" onPress={dismissPopUp} icon={closeBlack} size={32} />
          )}
          <PrizeCircleWrapper>
            <PrizeCircle
              circleColor={isForShipping ? color.green : color.blue}
              type={isForShipping ? PRIZE_ACTION_TYPE.SHIP : PRIZE_ACTION_TYPE.SWAP}
              imageUrl={isForShipping && imageUrl}
              value={isForShipping ? 1 : prizeCircleValue}
            />
          </PrizeCircleWrapper>
        </PopUpContainer>
      </StyledModal>
    </SafeAreaView>
  );
};

CardPopUp.propTypes = {
  data: PropTypes.shape({
    isForShipping: PropTypes.bool,
    prize: PropTypes.shape({
      name: PropTypes.string,
      imageUrl: PropTypes.string,
      ticketsValue: PropTypes.number,
      ticketsValueWithBonus: PropTypes.number,
    }),
    nft: PropTypes.shape({
      imageURL: PropTypes.string,
      nftId: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
  cardPopUpButtonsDisabled: PropTypes.bool.isRequired,
  setCardPopUpButtonsDisabled: PropTypes.func.isRequired
};

CardPopUp.defaultProps = {
  data: null
};

export default CardPopUp;
