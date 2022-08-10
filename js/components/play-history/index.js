import React, { useState, useEffect, useContext, useCallback } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { NavigationEvents } from 'react-navigation';
import PropTypes from 'prop-types';
import LazzyLoadButton from '../common/LazzyLoadButton';
import api from '../../api';
import LoadingSpinner from '../common/LoadingSpinner';
import PlayHistoryCard from './PlayHistoryCard';
import Banner, { BANNER_TYPE } from '../common/Banner';
import PopUpWrapper from '../common/PopUpWrapper';
import InstructionPopUp from '../common/InstructionPopUp';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import VideoModal from './VideoModal';
import { getDisplayDate, getDisplayTime } from '../../utils';
import { CenterCircleBackGround, howtoBackgroundPopUp, medalClock, unavailable } from '../../../assets/images';
import { getWindowWidth, scale, scaleHeight } from '../../platformUtils';
import { flatListStyles, SafeAreaContainer, color } from '../../styles';
import { playHistoryStrings, popUpStrings, landingStrings } from '../../stringConstants';
import { PopupContext } from '../../context/Popup.context';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';
import { SCREENS, URLS } from '../../constants';
import BottomNavigator from '../game-room/BottomBar';
import { SOUNDS } from '../../soundUtils';
import StampPopUp from '../common/StampPopUp';
import SimpleButton from '../common/SimpleButton';
import TextButton from '../common/TextButton';

const Background = styled.ImageBackground`
  flex: 1;
`;

const BannerContainer = styled.View`
  align-items: center;
`;

