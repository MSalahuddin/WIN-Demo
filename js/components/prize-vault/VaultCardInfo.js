import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';

import IconButton from '../common/IconButton';
import { parseDatetime } from '../../utils';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import { scale, scaleHeight, scaleWidth } from '../../platformUtils';
import { backgroundStars, closeBlack, clock, calendar, ticket, giftGray, giftBox } from '../../../assets/images';
import { color } from '../../styles';
import { prizeVaultStrings } from '../../stringConstants';

const StyledModal = styled(Modal)`
  background-color: ${color.white};
  margin: 0;
  justify-content: flex-start;
`;

const Header = styled.View`
  flex-direction: row;
  padding-horizontal: ${scale(24)};
  position: absolute;
  width: 100%;
  justify-content: flex-end;
  z-index: 1;
`;

const PrizeImage = styled.Image`
  height: ${scaleHeight(308)};
  width: 100%;
`;

const MissingImageView = styled.View`
  background-color: ${color.darkGrey};
  height: ${scaleHeight(308)};
  width: 100%;
`;

const ContentContainer = styled.View`
  align-items: center;
  justify-content: center;
  ${({ height }) => height && `height: ${scaleHeight(height)}`};
  ${({ marginTop }) => marginTop && `margin-top: ${scaleHeight(marginTop)}`};
`;

const RowContainerHeader = styled.View`
  align-items: flex-end;
  margin-top: ${scaleHeight(34)};
  margin-bottom: ${scaleHeight(10)};
  width: 100%;
`;

const RowContainer = styled.View`
  background-color: ${({ backgroundColor }) => backgroundColor || color.transparent};
  height: ${scaleHeight(45)};
  flex-direction: row;
  width: 100%;
`;

const RowColumn = styled.View`
  height: 100%;
  justify-content: center;
  width: ${({ widthPercentage }) => `${widthPercentage}%`};
`;

const TimeRowColumn = styled.View`
  align-items: flex-end;
  padding-right: ${scaleWidth(25)};
  justify-content: center;
  width: 30%;
`;

const IconContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 60%;
`;

const ImageIcon = styled.Image`
  height: ${scaleHeight(24)};
  width: ${scaleHeight(24)};
`;

const TextWrapper = styled(Text)`
  margin-horizontal: ${scale(3)};
  padding-top: ${({ paddingTop }) => (paddingTop ? scaleWidth(paddingTop) : 0)};
  margin-left: ${({ marginLeft }) => (marginLeft ? scaleWidth(marginLeft) : 0)};
`;



const TicketTextContainer = styled.View`
align-items: center;
justify-content: center;
  flex-direction: row;
  margin-top: ${({ marginTop }) => scaleHeight(marginTop)};
`;
const BottomImageContainer = styled.View`
  align-items: center;
  bottom: ${scaleHeight(24)};
  justify-content: center;
  position: absolute;
  width: 100%;
`;

const imageHeight = (scaleHeight(64) * 17) / 24;
const BottomImageWrapper = styled.Image`
  height: ${imageHeight};
  width: ${scaleHeight(64)};
`;

const StarBackground = styled.ImageBackground`
  flex: 1;
