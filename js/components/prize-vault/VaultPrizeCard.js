import React, { useContext } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import VaultButton from './VaultButton';
import PrizeActionStamp from '../common/PrizeActionStamp';
import IconButton from '../common/IconButton';
import { scale, getWindowWidth, scaleHeight } from '../../platformUtils';
import { SOUNDS } from '../../soundUtils';
import { color } from '../../styles';
import { info } from '../../../assets/images';
import { PRIZE_STATUS, PRIZE_ACTION_TYPE, PRIZE_TYPE_CODE } from '../../constants';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';

const cardWidth = (getWindowWidth() - 3 * scale(16)) / 2;
const Container = styled.View`
  background-color: ${color.white};
  border-radius: ${scale(8)};
  padding-bottom: ${scale(8)};
  margin-top: ${scale(12)};
  shadow-color: ${color.blackShadow};
  shadow-offset: 4px 4px;
  shadow-opacity: ${1};
  shadow-radius: 2px;
  width: ${cardWidth};
  justify-content: center;
  align-items: center;
`;

// the height should be proportional to the image size we get
const prizeIconHeight = (cardWidth * 308) / 375;
const PrizeImage = styled.Image`
  height: ${prizeIconHeight};
  width: ${cardWidth};
  border-top-left-radius: ${scale(8)};
  border-top-right-radius: ${scale(8)};
`;

const TextWrapper = styled(Text)`
  margin-top: ${({ marginTop }) => marginTop && scaleHeight(marginTop)};
  margin-bottom: ${scaleHeight(10)};
  margin-horizontal: ${scale(5)};
`;

const IconRow = styled.View`
  height: ${scaleHeight(24)};
  flex-direction: row;
  justify-content: flex-end;
  margin-horizontal: ${scale(5)};
  position: absolute;
  top: ${scaleHeight(5)};
  left: 0;
  right: 0;
`;

const IconButtonWrapper = styled(IconButton)`
  margin-top: 0;
`;

const ButtonContainer = styled.View`
  height: ${scaleHeight(106)};
  justify-content: center;
  width: ${scale(106)};
`;

const VaultPrizeCard = ({
  imageUrl,
  title,
  type,
  actionDatetime,
  ticketQty,
  shipOnPress,
  swapOnPress,
  hideSwapButton,
  onInfoPress,
  claimOnPress,
  prizeType,
}) => {
  const { playSoundEffect } = useContext(BackgroundMusicContext);

  const renderCardContent = () => {
    if (type === PRIZE_STATUS.NEW) {
      return (
        <ButtonContainer>
          <VaultButton 
            type={prizeType === PRIZE_TYPE_CODE.NFT ? PRIZE_ACTION_TYPE.CLAIM : PRIZE_ACTION_TYPE.SHIP} 
            action={prizeType === PRIZE_TYPE_CODE.NFT ? claimOnPress : shipOnPress} 
          />
          {!hideSwapButton && <VaultButton type={PRIZE_ACTION_TYPE.SWAP} ticketQty={ticketQty} action={swapOnPress} />}
        </ButtonContainer>
      );
    }
    return (
      <ButtonContainer>
        <PrizeActionStamp type={type} datetime={actionDatetime} />
      </ButtonContainer>
    );
  };

  const handleInfoButtonPress = () => {
    playSoundEffect(SOUNDS.POSITIVE_POPUP);
    onInfoPress();
  };

  return (
    <Container>
      <PrizeImage source={{ uri: imageUrl }} resizeMode="cover" />
      <TextWrapper
        numberOfLines={1}
        color={color.lightBlack}
        fontFamily={FONT_FAMILY.SEMI_BOLD}
        size={SIZE.XXSMALL}
        marginTop={10}
      >
        {title}
      </TextWrapper>
      {renderCardContent()}
      <IconRow>
        <IconButtonWrapper size={24} icon={info} onPress={handleInfoButtonPress} />
      </IconRow>
    </Container>
  );
};

VaultPrizeCard.defaultProps = {
  imageUrl: '',
  title: '',
  type: PRIZE_STATUS.NEW,
  actionDatetime: null,
  ticketQty: 0,
  shipOnPress: null,
  swapOnPress: null,
  hideSwapButton: false,
  claimOnPress: null,
};

VaultPrizeCard.propTypes = {
  actionDatetime: PropTypes.string,
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  ticketQty: PropTypes.number,
  type: PropTypes.oneOf([PRIZE_STATUS.NEW, PRIZE_STATUS.SWAPPED, PRIZE_STATUS.SHIPPED, PRIZE_STATUS.PACKING]),
  shipOnPress: PropTypes.func,
  swapOnPress: PropTypes.func,
  hideSwapButton: PropTypes.bool,
  onInfoPress: PropTypes.func.isRequired,
  claimOnPress: PropTypes.func,
  prizeType: PropTypes.string.isRequired,
};

export default VaultPrizeCard;
