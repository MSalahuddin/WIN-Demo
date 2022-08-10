/* eslint-disable no-use-before-define */
import React, { memo, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Animated, FlatList, Linking, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Config from 'react-native-config';
import styled from 'styled-components/native';
import DeviceInfo from 'react-native-device-info';
import { logEvent } from '../../amplitudeUtils';
import PriceCardModal from './PriceCardModal';
import PromoCard from '../common/PromoCard';
import GameCard from './GameCard';
import MachineCard from './MachineCard';
import TextButton from '../common/TextButton';
import Tabs from './Tabs';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../api';
import InstructionPopUp from '../common/InstructionPopUp';
import InstructionPopUpDark from '../common/InstructionPopupdark';
import PrizePopUp from '../common/PrizePopUp';
import NotificationsPopUp from '../common/NotificationsPopUp';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import VideoModal from '../play-history/VideoModal';
import  { BANNER_TYPE } from '../common/Banner';
import { UserContext } from '../../context/User.context';
import { PopupContext } from '../../context/Popup.context';
import {
    sadChicken,
    dailyBonusCoin,
    BgImagePiggyBank,
    medalError,
    ExitCircle,
    howtoBackgroundPopUp,
    unavailable,
} from '../../../assets/images';

import { getWindowWidth, scale, scaleHeight, scaleWidth } from '../../platformUtils';
import { commonStrings, gameRoomStrings, popUpStrings, landingStrings } from '../../stringConstants';
import BottomNavigator from './BottomBar';
import {
    SCREENS,
    ANALYTICS_PROPERTIES,
    ANALYTICS_EVENTS,
    WW_BANNER_API_LOCATIONS,
    OPEN_PROMO_LOCATIONS,
    ERROR_STATUS_CODE,
    URLS,
    BLUSHIFT_EVENT,
    BLUESHIFT_ANALYTICS_PROPERTIES
} from '../../constants';
import { flatListStyles, color } from '../../styles';
import { insertPromoCard } from '../../utils';
import TopSearchBar from './TopBarSearch';
import TopRankingBar from './RankingBar'

import { hasNotch } from 'react-native-device-info';
import ViewPager from '@react-native-community/viewpager';
import WatchAd from '../watch-ads/WatchAd';
import LazzyLoadButton from '../common/LazzyLoadButton';
import StampPopUp from '../common/StampPopUp';
import SimpleButton from '../common/SimpleButton';
import { logBlushiftEvent } from '../../blushiftutils';


const STORE_SECTION = [gameRoomStrings.machines, gameRoomStrings.prizes];

const bannerWidth = getWindowWidth() - scale(50);

const StyledText = styled(Text)`
  margin-horizontal: ${scaleWidth(10)};
  margin-vertical: ${scaleHeight(10)};
`;

const LogoutContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: ${scaleHeight(10)};
  width: 100%;
`;

const PromoPopUpView = styled.View`
align-items: center;
justify-content: center;
padding-horizontal: ${scale(5)};
margin-top:${scaleHeight(-60)}
`;

const TextWrapper = styled(Text)`
  margin-top: ${({ marginTop }) => (marginTop ? scaleHeight(marginTop) : 0)};
`;
const TabsView = styled.View`
  background-color: ${color.fadeBlue};
  border-bottom-left-radius: ${scaleHeight(25)};
  border-bottom-right-radius: ${scaleHeight(25)};
  flex-direction: row;
  margin-horizontal: ${Platform.OS === 'android' ? scale(16) : scale(10)};
  padding-top: ${scale(6)};
  padding-bottom: ${scale(6)};
  margin-bottom: ${scale(10)};
`;

const StyledViewPager = styled(ViewPager)`
  flex: 1;
  margin-top: ${hasNotch() ? scaleHeight(8) : scaleHeight(0)};
`;

const PageView = styled.View`
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

const Games = ({ navigation }) => {
    const { navigate } = navigation;
    const initialPage = 1;
    const PAGE_SIZE = 10;
    const pageRef = useRef(null);
    const {
        logout,
        isUserLoggedIn,
        setGeoRestrictedStatusCode,
        shouldRefreshGameRoom,
        playerId,
        countryId,
    } = useContext(UserContext);

    const [machines, setMachines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDisableFavorite, setIsDisableFavorite] = useState(false);
    const [isnoDataFound, setIsnoDataFound] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [isPromoCardVisible, setIsPromoCardVisible] = useState(false);
    const { displayRequestError } = useContext(PopupContext);
    const { setIsBecomeVipPopUpShown } = useContext(PopupContext);
    const [isPrizeModalVisible, setIsPrizeModalVisible] = useState(false);
    const [isPrizePopupVisible, setIsPrizePopupVisible] = useState(false);
    const [prizeModalData, setPrizeModalData] = useState(null);
    const [gameRoomPromoData, setGameRoomPromoData] = useState([]);
    const [isPromoPopUpVisible, setIsPromoPopUpVisible] = useState(false);
    const [promoIndex, setPromoIndex] = useState(0);
    const promoBannerOpacity = new Animated.Value(1);
    const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
    const [videoInfo, setVideoInfo] = useState({});
    const [showVideoAlert, setShowVideoAlert] = useState(false);
    const [videoUriInvalid, setVideoUriInvalid] = useState(false);
    const [playLastWin, setPlayLastWin] = useState(false);
    const [showPlayLastWinVideoAlert, setshowPlayLastWinVideoAlertVideoAlert] = useState(false);
    const [favoriteStatus, setFavoriteStatus] = useState(false);
    const [openRankingBar, setOpenRankingBar] = useState(false);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(initialPage);
    const [machinesData, setMachinesData] = useState([]);
    const [machinePrizeData, setMachinePrizeData] = useState([]);
    const [verticalAd, setVerticalAd] = useState(null)
    const [prizesPageNumber, setPrizesPageNumber] = useState(1);
    const [prizesHasNextPage, setPrizesHasNextPage] = useState(false);
    const [prizesFooterLoader, setPrizesFooterLoader] = useState(false);
    const [machinesPageNumber, setMachinesPageNumber] = useState(1);
    const [machinesHasNextPage, setMachinesHasNextPage] = useState(false);
    const [machinesFooterLoader, setMachinesFooterLoader] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [fetchDifficulty, setFetchDifficulty] = useState(false);


    useEffect(() => {
        if (showPlayLastWinVideoAlert) {
            setTimeout(() => {
                setShowVideoAlert(true)
            }, 1000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showPlayLastWinVideoAlert])


    useEffect(() => {
        if (playLastWin) {
            setTimeout(() => {
                setIsVideoModalVisible(true)
            }, 3000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playLastWin])

    useEffect(() => {
        if (shouldRefreshGameRoom) {
            setSelectedFilter(0);
            setSelectedCategory('');
            fetchData(true)
            setMachinesData([]);
        }
        if(currentSectionIndex===0){
            fetchMachineData(true)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldRefreshGameRoom]);


    useEffect(() => {
        // eslint-disable-next-line no-use-before-define
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (pageRef?.current) {
            pageRef?.current?.setPage(initialPage);
        }
    }, [initialPage]);

    useEffect(() => {
        if(prizesPageNumber > 1) {
            const data = navigation.state.params?.data;
            const params = (fetchDifficulty && data) ? data : null
            fetchMachines(gameRoomPromoData, verticalAd, {
                ...params,
                filter: selectedCategory,
                pageNumber: prizesPageNumber,
                pageSize: PAGE_SIZE
            }, false);
        }
    }, [prizesPageNumber, selectedCategory, fetchDifficulty]);

    useEffect(() => {
        if(machinesPageNumber > 1) {
            getMachines(fetchDifficulty, null, {pageNumber: machinesPageNumber, pageSize: PAGE_SIZE}, false);
        }
    }, [machinesPageNumber, fetchDifficulty]);

    const handleArrowPress = async  index => {
        if(index === 0){
            await fetchMachineData(true)
        }
        setCurrentSectionIndex(index);
        if (pageRef) {
            setTimeout(() => {
                pageRef?.current?.setPage(index);
            }, 100);
        }
    };

    const navigateToHelp = () => {
        setIsPrizeModalVisible(false);
        setShowVideoAlert(false);
        setshowPlayLastWinVideoAlertVideoAlert(false)
        navigate(SCREENS.APP_WEB_VIEW, { url: URLS.HELP, title: landingStrings.helpAndContact });
    };

    const fetchMachines = async (gameRoomPromo, watchAdPromo, params, clearPreviousData) => {
        try {
            const result = await api.getGameRoomData(params);
            if (result.status === 200 && result.data) {
                const xPagination = result?.headers['x-pagination'] && JSON.parse(result?.headers['x-pagination']);
                setPrizesHasNextPage(xPagination?.HasNextPage);
                // Store Review Suppress Feature hot Fix temporary in Win-69 will be fixed properly later
                // This has been block if statement by -2 and will be fixed in win-69
                let machineData = result.data;
                if (gameRoomPromo || watchAdPromo) {
                    machineData = insertPromoCard(
                        gameRoomPromo.length > 0 ? { isPromoCard: gameRoomPromo } : null,
                        watchAdPromo || null,
                        machineData
                    );
                    setIsPromoCardVisible(gameRoomPromo.length ? true : false);
                }
                if (!machineData.length) {
                    currentSectionIndex === 1 && setIsnoDataFound(true)
                }
                if(clearPreviousData) setMachines([]);
                setMachines(oldMachines => [...oldMachines, ...machineData]);
            }
            setPrizesFooterLoader(false);
            setIsLoading(false);
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (
                    status === ERROR_STATUS_CODE.USER_LOCATION_RESTRICTED ||
                    status === ERROR_STATUS_CODE.USER_LOCATION_UNDETERMINED
                ) {
                    setGeoRestrictedStatusCode(status);
                } else {
                    displayRequestError(data);
                }
            } else {
                displayRequestError(error.message);
            }
        }
        setIsLoading(false);
    };

    const getMachines = async (isFetchDifficulty, keyword, pagination, clearPreviousData) => {
        const data = navigation.state.params?.data;
        let params = (isFetchDifficulty && data) ? data : {}
        let searchParams = (keyword && keyword.length > 0) ? { search: keyword } : null
        try {
            const result = await api.getMachines(searchParams ? {...searchParams, ...pagination} : {...params, ...pagination});
            if (result.status === 200 && result.data) {
                const xPagination = result?.headers['x-pagination'] && JSON.parse(result?.headers['x-pagination']);
                setMachinesHasNextPage(xPagination?.HasNextPage);
                // Store Review Suppress Feature hot Fix temporary in Win-69 will be fixed properly later
                // This has been block if statement by -2 and will be fixed in win-69
                let machineData =  result?.data?.data ? result?.data?.data : [];
                if (!machineData?.length) {
                    currentSectionIndex === 0 && setIsnoDataFound(true)
                }
                if(clearPreviousData) setMachinesData([]);
                setMachinesData(oldMachines => [...oldMachines, ...machineData]);
            }
            setMachinesFooterLoader(false);
            setIsLoading(false);
        } catch (error) {
            if (error.response) {
                //     const { status, data } = error.response;
                //     if (
                //         status === ERROR_STATUS_CODE.USER_LOCATION_RESTRICTED ||
                //         status === ERROR_STATUS_CODE.USER_LOCATION_UNDETERMINED
                //     ) {
                //         setGeoRestrictedStatusCode(status);
                //     } else {
                //         displayRequestError(data);
                //     }
                // } else {
                displayRequestError(error.message);
            }
        }
        setIsLoading(false);
    };

    const renderPromoContent = () => {
        if (!gameRoomPromoData) {
            return null;
        }
        return (

            <PromoPopUpView>
                <Text fontFamily={FONT_FAMILY.BOLD} alignCenter size={SIZE.LARGEST} color={color.white}>
                    {gameRoomPromoData[promoIndex]?.title}
                </Text>
                <TextWrapper marginTop="12" alignCenter fontFamily={FONT_FAMILY.BOLD} size={SIZE.SMALL} color={color.white}>
                    {gameRoomPromoData[promoIndex]?.body}
                </TextWrapper>
            </PromoPopUpView>
        );
    };
    const filterMachines = async (params, index) => {
        setSelectedFilter(index)
        try {
            const result = await api.getGameRoomData(params);
            if (result.status === 200 && result.data) {
                const xPagination = result?.headers['x-pagination'] && JSON.parse(result?.headers['x-pagination']);
                setPrizesHasNextPage(xPagination?.HasNextPage);
                // Store Review Suppress Feature hot Fix temporary in Win-69 will be fixed properly later
                // This has been block if statement by -2 and will be fixed in win-69
                const machineData = result.data;
                // if (gameRoomPromo) {
                //   machineData = insertPromoCard(gameRoomPromo, machineData);
                //   setIsPromoCardVisible(true);
                // }
                if (!machineData.length) {
                    setIsnoDataFound(true)
                }
                setMachines(null);
                // previous data null
                setMachines(machineData);
            }
            setIsLoading(false);
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (
                    status === ERROR_STATUS_CODE.USER_LOCATION_RESTRICTED ||
                    status === ERROR_STATUS_CODE.USER_LOCATION_UNDETERMINED
                ) {
                    setGeoRestrictedStatusCode(status);
                } else {
                    displayRequestError(data);
                }
            } else {
                displayRequestError(error.message);
            }
        }
        setIsLoading(false);
    };

    const onPromoCardPress = () => {
        Animated.timing(promoBannerOpacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
        }).start(() => (setIsPromoCardVisible(false)));
    };

    const openPromoInfo = location => {
        const eventProps = {
            [ANALYTICS_PROPERTIES.PROMO_LOCATION]: location,
            [ANALYTICS_PROPERTIES.PROMO_ID]: gameRoomPromoData[promoIndex].bannerId
        };
        const BSEventProps = {
            [BLUESHIFT_ANALYTICS_PROPERTIES.BANNER_ID]: gameRoomPromoData[promoIndex].bannerId,
            [BLUESHIFT_ANALYTICS_PROPERTIES.BANNER_TITLE]: gameRoomPromoData[promoIndex].title,
            ...(gameRoomPromoData[promoIndex].hyperLink !== '' && { [BLUESHIFT_ANALYTICS_PROPERTIES.BANNER_HYPERLINK]: gameRoomPromoData[promoIndex].hyperLink })
        }
        logBlushiftEvent(BLUSHIFT_EVENT.BANNER_CLICK, BSEventProps)
        logEvent(ANALYTICS_EVENTS.OPENED_PROMO, eventProps);
        setIsPromoPopUpVisible(true);
    };

    const getFavorites = async () => {
        try {
            const res = await api.getPlayerFavoritePrizes(playerId);
            setPrizesHasNextPage(false);
            setMachines(res.data)
            if (!res.data.length) {
                setIsnoDataFound(true)
            }
            setIsLoading(false);
        } catch (error) {
            // throw error silently
        }
    }
    const searchCategories = async keyword => {
        setSelectedCategory(keyword);
        setIsLoading(true);
        if (keyword === gameRoomStrings.myFavoritePrize) {
            setFavoriteStatus(true)
            getFavorites()
        } else {
            setFavoriteStatus(false)

            // setSelectedFilter(index)
            const {gameRoomPromo, watchAdPromo} = await fetchBannerInfo();
            setPrizesPageNumber(1);
            setFetchDifficulty(false);
            await fetchMachines(gameRoomPromo, watchAdPromo, { filter: keyword, pageNumber: 1, pageSize: PAGE_SIZE }, true);
            setIsLoading(false);
        }

    }


    const searchMachines = async keyword => {
        setIsLoading(true);
        try {
            setMachinesPageNumber(1)
            await getMachines(false, keyword, { pageNumber: 1, pageSize: PAGE_SIZE }, true);
            setIsLoading(false);
        } catch (error) {

        }

    }


    const SelectCategories = async (keyword, index) => {
        setIsLoading(true);

        if (keyword === gameRoomStrings.myFavoritePrize) {
            setFavoriteStatus(true)
            setSelectedFilter(index);
            getFavorites()
        } else {
            setFavoriteStatus(false)

            // const gameRoomPromo = await fetchBannerInfo();
            setPrizesPageNumber(1);
            setFetchDifficulty(false);
            await filterMachines({ filter: keyword, pageNumber: 1, pageSize: PAGE_SIZE }, index);
            setIsLoading(false);
        }
    }

    const renderHeader =useCallback(() => {
        return (
            <>
                {isPromoCardVisible &&
                    <Animated.View style={{ opacity: promoBannerOpacity }}>
                        <PromoCard
                            isClosable
                            data={gameRoomPromoData}
                            onClose={onPromoCardPress}
                            onPress={(i) => {
                                setPromoIndex(i)
                                openPromoInfo(OPEN_PROMO_LOCATIONS.GAME_ROOM_HEADER)
                            }}
                        />
                    </Animated.View>
                }
                <NotificationsPopUp />
            </>
        );

    },[isPromoCardVisible]);
    const KeyExtractorPrizes = useCallback((item)=>String(item.uniqueMachinePrizeId),[]);
    const KeyExtractorMachines = useCallback((item,index)=>String(index),[]);
    const renderTopSearch = () => {
        return <TopSearchBar
            shouldRefreshGameRoom={shouldRefreshGameRoom}
            onSelect={(item, index) => {
                currentSectionIndex === 0 && handleArrowPress(1);
                setSelectedCategory(item);
                SelectCategories(item, index);
            }}
            categoryIndex={selectedFilter}
            onSearch={item => {
                currentSectionIndex === 1 ? searchCategories(item) : searchMachines(item)
            }}
            onExploreTap={() => {
                navigate(SCREENS.EXPLORE_ARCADE);
            }}
            setOpenRankingBar={setOpenRankingBar}
            openRankingBar={openRankingBar}
            setCurrentSectionIndex={() => handleArrowPress(1)}
            onMachineSearchClose={() => {
                setMachinesPageNumber(1);
                getMachines(false, null, {pageNumber: 1, pageSize: PAGE_SIZE}, true);
            }}
        />

    };
    // eslint-disable-next-line consistent-return
    const fetchBannerInfo = async () => {
        try {
            const result = await api.getBannerData(WW_BANNER_API_LOCATIONS.GAME_ROOM);
            if (result.status === 200 && result.data) {
                const bannerData = result.data;
                let gameRoomPromo = null
                let watchAdPromo = null;
                if (bannerData) {
                    if (bannerData?.isActive === false) {
                        gameRoomPromo = []
                    }
                    else {
                        gameRoomPromo = bannerData.filter(el => !el?.isVideoAdvertisement)
                        watchAdPromo = bannerData.find(el => el?.isVideoAdvertisement)
                    }
                }
                // eslint-disable-next-line no-nested-ternary
                setGameRoomPromoData(gameRoomPromo);
                setVerticalAd(watchAdPromo);
                return {gameRoomPromo, watchAdPromo};
            }
        } catch (error) {
            // fail silently
        }
    };
    const showModal = async item => {
        try {
            const res = await api.getMachineDetails(item.machineId, item.prize.prizeId);
            if (res.status === 200 && res.data) {
                setPrizeModalData(res.data);
                setIsPrizeModalVisible(true);
            }
        } catch (error) {
            displayRequestError(error.message);
        }
    };
    const setFavorite = async () => {
        try {
            const duplicate = { ...prizeModalData }
            const body = {
                "playerId": playerId,
                "prizeId": prizeModalData?.prize?.prizeId,
                "machineId": prizeModalData?.machineId,
                "isLike": !prizeModalData.isLiked
            }
            if (prizeModalData?.isLiked) {
                duplicate.isLiked = false
                duplicate.likes = prizeModalData.likes - 1

                if (favoriteStatus) {
                    // getFavorites()
                    const filterMachines = machines.filter(machine => machine.prize.prizeId !== prizeModalData?.prize.prizeId)
                    setMachines(filterMachines)
                }
            } else {
                duplicate.isLiked = true
                duplicate.likes = prizeModalData.likes + 1
            }
            setPrizeModalData(duplicate)

            const res = await api.postPlayerFavoritePrize(body);
            setIsDisableFavorite(false)
            if (favoriteStatus && duplicate.isLiked) {
                getFavorites()
            }
        } catch (error) {
            setIsDisableFavorite(false)
            // throw error silently
        }
    }


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

    const gameCardButtonOnPress = (machineData, isDisabled) => {

        if (isDisabled) {
            setIsBecomeVipPopUpShown(true);
            setIsPrizeModalVisible(false);
        } else {
            setIsPrizeModalVisible(false);
            navigate(SCREENS.GAME_PLAY, { machineData });
        }
    };

    const navigateToTokenStore = () => {
        setIsBecomeVipPopUpShown(false);
        setIsPrizeModalVisible(false);
        navigate(SCREENS.GAME_CARD_RELOAD);
    };


    const onMachinePress = async (item) => {
        try {
            const res = await api.getMachinesPrizes(item?.machineId, countryId);
            if (res.status === 200 && res.data) {
                setMachinePrizeData({ item, data: res?.data?.data })
                setIsPrizePopupVisible(true)
            }
        } catch (error) {
            displayRequestError(error.message);
        }
    }


    const onMachinePrizePress = (machineData) => {
        const { isDisabled } = machineData
        if (isDisabled) {
            setIsPrizePopupVisible(false);
            setTimeout(() => {
                setIsBecomeVipPopUpShown(true);
            }, 500);
        } else {
            setIsPrizePopupVisible(false)
            setTimeout(() => {
                navigate(SCREENS.GAME_PLAY, { machineData });
            }, 500);
        }
    }

    const renderMachineCard = useCallback( (item) => {
        const { machineImage, description, isVip, machineTypes, machineDifficultyType } = item;
        return (
            <MachineCard
                machineName={description}
                isMachine={true}
                machineTypes={machineTypes}
                isGameVIP={isVip}
                imageUrl={machineImage}
                onPress={() => onMachinePress(item)}
                machineDifficultyType={machineDifficultyType}
            />
        );
    },[countryId]);



    const renderGameCard = useCallback( ({item, index}) => {
        const { isAvailable, isPromoCard, title, prize, isDisabled, isVip, isFree, tokensCost, machineTypes, machineDifficultyType, watchAd } = item;

        if (watchAd) return <WatchAd gameRoomVerticalCard={true} data={item} />
        if (isPromoCard) {
            return (
                <PromoCard
                    title={title}
                    isCard
                    data={isPromoCard}
                    onPress={(i) => {
                        setPromoIndex(i)
                        openPromoInfo(OPEN_PROMO_LOCATIONS.GAME_ROOM_LIST)
                    }}
                />


            );
        }

        return (
            <GameCard
                isFavorite={favoriteStatus}
                isPrizeAvailable={prize && prize.isAvailable}
                isMachineAvailable={isAvailable}
                prizeName={prize && prize.name}
                isFree={isFree}
                machineTypes={machineTypes}
                isDisabled={isDisabled}
                tokensCost={tokensCost}
                isGameVIP={isVip}
                imageUrl={prize && prize.imageUrl}
                onPressInfo={() => showModal(item)}
                onPress={() => gameCardButtonOnPress(item, isDisabled)}
                machineDifficultyType={machineDifficultyType}
            />
        );
    },[]);
    const fetchMachineData= async (isFetchDifficulty)=>{
        if(!machinesData.length)
            await getMachines(isFetchDifficulty, null, {pageNumber: 1, pageSize: PAGE_SIZE}, true)
    }
    const fetchData = async (isFetchDifficulty) => {
        setFetchDifficulty(isFetchDifficulty)
        setIsLoading(true);
        setPrizesPageNumber(1);
        setMachinesPageNumber(1);
        const data = navigation.state.params?.data;
        let params = (isFetchDifficulty && data) ? data : null
        const {gameRoomPromo, watchAdPromo} = await fetchBannerInfo();
        await fetchMachines(gameRoomPromo, watchAdPromo, {...params, pageNumber: 1, pageSize: PAGE_SIZE}, true);

        setIsLoading(false);

    };

    const handleClick = () => {
        Linking.canOpenURL(gameRoomPromoData[promoIndex]?.hyperLink).then(supported => {
            if (supported) {
                const BSEventProps = {
                    [BLUESHIFT_ANALYTICS_PROPERTIES.BANNER_ID]: gameRoomPromoData[promoIndex].bannerId,
                    [BLUESHIFT_ANALYTICS_PROPERTIES.BANNER_TITLE]: gameRoomPromoData[promoIndex].title,
                    [BLUESHIFT_ANALYTICS_PROPERTIES.BANNER_HYPERLINK]: gameRoomPromoData[promoIndex].hyperLink
                }
                logBlushiftEvent(BLUSHIFT_EVENT.BANNER_HYPERLINK_CLICK, BSEventProps)
                Linking.openURL(gameRoomPromoData[promoIndex]?.hyperLink);
            }
        });
    }

    const renderRankingBar = () => <TopRankingBar navigation={navigation} setOpenRankingBar={setOpenRankingBar} />

    const onPressPrizesLoadMore = () => {
        setPrizesFooterLoader(true)
        setPrizesPageNumber(prizesPageNumber + 1);
    };

    const onPressMachinesLoadMore = () => {
        setMachinesFooterLoader(true)
        setMachinesPageNumber(machinesPageNumber + 1);
    };

    return (
        <>
            {openRankingBar && renderRankingBar()}
            {renderTopSearch()}

            <TabsView>
                <Tabs
                    onPress={() => handleArrowPress(0)}
                    backdropText={STORE_SECTION[0]}
                    isSelected={currentSectionIndex === 0}
                    width={bannerWidth}
                />
                <Tabs
                    onPress={() => handleArrowPress(1)}
                    backdropText={STORE_SECTION[1]}
                    isSelected={currentSectionIndex === 1}
                    width={bannerWidth}
                />
            </TabsView>
            <StyledViewPager
                initialPage={initialPage}
                keyboardDismissMode="on-drag"
                ref={pageRef}
                onPageSelected={event => {
                    setCurrentSectionIndex(event.nativeEvent.position);
                }}
            >
                <PageView key={1}>
                    {machinesData && (
                        <FlatList
                            ListHeaderComponent={renderHeader()}
                            data={machinesData}
                            renderItem={({ item, index }) => renderMachineCard(item, index)}
                            keyExtractor={KeyExtractorMachines }
                            windowSize={2 * 8}
                            maxToRenderPerBatch={5}
                            numColumns={2}
                            columnWrapperStyle={flatListStyles.columnStyle}
                            contentContainerStyle={flatListStyles.containerStyle}
                            initialNumToRender={4}
                            removeClippedSubviews={true}
                            ListFooterComponent={
                                machinesHasNextPage ? <LazzyLoadButton onPress={() => onPressMachinesLoadMore()} loading={machinesFooterLoader} /> : null
                            }
                        />
                    )}
                </PageView>
                <PageView key={2}>
                    {machines && (
                        <FlatList
                            ListHeaderComponent={renderHeader()}
                            data={machines}
                            renderItem={renderGameCard}
                            keyExtractor={KeyExtractorPrizes}
                            windowSize={2 * 8}
                            maxToRenderPerBatch={5}
                            numColumns={2}
                            columnWrapperStyle={flatListStyles.columnStyle}
                            contentContainerStyle={flatListStyles.containerStyle}
                            initialNumToRender={4}
                            removeClippedSubviews={true}
                            ListFooterComponent={
                                prizesHasNextPage ? <LazzyLoadButton onPress={() => onPressPrizesLoadMore()} loading={prizesFooterLoader} /> : null
                            }
                        />
                    )}
                </PageView>
            </StyledViewPager>

            <PriceCardModal
                isVisible={isPrizeModalVisible}
                setVisible={setIsPrizeModalVisible}
                isDisableFavorite={isDisableFavorite}
                setIsDisableFavorite={setIsDisableFavorite}
                machineData={prizeModalData}
                onPress={() => gameCardButtonOnPress(prizeModalData, prizeModalData && prizeModalData.isDisabled)}
                navigateToTokenStore={navigateToTokenStore}
                setshowPlayLastWinVideoAlertVideoAlert={setshowPlayLastWinVideoAlertVideoAlert}
                setVideoInfo={setVideoInfo}
                setPlayLastWin={setPlayLastWin}
                setFavorite={setFavorite}
                navigate={navigate}
            />

            <PrizePopUp
                isVisible={isPrizePopupVisible}
                icon={ExitCircle}
                bannerType={BANNER_TYPE.BLUE_BANNER}
                bannerLabel={gameRoomStrings.prizes}
                secondaryButtonOnPress={() => setIsPrizePopupVisible(false)}
                prizeData={machinePrizeData}
                onPress={(item) => onMachinePrizePress(item)}
            />

            <InstructionPopUpDark
                bannerBtnText={
                    gameRoomPromoData.length &&
                        gameRoomPromoData[promoIndex]?.hyperLink ?
                        gameRoomPromoData[promoIndex]?.hyperLinkLabel :
                        popUpStrings.ok}
                bannerLabel={popUpStrings.info}
                topIcon={dailyBonusCoin}
                border
                backgroundImage={BgImagePiggyBank}
                isVisible={isPromoPopUpVisible}
                bannerOnPress={() => {
                    setIsPromoPopUpVisible(false);
                    gameRoomPromoData[promoIndex]?.hyperLink && handleClick();
                }}
                testID="create-account-popup"
                secPopupButtonText={
                    gameRoomPromoData[promoIndex]?.hyperLink && popUpStrings.takeMeBack
                }
                secPopupButtonPress={() =>
                    gameRoomPromoData[promoIndex]?.hyperLink && setIsPromoPopUpVisible(false)
                }
            >
                {renderPromoContent()}
            </InstructionPopUpDark>
            <InstructionPopUp
                isVisible={isnoDataFound}
                // eslint-disable-next-line react/jsx-boolean-value
                isLowerCase={true}
                onPress={async () => {
                    setIsLoading(true)
                    setIsnoDataFound(false);
                    setSelectedFilter(0)
                    setSelectedCategory('');
                    await fetchData();
                }}
                mascot={sadChicken}
                bannerLabel={popUpStrings.oopsWithExclaimination}
                buttonText={popUpStrings.backToGameRoom}
            >
                <StyledText size={SIZE.XSMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.grayBlack} alignCenter>
                    {currentSectionIndex === 0 ? commonStrings.noMachineData : commonStrings.noData}
                </StyledText>
            </InstructionPopUp>
            <VideoModal
                isVisible={isVideoModalVisible}
                setVisible={(visible) => {
                    setIsVideoModalVisible(visible)
                    setPlayLastWin(visible)
                }}
                videoInfo={videoInfo}
                onModalHide={() => {
                    if (videoUriInvalid === true) setShowVideoAlert(true);
                }}
                videoOnError={() => {
                    setVideoUriInvalid(true);
                    setIsVideoModalVisible(false);
                    setPlayLastWin(false)
                }}
            />
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
                        setshowPlayLastWinVideoAlertVideoAlert(false)
                    }}
                >
                    <ButtonContentContainer>
                        <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.darkNavyBlue} size={SIZE.SMALL}>
                            {popUpStrings.goBack}
                        </ButtonText>
                    </ButtonContentContainer>
                </ButtonContainer>
                <TextButtonWrapper color={color.white} isUnderlined={true} label={popUpStrings.contactSupport.toLowerCase()} onPress={navigateToHelp}/>
            </StampPopUp>

            <LoadingSpinner isLoading={isLoading} />

            <BottomNavigator navigation={navigation}
                showLogout={true}
                setLoader={() => { setIsLoading(true) }}
                dismissLoader={() => { setIsLoading(false) }} />
            {Config.LOG_OUT_ENABLED === 'true'  && isUserLoggedIn && renderLogOutButton()}

        </>
    );
};



Games.propTypes = {
    navigation: PropTypes.shape({
        replace: PropTypes.func.isRequired,
        navigate: PropTypes.func.isRequired,
        dispatch: PropTypes.bool,
        state: PropTypes.shape({
            params: PropTypes.shape({
                data: PropTypes.shape(),
            })
        })
    }).isRequired
};

export default memo(Games);
