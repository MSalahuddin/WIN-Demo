import PropTypes from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';
import { Platform } from 'react-native';
import Modal from 'react-native-modal';
import Video from 'react-native-video';
import styled from 'styled-components/native';
import { closeBlack, howtoBackgroundPopUp, lastWinArrow, unavailable } from '../../../assets/images';
import { scale, scaleHeight, scaleWidth } from '../../platformUtils';
import { gamePlayStrings, popUpStrings, landingStrings } from '../../stringConstants';
import { color } from '../../styles';
import Button, { BUTTON_COLOR_SCHEME } from '../common/Button';
import IconButton from '../common/IconButton';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import api from '../../api';
import { SCREENS, URLS } from '../../constants';
import { SOUNDS } from '../../soundUtils';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';
import StampPopUp from '../common/StampPopUp';
import TextButton from '../common/TextButton';
import SimpleButton from '../common/SimpleButton';

const ButtonWrapper = styled(SimpleButton)`
  border-color: ${color.darkRed};
  border-radius: ${scaleHeight(40)};
  `;

const BuyTokenContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const BuyTokenIcon = styled.Image`
  height: ${scaleHeight(20)};
  width: ${scaleHeight(20)};
`;

const BuyTokenText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(7)};
  margin-left: 5;
`;

const StyledModal = styled(Modal)`
  background-color: ${color.black};
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

const VideoWrapper = styled(Video)`
  top: 25%;
  width: 100%;
  height: 50%;
  background-color: ${color.black};
`;

const HeadingText = styled(Text)`
  margin-bottom: ${scaleHeight(15)};
`;
const ContentContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: ${scale(220)};
`;
const SubContentContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: ${scale(220)};
  margin-top: ${scale(20)};
`;
const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;
const ButtonText = styled(Text)`
  margin-top: ${Platform.OS === 'ios' ? scaleHeight(5) : 0};
`;
const TextButtonWrapper = styled(TextButton)`
  margin-top: ${scaleHeight(20)};
`;
const ButtonContainer = styled(SimpleButton)``;

const PlayLastWin = ({ machineData, navigation }) => {
  const { playMusic, pauseBackgroundMusic } = useContext(BackgroundMusicContext);
  const [videoVisisble, setVideoVisible] = useState(false);
  const [showVideoAlert, setShowVideoAlert] = useState(false);
  const [url, setUrl] = useState(null);
  const [disabled, setDisabled] = useState(true);

  const getMachineDetail = async () => {
    try {
      const { prize, machineId } = machineData;
      const { prizeId } = prize;
      const res = await api.getMachineDetails(machineId, prizeId);
      if (res.status === 200 && res.data) {
        const { gameRound } = res.data;
        if (gameRound && 'replayUrl' in gameRound) {
          const { replayUrl } = gameRound;
          setUrl(replayUrl);
          setDisabled(false);
        }
      }
    } catch (error) {
      setDisabled(true);
    }
  };

  useEffect(() => {
    getMachineDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressPlayLastWin = () => {
    setVideoVisible(true);
  };

  const onPressCancel = () => {
    setVideoVisible(false);
  };

  const videoOnError = () => {
    setVideoVisible(false);
    setDisabled(false);
    setTimeout(() => {
      setShowVideoAlert(true);
    }, 1000);
  };

  const navigateToHelp = () => {
    setShowVideoAlert(false);
    navigation.navigate(SCREENS.APP_WEB_VIEW, { url: URLS.HELP, title: landingStrings.helpAndContact });
  };

  return (
    <>
      <ButtonWrapper 
      backgroundColor={[color.white]} 
      onPress={onPressPlayLastWin} 
      disabled={disabled}
      height={scaleHeight(50)}
      width={scaleWidth(135)}
      borderWidth={2}
      borderColor={color.darkGrey}
      disableBackgroundColor={[color.white]}>
        <BuyTokenContainer>
          <BuyTokenIcon source={lastWinArrow} />
          <BuyTokenText size={SIZE.XSMALL} color={color.black}>
            {gamePlayStrings.lastWin}
          </BuyTokenText>
        </BuyTokenContainer>
      </ButtonWrapper>
      <StyledModal
        isVisible={videoVisisble}
        onModalHide={() => playMusic(SOUNDS.GAME_PLAY_MUSIC)}
        onModalShow={() => pauseBackgroundMusic()}
      >
        <Header>
          <IconButton testID="cancel-button" onPress={onPressCancel} icon={closeBlack} size={32} />
        </Header>
        <VideoWrapper
          controls
          fullscreen
          // onLoad={trackWatchGamePlay}
          onError={videoOnError}
          source={{ uri: url }}
          resizeMode="cover"
        />
      </StyledModal>
      <StampPopUp isVisible={showVideoAlert} backgroundImage={howtoBackgroundPopUp} stampIcon={unavailable}>
        <HeadingText isUppercase alignCenter size={SIZE.XXXLARGE} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
          {popUpStrings.unavailable}
        </HeadingText>
        <ContentContainer>
          <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
            {popUpStrings.videoUnavailableText}
          </Text>
        </ContentContainer>
        <SubContentContainer>
          <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
            {popUpStrings.pleaseContactSupport}
          </Text>
        </SubContentContainer>
        <ButtonContainer
          testID="popup-button"
          borderRadius={44}
          marginTop={25}
          height={53}
          width={200}
          onPress={() => {
            setShowVideoAlert(false);
          }}
        >
          <ButtonContentContainer>
            <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.darkNavyBlue} size={SIZE.SMALL}>
              {popUpStrings.goBack}
            </ButtonText>
          </ButtonContentContainer>
        </ButtonContainer>
        <TextButtonWrapper
          color={color.white}
          isUnderlined={true}
          label={popUpStrings.contactSupport.toLowerCase()}
          onPress={navigateToHelp}
        />
      </StampPopUp>
    </>
  );
};

PlayLastWin.propTypes = {
  machineData: PropTypes.shape({
    prize: PropTypes.shape({
      prizeId: PropTypes.number.isRequired
    }).isRequired,
    machineId: PropTypes.number.isRequired
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};

export default PlayLastWin;
