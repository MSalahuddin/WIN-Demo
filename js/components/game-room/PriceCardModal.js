/* eslint-disable max-len */
/* eslint-disable react/jsx-boolean-value */
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import { SafeAreaView, Platform, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { GetSocial, CustomInviteContent, MediaAttachment } from 'getsocial-react-native-sdk';
import IconButton from '../common/IconButton';
import GameCardButton from './GameCardButton';
import WatchDisplay from '../common/WatchDisplay';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import LastWin from '../common/LastWin';
import PopUpWrapper from '../common/PopUpWrapper';
import { scale, scaleHeight, scaleWidth } from '../../platformUtils';
import { ExitCircle, greenLight, greenArrow, gameVipBanner, redLight, UfoIcon, ClawIcon, BallIcon, iconShare, iconFavoriteSelected, iconFavoriteUnselected } from '../../../assets/images';
import { color } from '../../styles';
import { gameRoomStrings, commonStrings, popUpStrings } from '../../stringConstants';
import { convertNumberToStringWithComma } from '../../utils';
import { set } from 'react-native-reanimated';
import InviteFriendPopUp from '../common/InviteFriendPopUp';
import {
  BLUESHIFT_ANALYTICS_PROPERTIES,
  BLUSHIFT_EVENT,
  SCREENS,
  SHARE_TYPE_STRING,
  URLS
} from '../../constants';
import { logBlushiftEvent } from '../../blushiftutils';

const StyledModal = styled(Modal)`
  background-color: ${({ backgroundColor }) => backgroundColor};
  margin: 0;
  justify-content: flex-start;
`;

const Header = styled.View`
  flex-direction: row;
  padding-horizontal: ${scale(24)};
  position: absolute;
  width: 100%;
  justify-content: space-between;
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
const StatusContainer = styled.View`
flex-direction :column;
`;

const FavoriteContainer = styled.View`
flex-direction :column;
align-items: center;
`;

const StatusText = styled(Text)`
  line-height: ${scaleHeight(19)};
  margin-top: ${Platform.OS === 'android' ? scaleHeight(7) : scaleHeight(7)};
  color:${color.black}
`;

const DifficultyText = styled(Text)`
  line-height: ${scaleHeight(19)};
  margin-top: ${Platform.OS === 'android' ? scaleHeight(2) : scaleHeight(2)};
  color:${color.black}
`;


const FavoriteCount = styled(Text)`
  line-height: ${scaleHeight(19)};
  margin-top: ${Platform.OS === 'android' ? scaleHeight(5) : scaleHeight(5)};
  color:${color.black}
`;

const StatusInnerContainer = styled.View`
margin-top:${scaleHeight(24)}
  justify-content:center;
  align-items:center;
`;

const DifficultyContainer = styled.View`
margin-top:${scaleHeight(5)}
  justify-content:center;
  align-items:center;
`;


const FavoriteInnerContainer = styled.View`
  align-items:center;
`;
const ContentContainer = styled.View`
align-items: center;
text-align: center;
  justify-content: center;
  ${({ height }) => height && `height: ${scaleHeight(height)}`};
  ${({ marginTop }) => marginTop && `margin-top: ${scaleHeight(marginTop)}`};
  padding-horizontal:${scaleWidth(20)}
  `;

const GameCardButtonWrapper = styled(GameCardButton)`
  margin-top: ${scaleHeight(16)};
  height: ${scaleHeight(80)};
`;


const LastWinWrapper = styled(LastWin)`
  margin-top: ${scaleHeight(14)};
`;

const WatcherContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-horizontal: ${scale(20)};
  margin-vertical: ${scaleHeight(18)};
  justify-content: space-evenly;
`;

const OpenText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(3) : scaleHeight(8)};
width:${scaleWidth(60)};

`;



const ReplayButton = styled.TouchableOpacity`

`;

// scaleHeight(44) takes to half of play button
const FirstLayerBackground = styled.View`
  background-color: ${({ backgroundColor }) => backgroundColor};
  position: absolute;
  top: ${({ height }) => height + scaleHeight(44)};
  width: 100%;
  height: 100%;
`;
const StatusIcon = styled.Image`
width:${scale(30)};
height:${scale(30)}
`;

const DifficultyIcon = styled.Image`
width:${scale(36)};
height:${scale(36)}
`;

const VIPBanner = styled.Image`
  height: ${scale(60)};
  width:${scale(90)};
  z-index: 1;
