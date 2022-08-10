import React, { useContext, useState } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import axios from 'axios';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';


import api from '../../api';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import TextButton from '../common/TextButton';
import IconButton from '../common/IconButton';
import { UserContext } from '../../context/User.context';
import { scale, getWindowWidth, scaleHeight, scaleWidth, heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import { bannerWon, bannerLost, bannerExited, watchGreen, share, tick ,play_history_share,play_history_watch,
play_history_token, report_flag, reported_flag } from '../../../assets/images';
import { playHistoryStrings, reportIssueStrings } from '../../stringConstants';
import { openUrl } from '../../utils';
import {
   REPORT_ISSUE_EMAIL_TO, 
   ANALYTICS_EVENTS, 
   ANALYTICS_PROPERTIES, 
   ANALYTICS_APPSFLYER_EVENTS_PARAMETER, 
   ANALYTICS_APPSFLYER_EVENTS, 
   BLUSHIFT_EVENT,
   BLUESHIFT_ANALYTICS_PROPERTIES,
   SHARE_TYPE_STRING} from '../../constants';
import { logEvent } from '../../amplitudeUtils';
import {AFLogCustomEvent} from "../../appFlyer.utils";
import { Platform } from 'react-native';
import { logBlushiftEvent } from '../../blushiftutils';


const Banner = styled.Image`
  position: absolute;
  left: ${scaleHeight(-2)};
  top: ${scaleHeight(-2)};
  height: ${scaleHeight(58)};
  width: ${scaleHeight(60)};
`;

const cardWidth = getWindowWidth() - scale(32);
const cardContentWidth = cardWidth - scaleWidth(100);

const Container = styled.View`
  background-color: ${color.white};
  border-radius: ${scale(8)};
  flex-direction: row;
  margin-top: ${scale(12)};
  margin-left: ${scaleWidth(16)};
  shadow-color: ${color.blackShadow};
  shadow-offset: 4px 4px;
  shadow-opacity: ${1};
  shadow-radius: 2px;
  width: ${cardWidth};
`;

const PrizeImage = styled.Image`
  border-top-left-radius: ${scale(8)};
  border-bottom-left-radius: ${scale(8)};
  height: 100%;
  width: ${scaleWidth(100)};
`;

const TimeWonContainer = styled.View`
  align-items: center;
  background-color: ${color.grayWhite};
  border-top-right-radius: ${scale(8)};
  flex-direction: column;
  height: ${scale(34.5)};
  width:${scale(80)}
  justify-content: center;
  position:absolute;
  right:${scale(0.00000001)};
  background-color:${color.navyBlue};
  padding-vertical:${scale(0)}
  `;
  // padding-left: ${scaleWidth(19)};
  // padding-right: ${scaleWidth(16)};
  // width: ${cardContentWidth};
  
  const TextWrapper = styled(Text)`
    padding-vertical: ${scale(1)};
  `;
  const PaddedText = styled(Text)`
    margin-top:${Platform.OS === 'ios' ? scale(3) : 0}
  `;
const prizeDetailsPaddingTop = heightRatio > 1 ? scaleWidth(24) : scaleWidth(8);
const PrizeDetailsContainer = styled.View`
  align-items: flex-start;
  padding-horizontal: ${scaleWidth(10)};
  width: ${cardContentWidth};
  height:100%;
  justify-content: space-evenly
  `;
  // padding-top: ${prizeDetailsPaddingTop};

const PrizeDetailsSubContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width:100%;
  align-items: center
`
const TokenIdContainer = styled.View`
`
const TokenContainer = styled.View`
  flex-direction:row;
  align-items: center;
  margin-bottom:${Platform.OS === 'ios' ? scale(5) : 0}
`



const HistoryContentContainer = styled.View`
  align-items: flex-start;
  height: ${scaleHeight(92)};
  border-top-right-radius: ${scale(8)};
  border-bottom-right-radius: ${scale(8)};
  justify-content: flex-start;
  width: ${cardContentWidth};
  margin-bottom: ${scaleWidth(0)};
  background-color:${color.cardBorderBlue};
  padding-vertical:${scaleWidth(8)}
`;


const TextLinkContainer = styled.View`
  flex-direction:row
  align-items:center
  padding-top: ${scale(5)};
  justify-content: space-around
`;

const TextLinkWrapper = styled(TextButton)`

  text-decoration: none;
`;

const LinksContainer = styled.View`
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: ${scaleWidth(100)};
`;

const IconButtonWrapper = styled(IconButton)`
  margin-top: 0;
  margin-left: 0;
`;
const TickWrapper = styled(IconButton)`
  margin-top: 0;
  margin-left: 0;
  margin-right: 3
`;
const PrizeNameContainer = styled.View`
  height: ${scaleWidth(40)};
  width: ${scaleWidth(140)}
`;

const PlayHistoryCard = ({
  gamePlayDate,
  gamePlayTime,
  imageUrl,
  isWon,
  prizeName,
  tokensCost,
  gameRoundId,
  videoUri,
  machineId,
  setShowVideoAlert,
  setVideoInfo,
  setIsVideoModalVisible,
  isReported,
}) => {
  const { firstName, lastName, playerId } = useContext(UserContext);
  const [isShareDisabled, setIsShareDisabled] = useState(false);
  const [reportStatus, setReportStatus] = useState(isReported);
  const videoDownloadPath = `${RNFS.DocumentDirectoryPath}/ww-video.mp4`;
  let gameStatus = null

  const getVideoUri = async () => {
    if (!videoUri) return reportIssueStrings.videoNotAvailable;

    try {
      const isUriValid = await axios.head(videoUri);
      if (isUriValid.status === 200) {
        return videoUri;
      }
      return reportIssueStrings.videoNotAvailable;
    } catch {
      return reportIssueStrings.videoNotAvailable;
    }
  };

  const reportIssue = async () => {
    const videoLink = await getVideoUri();
    const subject = `${reportIssueStrings.subject}: |${firstName} ${lastName}|${prizeName}|${gamePlayDate}`;
    const winningStatus = isWon ? reportIssueStrings.win : reportIssueStrings.lose;
    // eslint-disable-next-line max-len
    const body = `${reportIssueStrings.prizeName}: ${prizeName}\n${reportIssueStrings.dateOfPlay}: ${gamePlayDate} \n${reportIssueStrings.timeOfPlay}: ${gamePlayTime} \n${reportIssueStrings.playerName}: ${firstName} ${lastName} \n${reportIssueStrings.playerId}: ${playerId} \n${reportIssueStrings.status}: ${winningStatus} \n${reportIssueStrings.gameRoundId}: ${gameRoundId} \n${reportIssueStrings.gamePlayVideo}: ${videoLink} \n${reportIssueStrings.machineId}: ${machineId} \n${reportIssueStrings.tokensCost}: ${tokensCost}`;

    const url = `mailto:${REPORT_ISSUE_EMAIL_TO}?subject=${subject}&body=${body}`;
    openUrl(url);
    await putReportIssue()
  };

  const putReportIssue = async () => {
    try {
      const res = await api.putReportIssue(gameRoundId, true);
      if (res.status === 200 && res.data) {
        setReportStatus(true)
      }
    } catch (error) {
      // fail silently
    }
  }



  const trackShareVideo = async () => {
    logEvent(ANALYTICS_EVENTS.SHARED_GAME_PLAY, {
      [ANALYTICS_PROPERTIES.PRIZE_NAME]: prizeName,
      [ANALYTICS_PROPERTIES.GAME_ROUND_ID]: gameRoundId
    });
    AFLogCustomEvent(ANALYTICS_APPSFLYER_EVENTS.SHARE, {
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.SHARE.PLATFORM]: Platform.OS,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.SHARE.MACHINE_ID]: machineId,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.SHARE.MACHINE_LOCATION]: "",
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.SHARE.MACHINE_TYPE]: "",
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.SHARE.GAME_ROUND_ID]: gameRoundId,
    });
    logBlushiftEvent(BLUSHIFT_EVENT.SHARED_CLICK,{[BLUESHIFT_ANALYTICS_PROPERTIES.SHARE_TYPE]:SHARE_TYPE_STRING.GameRound})
    // This call tells BE a video has been shared on social media
    // for tracking achievements
    try {
      await api.getVideoShareAchievement();
    } catch (error) {
      // fail silently
    }
  };

  const shareVideo = ({ fileStatus }) => {
    if (fileStatus.statusCode === 200) {
      trackShareVideo({ gameRoundId, prizeName });
      Share.open({
        url: videoDownloadPath,
        failOnCancel: false,
        message: playHistoryStrings.videoShareMessage
      }).catch(() => {
        // fail silently
      });
    } else {
      setShowVideoAlert(true);
    }
    setIsShareDisabled(false);
  };

  const shareOnPress = async () => {
    if (!videoUri) {
      setShowVideoAlert(true);
      return;
    }

    setIsShareDisabled(true);
    try {
      const exists = await RNFS.exists(videoDownloadPath);
      if (exists) {
        await RNFS.unlink(videoDownloadPath);
      }

      const downloadOptions = {
        fromUrl: videoUri,
        toFile: videoDownloadPath
      };

      const downloadFile = await RNFS.downloadFile(downloadOptions);

      downloadFile.promise.then(fileStatus => {
        shareVideo({ fileStatus });
      });
    } catch (error) {
      setShowVideoAlert(true);
      setIsShareDisabled(false);
    }
  };

  const playOnPress = () => {
    if (videoUri) {
      setVideoInfo({ replayUrl: videoUri, gameRoundId, prizeName });
      setIsVideoModalVisible(true);
    } else {
      setShowVideoAlert(true);
    }
  };
  switch (isWon) {
    case true:
      gameStatus = bannerWon
      break;

    case false:
      gameStatus = bannerLost
      break;

    default:
      gameStatus = bannerExited
  }
  return (
    <Container>
      <PrizeImage source={{ uri: imageUrl }} resizeMode="cover" />
      <HistoryContentContainer>
        <TimeWonContainer>
          <TextWrapper alignCenter color={color.white} fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XXXXSMALL}>
            {gamePlayDate}
          </TextWrapper>
          <TextWrapper alignCenter color={color.white} fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XXXXSMALL}>
            {gamePlayTime}
          </TextWrapper>
        </TimeWonContainer>
        <PrizeDetailsContainer>
          <PrizeNameContainer>
            <TextWrapper
              color={color.white}
              fontFamily={FONT_FAMILY.SEMI_BOLD}
              size={SIZE.XXSMALL}
              numberOfLines={2}
            >
              {prizeName}
            </TextWrapper>
          </PrizeNameContainer>
          <PrizeDetailsSubContainer>
          {tokensCost ? <TokenIdContainer>
            <TokenContainer>
            <TickWrapper testID="play-button" icon={play_history_token} size={18} disabled={true} />
            <PaddedText alignCenter color={color.white} fontFamily={FONT_FAMILY.MEDIUM} size={SIZE.XXXSMALL}>
              {`${tokensCost} ${playHistoryStrings.tokens}`}
            </ PaddedText>
            </TokenContainer>
            <Text alignCenter color={color.white} fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XXXXSMALL}>
              {`${playHistoryStrings.gameId}: ${gameRoundId}`}
            </Text>
          </TokenIdContainer>: <Text alignCenter color={color.white} fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XXSMALL}>{playHistoryStrings.freePlay}</Text> }
          <LinksContainer>
            {/* <TextLinkContainer>
              {reportStatus && <TickWrapper testID="play-button" icon={tick} size={16} disabled={true} />}
              {<TickWrapper testID="play-button" icon={tick} size={16} disabled={true} />}
              {reportStatus ?
                <TextLinkWrapper
                  testID="report-issue-text-button"
                  alignCenter
                  color={!reportStatus ? color.pinkRed : color.green}
                  size={SIZE.XXXXSMALL}
                  label={playHistoryStrings.reportedIssue}
                  onPress={reportIssue}
                  disabled={true}
                />
                :
                <TextLinkWrapper
                  testID="report-issue-text-button"
                  alignCenter
                  color={color.pinkRed}
                  size={SIZE.XXXXSMALL}
                  label={playHistoryStrings.reportIssue}
                  onPress={reportIssue}
                  disabled={false}
                />

              }
            </TextLinkContainer> */}
            {reportStatus ? 
              <IconButtonWrapper 
                  testID="report-issue-text-button"
                  testID="play-button" 
                  icon={reported_flag} 
                  size={27} 
                  onPress={reportIssue}
                  disabled={true}
              /> : 
              <IconButtonWrapper 
                  testID="report-issue-text-button"
                  testID="play-button" 
                  icon={report_flag} 
                  size={27}   
                  onPress={reportIssue}
                  disabled={false}
                />}
            <IconButtonWrapper testID="play-button" icon={play_history_watch} size={27} onPress={playOnPress} />
            <IconButtonWrapper
              testID="share-button"
              icon={play_history_share}
              size={27}
              onPress={shareOnPress}
              disabled={isShareDisabled}
              iconOpacity={isShareDisabled ? 0.5 : 1}
            />
          </LinksContainer>
          </PrizeDetailsSubContainer>
        </PrizeDetailsContainer>
      </HistoryContentContainer>
      <Banner source={gameStatus} resizeMode="contain" />
    </Container>
  );
};

PlayHistoryCard.propTypes = {
  prizeName: PropTypes.string.isRequired,
  gamePlayDate: PropTypes.string.isRequired,
  gamePlayTime: PropTypes.string.isRequired,
  isWon: PropTypes.bool,
  imageUrl: PropTypes.string.isRequired,
  tokensCost: PropTypes.number.isRequired,
  gameRoundId: PropTypes.number.isRequired,
  videoUri: PropTypes.string,
  machineId: PropTypes.number.isRequired,
  setShowVideoAlert: PropTypes.func.isRequired,
  setVideoInfo: PropTypes.func.isRequired,
  setIsVideoModalVisible: PropTypes.func.isRequired,
  isReported: PropTypes.bool.isRequired,
};

PlayHistoryCard.defaultProps = {
  isWon: false,
  videoUri: null
};

export default PlayHistoryCard;
