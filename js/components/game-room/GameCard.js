import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import GameCardButton from './GameCardButton';
import IconButton from '../common/IconButton';
import Banner, { BANNER_TYPE } from '../common/Banner';
import { scale, getWindowWidth, scaleHeight, scaleWidth } from '../../platformUtils';
import { color } from '../../styles';
import { gameInfo, gameVipBanner, checkBack, UfoIcon, ClawIcon, BallIcon } from '../../../assets/images';
import { gameRoomStrings } from '../../stringConstants';
import RNFastImage from '../common/RNFastImage';

// showing 2 cards per row minus padding 16 each side and between
const cardWidth = (getWindowWidth() - 3 * scale(16)) / 2;
const cardHeight = (cardWidth * 320) / 250
const MainContainer = styled.View`
height:${cardHeight + 10};

`


const Container = styled.View`
  border-radius: ${scale(7)};
  margin-top: ${scale(12)};
  height:${cardHeight};
  width: ${cardWidth};
  border-width:${scale(10)};
  border-color:${color.cardBorderBlue};
  height:${cardHeight};
  width: ${cardWidth};
  z-index:1;
  justify-content:center;
  shadow-color: ${color.blackShadow};
  shadow-offset: 4px 4px;
  border-radius: 10;
  shadow-opacity: ${1};
  shadow-radius: 2px;
  elevation: 8;
  background-color:black;
  
`;

const CheckBackOverlay = styled.View`
  border-radius: ${scale(9)};
  height:${cardHeight};
  width: ${cardWidth};
  z-index:1;
  background-color:${color.shippingBgColor};
  position: absolute;
  left:${scale(-10)};
`;


const ContentCotainer = styled.TouchableOpacity`
  background-color: ${color.cardBorderBlue};
  height:${cardHeight - 15};
  align-self:center;
  width: ${cardWidth - 15};
  `;


const InfoButton = styled(IconButton)`
top: ${scaleHeight(-15)}; 
position: absolute;
  right: ${scale(8)};
`;

// the height should be proportional to the image size we get
const prizeIconHeight = cardHeight * 0.55;

const CheckBackImage = styled.ImageBackground`
  height: ${cardHeight};
  width: ${cardWidth * 0.8};
  
 align-self:center

`;

// border-width:${scale(7)};
// border-color:${color.cardBorderBlue};
const MissingImageView = styled.View`
  background-color: ${color.darkGrey};
  border-top-left-radius: ${scale(8)};
  border-top-right-radius: ${scale(8)};
  height: ${prizeIconHeight};
  width: ${cardWidth};
`;

const PrizeTextContainer = styled.View`
  align-items: center;
  margin-top: 0;
  height:${cardHeight * 0.175};
  justify-content: center;
`;

const PrizeTextWrapper = styled(Text)`
  margin-top: ${cardHeight * 0}
  ;
`;

const VIPBanner = styled.Image`
position:absolute;
  left: ${scaleWidth(60)};
  top: ${scaleHeight(-10)};
  elevation: 19;
`;

const VIPBannerView = styled.View`
position:absolute;
  left: ${scaleWidth(10)};
  top: ${scaleHeight(-10)};
  elevation: ${({ elevation }) => elevation ? 0 : 19};
  background-color:${color.darkPink}
  height:${scaleWidth(39)}
  width:${scaleWidth(38)}
  border-bottom-left-radius: ${scale(8)};
  border-bottom-right-radius: ${scale(8)};
  align-items:center
  justify-content:center
`;

const VIPBannerText = styled(Text)`
margin-top: ${scaleHeight(-4)}
`;

const DifficultyIcon = styled.Image`
${({ isVip }) => isVip ? `width: ${scale(20)}` : `width: ${scale(24)}`};
${({ isVip }) => isVip ? `height: ${scale(20)}` : `height: ${scale(24)}`};
`;