const HeadingText = styled(Text)`
  margin-bottom: ${scaleHeight(15)};
`;
const ContentContainer = styled.View`
  align-items: center;
  justify-content: center;
  width:${scale(220)}
`;
const SubContentContainer = styled.View`
  align-items: center;
  justify-content: center;
  width:${scale(220)};
  margin-top: ${scale(20)}
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
const ButtonContainer = styled(SimpleButton)`
`;



const PlayHistory = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [data, setData] = useState(null);
  const { displayRequestError } = useContext(PopupContext);
  const { playMusic, pauseBackgroundMusic } = useContext(BackgroundMusicContext);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [videoInfo, setVideoInfo] = useState({});
  const [showVideoAlert, setShowVideoAlert] = useState(false);
  const [videoUriInvalid, setVideoUriInvalid] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10
  const [lazyLoad, setLazyLoad] = useState(false);
  const [footerLoader, setfooterLoader] = useState(false);



  const navigateToHelp = () => {
    setShowVideoAlert(false);
    const { navigate } = navigation;
    navigate(SCREENS.APP_WEB_VIEW, { url: URLS.HELP, title: landingStrings.helpAndContact });
  };


  const fetchPlayerHistoryData = async () => {
    try {

      const res = await api.getPlayerHistory(pageNumber, pageSize);
      if (res.status === 200 && res.data) {

        if (data) {
          // if item is showing less than 10 on screen
          // means there is not other item
          // because page size is 10
          if (res.data.length < 10) {
            setLazyLoad(false)
            setfooterLoader(false)
          }
          else {
            setData([...data, ...res.data])
            setfooterLoader(false)

          }
        }
        if (!data) {
          setData(res.data);
          setLazyLoad(true)
          if (res.data.length === 0) {
            setShowAlert(true);
            setLazyLoad(false)
          }
          // if item is showing less than 10 on screen
          // means there is not other item
          // because page size is 10
          if (res.data.length < 10) {
            setLazyLoad(false)
          }
        }
      } else {
        setLazyLoad(false)
      }
    } catch (error) {
      displayRequestError(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPlayerHistoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);



  const renderHistoryCard = useCallback(({ item }) => {
    const { startDate, isWon, prize, gameRoundId, tokensCost, replayUrl, machineId, isReported } = item;
    const date = getDisplayDate(startDate);
    const time = getDisplayTime(startDate);

    if (prize) {
      const { name, imageUrl } = prize;
      return (
        <PlayHistoryCard
          isWon={isWon}
          imageUrl={imageUrl}
          tokensCost={tokensCost}
          prizeName={name}
          gamePlayDate={date}
          gamePlayTime={time}
          gameRoundId={gameRoundId}
          videoUri={replayUrl}
          machineId={machineId}
          setShowVideoAlert={setShowVideoAlert}
          setVideoInfo={setVideoInfo}
          setIsVideoModalVisible={setIsVideoModalVisible}
          isReported={isReported}
        />
      );
    }
    return null;
  }, []);

  const renderHeader = useCallback(() => (
    <BannerContainer>
      <Banner
        label={playHistoryStrings.playHistory}
        bannerType={BANNER_TYPE.BLUE_BANNER}
        width={getWindowWidth() - scale(32)}
        textSize={SIZE.BANNER_LARGE}
      />
    </BannerContainer>
  ), []);

  const KeyExtractor = useCallback((item) => `${item.gameRoundId}`, []);

  const navigateToScreen = screen => {
    const { navigate } = navigation;
    setShowAlert(false);
    navigate(screen);
  };

  const footerBottonOnPress = () => {
    setfooterLoader(true)
    setPageNumber(pageNumber + 1)
  }


  return (
    <>
      <Background source={CenterCircleBackGround} resizeMode="stretch">
        <PopUpWrapper>
          <SafeAreaContainer>
            <NavigationEvents onWillFocus={fetchPlayerHistoryData} />
            {data && (
              <FlatList
                ListHeaderComponent={renderHeader}
                data={data}
                ListFooterComponent={lazyLoad &&
                  <LazzyLoadButton
                    onPress={() => footerBottonOnPress()}
                    loading={footerLoader}
                  />
                }
                renderItem={renderHistoryCard}
                keyExtractor={KeyExtractor}
                contentContainerStyle={flatListStyles.containerStyle}
                initialNumToRender={4}
                onEndReachedThreshold={0.5}

              />
            )}
            <LoadingSpinner isLoading={isLoading} />
            <InstructionPopUp
              buttonText={popUpStrings.goToGameRoom}
              bannerLabel={popUpStrings.noPlayHistory}
              backdropText={popUpStrings.noPlayHistoryMessage}
              icon={medalClock}
              isVisible={showAlert}
              onPress={() => navigateToScreen(SCREENS.GAME_ROOM)}
              secondaryButtonOnPress={() => navigateToScreen(SCREENS.ACCOUNT_PROFILE)}
              testID="empty-history-popup"
            />
            <VideoModal
              isVisible={isVideoModalVisible}
              setVisible={setIsVideoModalVisible}
              videoInfo={videoInfo}
              onModalHide={() => {
                if (videoUriInvalid === true) setShowVideoAlert(true);
                playMusic(SOUNDS.LOBBY_BACKGROUND_MUSIC);
              }}
              onModalShow={() => pauseBackgroundMusic()}
              videoOnError={() => {
                setVideoUriInvalid(true);
                setIsVideoModalVisible(false);
              }}
            />
            <BottomNavigator navigation={navigation}
              setLoader={() => { setIsLoading(true) }}
              dismissLoader={() => { setIsLoading(false) }}
            />
          </SafeAreaContainer>

        </PopUpWrapper>

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
            onPress={()=>{
              setShowVideoAlert(false);
            }}>
            <ButtonContentContainer>
              <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.darkNavyBlue} size={SIZE.SMALL}>
                {popUpStrings.goBack}
              </ButtonText>
            </ButtonContentContainer>
          </ButtonContainer>
          <TextButtonWrapper color={color.white} isUnderlined={true} label={popUpStrings.contactSupport.toLowerCase()} onPress={navigateToHelp}/>
        </StampPopUp>
      </Background>
    </>
  );
};

PlayHistory.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};

export default PlayHistory;
