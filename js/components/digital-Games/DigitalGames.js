import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { FlatList, Platform, View } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { flatListStyles, color } from '../../styles';
import { coin } from '../../../assets/images';
import BottomNavigator from '../game-room/BottomBar';
import { gameRoomStrings } from '../../stringConstants';
import Banner, { BANNER_TYPE } from '../common/Banner';
import { scale, scaleHeight, getWindowWidth, heightRatio } from '../../platformUtils';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import { SCREENS, GAME_TYPES } from '../../constants';
import { PopupContext } from "../../context/Popup.context";
import api from '../../api';
import LoadingSpinner from '../common/LoadingSpinner';
import { getTokens } from '../../utils/keychainUtils';
import RNFastImage from '../common/RNFastImage';
import TextButton from '../common/TextButton';
import { UserContext } from '../../context/User.context';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
const cardWidth = (getWindowWidth() - 3 * scale(16)) / 2;
const cardHeight = (cardWidth * 320) / 250
const prizeIconHeight = cardHeight * 0.7;
const screenWidth = getWindowWidth();

const BannerWrapper = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: ${scaleHeight(13)};
`;

const Container = styled.View`
  border-radius: ${scale(7)};
  margin-top: ${scale(12)};
  height:${cardHeight};
  width: ${cardWidth};
  border-width:${scale(10)};
  border-color:${color.white};
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

const ContentCotainer = styled.TouchableOpacity`
  background-color: ${color.white};
  height:${cardHeight - 15};
  align-self:center;
  width: ${cardWidth - 15};
  `;

const MissingImageView = styled.View`
  background-color: ${color.darkGrey};
  border-top-left-radius: ${scale(8)};
  border-top-right-radius: ${scale(8)};
  height: ${prizeIconHeight};
  width: ${cardWidth};
`;

const TokenCostContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: ${color.white};
    position:absolute;
    bottom:${scale(-2)};
    right:${scale(-2)};
    border-top-left-radius:${scale(10)}
    padding-vertical: ${scale(7)}
    padding-horizontal: ${scale(4)}

`;
const TokenCostImage = styled.Image`
width:${scale(20)}
height:${scale(20)}
align-self:center;
`
const TokenText = styled(Text)`
  width:${scale(45)}
  text-align: center;
`;

const DayText = styled(Text)`
  text-align: center;
  top: -4
`;

const LogoutContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: ${scaleHeight(10)};
  width: 100%;
`;


const DigitalGames = ({ navigation }) => {
    const { displayRequestError } = useContext(PopupContext);
    const { navigate } = navigation;
    const [isLoading, setIsLoading] = useState(false);
    const [digitalGames, setDigitalGame] = useState([]);
    const {
        logout,
        isUserLoggedIn,
        setLiveArcade
    } = useContext(UserContext);

    useEffect(() => {
        const getGames = async () => {
            const livearcade = await setLiveArcade()
            getDigitalGame(livearcade);
        }
        getGames();
    }, [])


    const handleLogout = async () => {
        await logout();
    };

    const renderLogOutButton = () => {
        const version = DeviceInfo.getVersion();
        return (
            <LogoutContainer>
                <TextButton label={gameRoomStrings.logOut} onPress={() => handleLogout()} />
                <Text size={SIZE.XXSMALL}>{`v${version}`}</Text>
            </LogoutContainer>
        );
    };

    const getDigitalGame = async (arcade = false) => {
        setIsLoading(true)
        try {
            const res = await api.getDigitalGame(arcade);
            const triviaRes = await api.getUpcomingTrivia();
            const { data } = triviaRes?.data;
            if (res.status === 200 && res.data) {
                data ?
                  setDigitalGame([...digitalGames, { ...data, gameType: "Live Trivia" }, ...res.data.data]) : 
                  setDigitalGame([...digitalGames, ...res.data.data])
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            displayRequestError(error.message);
        }
    }
    const onPress = async (item, index) => {
        const tokens = await getTokens();
        if (item?.name === GAME_TYPES.LIVE_ARCADE) {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: SCREENS.GAME_ROOM })],
            });
            navigation.dispatch(resetAction);
        } else if (item?.gameType === GAME_TYPES.LIVE_HOSTED) {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: SCREENS.LIVE_HOSTED,  params: { item } })],
            });
            item?.isSchedule && navigation.dispatch(resetAction);
        } else {
            setTimeout(() => {
                navigate(SCREENS.DIGITAL_GAME_PLAY, { item, tokens });
            }, 500);
        }
    };

    const renderGameCard = useCallback(({ item, index }) => {
        return (
            <Container>
                <ContentCotainer onPress={() => onPress(item, index)}>
                    {item?.imageUrl || item?.triviaImage ? (
                        <RNFastImage style={{
                            borderRadius: scale(10),
                            height: '100%',
                            width: '100%',
                            alignSelf: 'center'
                        }} imageUrl={item?.imageUrl || item?.triviaImage} resizeMode="cover" />
                    ) : <MissingImageView />}
                    {(item?.name === GAME_TYPES.LIVE_ARCADE || item?.gameType === GAME_TYPES.LIVE_HOSTED) ? null :
                        <TokenCostContainer>
                            <TokenCostImage source={coin} resizeMode='contain' />
                            <View style={{ marginTop: scale(7) }}>
                                <TokenText
                                    size={SIZE.LARGE}
                                    color={color.black}
                                    fontFamily={FONT_FAMILY.BOLD}
                                    marginTop={Platform.OS === "android" ? 0 : 5}
                                >
                                    {item?.tokensCost}
                                </TokenText>
                                <DayText
                                    size={SIZE.XXXXSMALL}
                                    color={color.black}
                                    fontFamily={FONT_FAMILY.BOLD}
                                >
                                    a day
                                </DayText>
                            </View>
                        </TokenCostContainer>}
                </ContentCotainer>
            </Container>
        )
    }, []);

    const KeyExtractor = useCallback((item) => item?.digitalGameId || item?.triviaId, []);
    return (
        <>
            <BannerWrapper>
                <Banner
                    label={gameRoomStrings.gameRoom}
                    width={screenWidth - scale(20)}
                    bannerType={BANNER_TYPE.BLUE_BANNER}
                    textSize={SIZE.BANNER_LARGE}
                />
            </BannerWrapper>
            <FlatList
                data={digitalGames}
                renderItem={renderGameCard}
                keyExtractor={KeyExtractor}
                windowSize={2 * 8}
                maxToRenderPerBatch={5}
                numColumns={2}
                columnWrapperStyle={flatListStyles.columnStyle}
                contentContainerStyle={flatListStyles.containerStyle}
                initialNumToRender={4}
            />
            <LoadingSpinner isLoading={isLoading} />
            <BottomNavigator navigation={navigation}
                showLogout={true}
                setLoader={() => { setIsLoading(true) }}
                dismissLoader={() => { setIsLoading(false) }} />
            {Config.LOG_OUT_ENABLED === 'true' && isUserLoggedIn && renderLogOutButton()}
        </>
    )
};

export default DigitalGames;