`;
const TypeIcon = styled.Image`
height:${scaleHeight(54)};
width:${scaleHeight(54)};
border-radius:${scaleHeight(54)}
`;
const LastWinText = styled(Text)`
width:${scaleWidth(50)}
margin-top: ${Platform.OS === 'android' ? scaleHeight(3) : scaleHeight(8)};
`;
const LastWinnerView = styled.View`
flex-direction:column;
`;

const TypeIconView = styled.View`
flex-direction:column;
align-items:center
`;

const ExitCircleIcon = styled(IconButton)`
margin-left: 0
`;

const FavoriteIcon = styled(IconButton)`
margin-left: 0
`;

const ShareIcon = styled(IconButton)`
margin-left: 0;
margin-top:${scaleHeight(6)}
`;


const LastWinImage = styled.Image`
height:${scaleHeight(54)};
width:${scaleHeight(54)};
border-radius:${scaleHeight(54)}
`;

const PriceCardModal = ({ isDisableFavorite, setIsDisableFavorite, navigate, setFavorite, isVisible, setVisible, machineData, onPress, setVideoInfo, setshowPlayLastWinVideoAlertVideoAlert, setPlayLastWin }) => {
  const [firstSectionPosition, setFirstSectionPosition] = useState(0);
  const [isInviteFriend, setInviteFriend] = useState(false);

  const onFooterPress = () => {
    setInviteFriend(false)
    setVisible(false)
    navigate(SCREENS.APP_WEB_VIEW, { url: URLS.TERMS })
  }

  const onShare = (channelId) => {
    const mediaAttachmentContent = MediaAttachment.withImageUrl(machineData?.prize?.imageUrl)
    const customInviteContent = new CustomInviteContent();
    customInviteContent.withSubject(gameRoomStrings.sharePrizeSubject)
    customInviteContent.withText(gameRoomStrings.sharePrizeText)
    channelId !== popUpStrings.sms?.toLocaleLowerCase() && customInviteContent.withMediaAttachment(mediaAttachmentContent)

    GetSocial.sendInvite(
      channelId,
      customInviteContent,
      null,
      () => {
        logBlushiftEvent(BLUSHIFT_EVENT.SHARED_CLICK,{[BLUESHIFT_ANALYTICS_PROPERTIES.SHARE_TYPE]:SHARE_TYPE_STRING.Prize})
      },
      () => {
        // eslint-disable-next-line no-unused-vars
      },
      // eslint-disable-next-line no-unused-vars
      error => {
        Alert.alert(commonStrings.error, error, [{
          text: commonStrings.ok, onPress: () => { }
        }], { cancelable: false });
      }
    );
  }



  if (!machineData) {
    return null;
  }
  const {
    prize,
    lastWinTagMessage,
    isVip,
    tokensCost,
    gameRound,
    isFree,
    isDisabled,
    queueLength,
    machineTypes,
    machineDifficultyType,
    isLiked,
    likes
  } = machineData;
  const iconUrl = machineTypes?.imageUrl
  const machineName = machineTypes?.name
  const prizeName = prize?.name
  const profileImageUrl = gameRound?.player?.profileImageUrl;
  const gameRoundId = gameRound?.gameRoundId
  const { typeCode } = machineTypes;
  const imageSource = prize.imageUrl ? { uri: prize.imageUrl } : null;
  const backgroundColor = color.white;
  const firstLayerColor = color.grayWhite;
  const textColor = color.grayBlack;
  const isMachineAvailable = !queueLength;

  const renderCurrentPlayer = () => {

    return <OpenText alignCenter size={SIZE.XXXXSMALL}>{`${gameRoomStrings.watchLastWin}`}</OpenText>;
  };

  const renderVIPBanner = () => {
    return <VIPBanner source={gameVipBanner} resizeMode="contain" />;
  };


  const renderPrizeImage = () =>
    imageSource ? (
      <PrizeImage
        source={imageSource}
        resizeMode="cover"
      />
    ) : (
      <MissingImageView />
    );
  const playOnPress = () => {
    if (gameRound && 'replayUrl' in gameRound && gameRoundId && prizeName) {
      const { replayUrl } = gameRound
      setVideoInfo({ replayUrl, gameRoundId, prizeName });
      setVisible(false)
      setPlayLastWin(true)
    } else {
      setVisible(false)
      setshowPlayLastWinVideoAlertVideoAlert(true)
    }
  }
  return (
    <SafeAreaView>
      <StyledModal isVisible={isVisible} backgroundColor={backgroundColor}>
        {isInviteFriend && <InviteFriendPopUp
          isVisible={isInviteFriend}
          onDissmiss={() => setInviteFriend(false)}
          footerPress={() => onFooterPress()}
          onShare={(channelId) => onShare(channelId)}
        />}
        <PopUpWrapper onDismiss={() => setVisible(false)}>
          <FirstLayerBackground height={firstSectionPosition} backgroundColor={firstLayerColor} />
          <Header>
            <StatusContainer>
              {isVip && renderVIPBanner()}
              <StatusInnerContainer>
                <StatusIcon source={isMachineAvailable ? greenLight : redLight} />
                <StatusText fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.SMALL}>
                  {isMachineAvailable ? gameRoomStrings.open : gameRoomStrings.inUse}
                </StatusText>
              </StatusInnerContainer>

              <DifficultyContainer>
                <DifficultyIcon source={{ uri: machineDifficultyType?.imageUrl }} />
                <DifficultyText fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.XXXSMALL}>
                  {machineDifficultyType?.name}
                </DifficultyText>
              </DifficultyContainer>
            </StatusContainer>
            <FavoriteContainer>
              <ExitCircleIcon testID="cancel-button" onPress={() => setVisible(false)} icon={ExitCircle} size={38} />
              <FavoriteInnerContainer>
                <FavoriteIcon testID="favorite-button" onPress={() => (setFavorite(), setIsDisableFavorite(true))} disabled={isDisableFavorite} icon={isLiked ? iconFavoriteSelected : iconFavoriteUnselected} size={32} />
                <FavoriteCount fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.XXXSMALL}>
                  {likes}
                </FavoriteCount>
              </FavoriteInnerContainer>
              <ShareIcon testID="share-button" onPress={() => (setTimeout(() => {
                setInviteFriend(true)
              }, 1000))} icon={iconShare} size={32} />
            </FavoriteContainer>
          </Header>
          {renderPrizeImage()}
          <ContentContainer marginTop={20}>
            <Text color={textColor} size={SIZE.LARGE} fontFamily={FONT_FAMILY.SEMI_BOLD} alignCenter={true}>
              {prize && prize.name}
            </Text>
          </ContentContainer>
          <ContentContainer>
            <Text color={color.silver} size={SIZE.XSMALL}>
              {`${gameRoomStrings.orWin} ${convertNumberToStringWithComma(prize && prize.ticketsValue)} ${gameRoomStrings.tickets}`}
            </Text>
          </ContentContainer>
          <WatcherContainer>
            {profileImageUrl && <LastWinnerView Size={scaleHeight(54)} source={{ uri: profileImageUrl }}>
              <LastWinImage source={{ uri: profileImageUrl }} />
              <LastWinText alignCenter size={SIZE.XXXXSMALL}>{gameRoomStrings.lastWinner}</LastWinText>
            </LastWinnerView>}

            <TypeIconView Size={scaleHeight(50)}>
              <TypeIcon source={{ uri: iconUrl }} />
              <LastWinText alignCenter size={SIZE.XXXXSMALL}>{machineName}</LastWinText>
            </TypeIconView>

            <ReplayButton onPress={playOnPress}>
              <WatchDisplay Size={scaleHeight(54)} icon={greenArrow}>{renderCurrentPlayer()}</WatchDisplay>
            </ReplayButton>
          </WatcherContainer>
          <LastWinWrapper timestamp={lastWinTagMessage} />

          <GameCardButtonWrapper
            testID="game-play-button"
            isLarge
            isGradient
            isFree={isFree}
            isGameVIP={isVip}
            isDisabled={isDisabled}
            tokensCost={tokensCost}
            onPress={onPress}
            onLayout={event => {
              const { y } = event.nativeEvent.layout;
              setFirstSectionPosition(y);
            }}
          />

        </PopUpWrapper>
      </StyledModal>
    </SafeAreaView>
  );
};

PriceCardModal.propTypes = {
  machineData: PropTypes.shape({
    prize: PropTypes.shape({
      imageUrl: PropTypes.string,
      name: PropTypes.string.isRequired,
      ticketsValue: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired
    }).isRequired,
    gameRound: PropTypes.shape({
      player: PropTypes.shape({
        profileImageUrl: PropTypes.string,
      }),
      gameRoundId: PropTypes.string,
      replayUrl: PropTypes.string

    }),
    lastWinTagMessage: PropTypes.string,
    isVip: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    isFree: PropTypes.bool.isRequired,
    tokensCost: PropTypes.number.isRequired,
    viewersCount: PropTypes.number.isRequired,
    queueLength: PropTypes.number.isRequired,
    currentPlayerProfileUrl: PropTypes.string,
    lastWinReplayUrl: PropTypes.string,
    likes: PropTypes.number.isRequired,
    isLiked: PropTypes.bool.isRequired,
    isDisableFavorite: PropTypes.bool.isRequired,
    setIsDisableFavorite: PropTypes.func.isRequired,
    machineTypes: {
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      typeCode: PropTypes.number.isRequired
    }
  }),
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  setFavorite: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
  setVideoInfo: PropTypes.func.isRequired,
  setPlayLastWin: PropTypes.func.isRequired,
  setshowPlayLastWinVideoAlertVideoAlert: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired
};

PriceCardModal.defaultProps = {
  machineData: null
};

export default PriceCardModal;
