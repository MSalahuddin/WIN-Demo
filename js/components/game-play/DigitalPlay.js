import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import { hasNotch } from 'react-native-device-info';
import styled from 'styled-components/native';
import { NavigationEvents } from 'react-navigation';
import { IronSource, IronSourceInterstitials, IronSourceBanner } from '@wowmaking/react-native-iron-source';
import { ScatteredCircleBackGround, ticket, medalCoin } from '../../../assets/images';
import BottomNavigator from '../game-room/BottomBar';
import { scaleHeight } from '../../platformUtils';
import { UserContext } from "../../context/User.context";
import CoinsAnimations from '../common/CoinsAnimations';
import BouncingAnimation from "../common/BouncingAnimation";
import { SCREENS, ANALYTICS_PROPERTIES, ANALYTICS_EVENTS, ANALYTICS_APPSFLYER_EVENTS, ANALYTICS_APPSFLYER_EVENTS_PARAMETER } from '../../constants';
import InstructionPopUp from '../common/InstructionPopUp';
import { popUpStrings } from '../../stringConstants';
import { getAppInitKeys } from '../../iron-source-setting';
import api from '../../api';
import { logEvent } from '../../amplitudeUtils';
import { AFLogCustomEvent } from "../../appFlyer.utils";
const Background = styled.ImageBackground`
height: 100%;
width: 100%;
`;
const SafeAreaContainer = styled.SafeAreaView`
  margin-top: ${hasNotch() ? scaleHeight(88) : scaleHeight(68)};
  flex:1;
`;
const DigitalGamePlay = ({ navigation }) => {
    const { item } = navigation.state.params;
    const [isAnimated, setIsAnimated] = useState(false);
    const [rewardValue, setRewardValue] = useState(null);
    const [isGameActive, setIsGameActive] = useState(true);
    const [isOutOfTokenPopUpShown, setIsOutOfTokenPopUpShown] = useState(false);
    const { digitalGameId, url, rewardBasedOn } = item;
    const { fetchPoints, playerId, isDigitalGameAdBlock } = useContext(UserContext);
    const [gameUrl, setGameUrl] = useState(null);
    const navigateToTokenStore = (screenName) => {
        setIsOutOfTokenPopUpShown(false);
        setIsGameActive(false);
        navigation.navigate(screenName);
    };
    const onCloseInterstitialAd = () => {
        IronSourceInterstitials.removeAllListeners();
    }
    const showInterstitial = async () => {
        await IronSourceInterstitials.loadInterstitial();
        IronSourceInterstitials.addEventListener('interstitialDidFailToShowWithError', onCloseInterstitialAd)
        IronSourceInterstitials.addEventListener('interstitialDidFailToLoadWithError', onCloseInterstitialAd)
        IronSourceInterstitials.addEventListener('interstitialDidClose', onCloseInterstitialAd)
        IronSourceInterstitials.addEventListener('interstitialDidLoad', () => {
            IronSourceInterstitials.showInterstitial();
        });
    };
    const showBannerAds = async () => {
        IronSourceBanner.loadBanner('BANNER', {
            position: 'bottom',
            scaleToFitWidth: true,
        });
        IronSourceBanner.addEventListener('ironSourceBannerDidLoad', () => {
            IronSourceBanner.showBanner();
        });
    }
    const ironSourceHandler = async () => {
        try {
            const { appKey } = await getAppInitKeys()
            IronSource.setConsent(true);
            await IronSource.initializeIronSource(appKey, playerId, { validateIntegration: true });
            !!!isDigitalGameAdBlock &&  showBannerAds();
        } catch (error) {
        }
    };

    const logAnalyticEvents = ({ isWon, reward, level }) => {
        logEvent(ANALYTICS_EVENTS.DIGITAL_GAME, {
            [ANALYTICS_PROPERTIES.GAME_NAME]: item?.name,
            [ANALYTICS_PROPERTIES.LEVEL_PASS]: isWon,
            [ANALYTICS_PROPERTIES.LEVEL]: level,
            [ANALYTICS_PROPERTIES.TICKET_REWARD]: reward,
        });
        AFLogCustomEvent(ANALYTICS_APPSFLYER_EVENTS.DIGITAL_GAME, {
            [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.DIGITAL_GAME.GAME_NAME]: item?.name,
            [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.DIGITAL_GAME.LEVEL_PASS]: isWon,
            [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.DIGITAL_GAME.LEVEL]: level,
            [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.DIGITAL_GAME.TICKET_REWARD]: reward,
          });
    };

    const onWebViewMessage = async (event) => {
        const eventData = JSON.parse(event.nativeEvent.data);
        if (eventData?.gameStatus === 2 && !eventData?.success) {
            !!!isDigitalGameAdBlock && showInterstitial();
            eventData?.level && logAnalyticEvents({ isWon: eventData?.success, reward: eventData?.reward, level: eventData?.level });
        }
        if (eventData?.gameStatus === 2 && eventData?.success) {
            setRewardValue(eventData?.reward);
            setIsAnimated(true);
            logAnalyticEvents({ isWon: eventData?.success, reward: eventData?.reward, level: eventData?.level });
            setTimeout(() => {
                !!!isDigitalGameAdBlock && showInterstitial();
            }, 2000);
        }
        if (eventData?.gameStatus === 1 && !eventData?.success && eventData?.message) {
            setIsOutOfTokenPopUpShown(true)
        }

        setTimeout(() => {
            fetchPoints();
        }, 2000);
    };

    useEffect(() => {
        ironSourceHandler();
        getGatewayToken();
        return () => {
            cleanUpListners();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getGatewayToken = async () => {
        try {
            const response = await api.getDigitalGameGateway();
            if (response.status === 200 && response.data) {
                const { data } = response;
                const gameURL = `${url}?data_Token=${data?.data}&gameId=${digitalGameId}&rewardBasedOn=${rewardBasedOn}`
                setGameUrl(gameURL);
            }
        } catch (error) {
            displayRequestError(error?.message);
        }
    }

    const cleanUpListners = () => {
        IronSourceBanner.hideBanner();
        IronSourceBanner.removeAllListeners();
    };

    return (
        <Background source={ScatteredCircleBackGround} resizeMode="stretch">
            <NavigationEvents onWillBlur={() => cleanUpListners()} />
            <SafeAreaContainer>
                {(isGameActive && gameUrl) && <WebView
                    source={{
                        uri: gameUrl
                    }}
                    testID="web-view"
                    onMessage={onWebViewMessage}
                    useWebKit
                />}
                <BottomNavigator navigation={navigation} setLoader={() => { }} dismissLoader={() => { }} />
                {isAnimated && <BouncingAnimation value={rewardValue} />}
                {isAnimated && <CoinsAnimations
                    onCompleted={() => setIsAnimated(false)}
                    counts={25}
                    imageSource={ticket}
                />}
            </SafeAreaContainer>
            <InstructionPopUp
                isVisible={isOutOfTokenPopUpShown}
                backdropText={popUpStrings.buyTokenToContinuePlay}
                buttonText={popUpStrings.goToStore}
                bannerLabel={popUpStrings.outOfToken}
                icon={medalCoin}
                secondaryButtonOnPress={() => navigateToTokenStore(SCREENS.GAME_ROOM)}
                onPress={() => navigateToTokenStore(SCREENS.GAME_CARD_RELOAD)}
            />
        </Background>
    )
}
DigitalGamePlay.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
        state: PropTypes.shape({
            params: PropTypes.shape({
                item: PropTypes.shape(),
                tokens: PropTypes.shape(),
            })
        })
    }).isRequired
};
export default DigitalGamePlay;