const ButtonContainer = styled.View`
flex-direction:row;
width:100%;
position:absolute;
bottom:0.9%;
right:0.9%;

`;
const TypeIcon = styled.Image`
height:${scale(30)}
width:${scale(30)}
align-self:center;

`;
const TypeIconContainer = styled.View`
width:30%
align-self:center;

`;

const GameCardButtonWrapper = styled(GameCardButton)`
width:69%;
  margin-top: ${({ marginTop }) => scaleHeight(marginTop)};
  margin-bottom: ${scaleHeight(2)};
  margin-right:${scale(1)};
`;
const Content = styled.View`
height:${cardHeight * 0.377};
background-color: ${color.white};
align-self:center;
width:100%
margin-bottom:1
border-bottom-left-radius: ${scale(10)};
border-bottom-right-radius: ${scale(10)}
`;
const GameCard = ({ isMachineAvailable, isPrizeAvailable, isFavorite, prizeName, isFree, isGameVIP, imageUrl, tokensCost, onPress, onPressInfo, isDisabled, machineTypes, machineDifficultyType }) => {
  const iconUrl = machineTypes?.imageUrl
  return (
    <Container>
      {(isFavorite && (!isPrizeAvailable || !isMachineAvailable)) && <CheckBackOverlay>
        <CheckBackImage source={checkBack} resizeMode="contain" />
      </CheckBackOverlay>
      }
      <ContentCotainer onPress={onPress}>
        {imageUrl ? (
          <RNFastImage style={{
            borderTopLeftRadius: scale(10),
            borderTopRightRadius: scale(10),
            height: prizeIconHeight,
            width: '100%',
            alignSelf: 'center'
          }} imageUrl={imageUrl} resizeMode="cover" />
        ) : <MissingImageView />}
        <Content>
          <PrizeTextContainer marginTop={12}>
            <PrizeTextWrapper
              alignCenter
              color={color.lightBlack}
              fontFamily={FONT_FAMILY.SEMI_BOLD}
              size={SIZE.XXXSMALL}
              numberOfLines={2}
            >
              {prizeName}
            </PrizeTextWrapper>
          </PrizeTextContainer>
          <ButtonContainer>
            <TypeIconContainer>
              <TypeIcon source={{ uri: iconUrl }} />
            </TypeIconContainer>
            <GameCardButtonWrapper
              isFree={isFree}
              isGameVIP={isGameVIP}
              isDisabled={isDisabled}
              tokensCost={tokensCost}
              onPress={onPress}
              gradient
              gameCard
              marginTop={4}
            />
          </ButtonContainer>
        </Content>
      </ContentCotainer>
      <InfoButton testID="info-button" onPress={onPressInfo} icon={gameInfo} size={24} marginTop={0} />
      <VIPBannerView elevation={isFavorite && (!isPrizeAvailable || !isMachineAvailable)}>
        {isGameVIP && (
          <VIPBannerText
            alignCenter
            color={color.white}
            fontFamily={FONT_FAMILY.MEDIUM}
            size={SIZE.XXXSMALL}
          >
            {gameRoomStrings.vip}
          </VIPBannerText>
        )}
        <DifficultyIcon isVip={isGameVIP} source={{ uri: machineDifficultyType?.imageUrl }} />
      </VIPBannerView>
    </Container>


  );
};

GameCard.defaultProps = {
  imageUrl: null,
  machineTypes: null,
  machineDifficultyType: null
};

GameCard.propTypes = {
  imageUrl: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  isFree: PropTypes.bool.isRequired,
  isGameVIP: PropTypes.bool.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  isPrizeAvailable: PropTypes.bool.isRequired,
  isMachineAvailable: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  onPressInfo: PropTypes.func.isRequired,
  tokensCost: PropTypes.number.isRequired,
  prizeName: PropTypes.string.isRequired,
  machineTypes: PropTypes.shape({
    typeCode: PropTypes.number,
    imageUrl: PropTypes.string
  }),
  machineDifficultyType: PropTypes.shape({
    imageUrl: PropTypes.string
  }),
};

export default GameCard;