`;

const PriceCardModal = ({ isVisible, setVisible, data }) => {
  if (!data) {
    return null;
  }
  const { prize, packingDate, redeemDate, shippedDate, swapDate, winDate, nft, transferredNFT } = data;
  const { ticketsValue, ticketsValueWithBonus } = prize;
  const imageSource = nft?.imageURL ? { uri: nft?.imageURL } : { uri: prize?.imageUrl };

  // eslint-disable-next-line react/prop-types
  const renderRow = ({ title, timestamp, backgroundColor, fontColor }) => (
    <RowContainer backgroundColor={backgroundColor}>
      <RowColumn widthPercentage={40}>
        <TextWrapper marginLeft={32} paddingTop={5} size={SIZE.SMALL} color={fontColor || color.grayBlack}>
          {title}
        </TextWrapper>
      </RowColumn>
      <RowColumn widthPercentage={30}>
        <TextWrapper
          marginLeft={18}
          paddingTop={5}
          size={SIZE.XSMALL}
          color={fontColor || color.grayBlack}
          fontFamily={FONT_FAMILY.REGULAR}
        >
          {parseDatetime(timestamp).date}
        </TextWrapper>
      </RowColumn>
      <TimeRowColumn>
        <TextWrapper
          marginLeft={18}
          paddingTop={5}
          size={SIZE.XSMALL}
          color={fontColor || color.silver}
          fontFamily={FONT_FAMILY.REGULAR}
        >
          {parseDatetime(timestamp).time}
        </TextWrapper>
      </TimeRowColumn>
    </RowContainer>
  );

  const renderFooterImage = () => {
    let footerImageSource = null;
    if (swapDate) {
      footerImageSource = ticket;
    }
    if (packingDate || transferredNFT?.transferTransactionId) {
      footerImageSource = shippedDate || transferredNFT?.transferTransactionId ? giftBox : giftGray;
    }
    return (

      <BottomImageContainer>

        {swapDate && (
          <TicketTextContainer marginTop={9}>
            {(ticketsValueWithBonus && ticketsValueWithBonus !== ticketsValue) ?
              <TextWrapper paddingTop={0} color={color.darkPurple} size={SIZE.XLARGE} alignCenter>
                x{ticketsValueWithBonus}
              </TextWrapper>
              :
              <TextWrapper paddingTop={0} color={color.darkPurple} size={SIZE.XLARGE} alignCenter>
                x{ticketsValue}
              </TextWrapper>
            }
          </TicketTextContainer>
        )}

        {footerImageSource && <BottomImageWrapper source={footerImageSource} resizeMode="contain" />}
      </BottomImageContainer>

    );
  };

  const renderPrizeImage = () =>
    imageSource ? <PrizeImage source={imageSource} resizeMode="cover" /> : <MissingImageView />;

  return (
    <SafeAreaView>
      <StyledModal isVisible={isVisible}>
        <Header>
          <IconButton testID="cancel-button" onPress={() => setVisible(false)} icon={closeBlack} size={32} />
        </Header>
        {renderPrizeImage()}
        <StarBackground source={backgroundStars} resizeMode="center">
          <ContentContainer marginTop={24}>
            <Text color={color.grayBlack} size={SIZE.LARGE} fontFamily={FONT_FAMILY.SEMI_BOLD} alignCenter>
              {nft?.nftId ? nft?.name : prize.name}
            </Text>
          </ContentContainer>
          <RowContainerHeader>
            <IconContainer>
              <ImageIcon source={calendar} />
              <ImageIcon source={clock} />
            </IconContainer>
          </RowContainerHeader>
          {(winDate || redeemDate) &&
            renderRow({
              title: winDate ? prizeVaultStrings.won : prizeVaultStrings.redeemed,
              timestamp: winDate || redeemDate
            })}
          {swapDate &&
            renderRow({
              title: prizeVaultStrings.swapped,
              timestamp: swapDate,
              backgroundColor: color.blue,
              fontColor: color.white
            })}
          {packingDate &&
            renderRow({
              title: shippedDate ? prizeVaultStrings.packed : prizeVaultStrings.packingUp,
              timestamp: packingDate,
              backgroundColor: shippedDate ? color.silverWhite : color.pinkRed,
              fontColor: shippedDate ? null : color.white
            })}
          {shippedDate &&
            renderRow({
              title: prizeVaultStrings.shipped,
              timestamp: shippedDate,
              backgroundColor: color.green,
              fontColor: color.white
            })}
          {transferredNFT?.transferTransactionId &&
            renderRow({
              title: prizeVaultStrings.claimed,
              timestamp: transferredNFT?.updatedAt,
              backgroundColor: color.green,
              fontColor: color.white
            })}
          {renderFooterImage()}
        </StarBackground>
      </StyledModal>
    </SafeAreaView>
  );
};

PriceCardModal.propTypes = {
  data: PropTypes.shape({
    prize: PropTypes.shape({
      imageUrl: PropTypes.string,
      name: PropTypes.string.isRequired,
      ticketsValue: PropTypes.number.isRequired,
      ticketsValueWithBonus: PropTypes.number.isRequired
    }).isRequired,
    packingDate: PropTypes.string,
    redeemDate: PropTypes.string,
    shippedDate: PropTypes.string,
    swapDate: PropTypes.string,
    winDate: PropTypes.string,
    nft: PropTypes.shape({
      imageURL: PropTypes.string,
      nftId: PropTypes.string,
      name: PropTypes.string,
    }),
    transferredNFT: PropTypes.shape({
      transferTransactionId: PropTypes.string,
      updatedAt: PropTypes.string,
    }),
  }),
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired
};

PriceCardModal.defaultProps = {
  data: null
};

export default PriceCardModal;
