/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from 'react';
import { FlatList, Platform, View, TouchableOpacity, StyleSheet, RefreshControl, Image } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import LoadingSpinner from '../common/LoadingSpinner';
import BottomNavigator from '../game-room/BottomBar';
import PopUpWrapper from '../common/PopUpWrapper';
import api from '../../api';
import GeoRestrictedModal from '../common/GeoRestrictedModal';
import moment from 'moment';
import {
    ScatteredCircleBackGround,
    ExitCircle,
    back_arrow,
    challenge_description,
    challenge_ticket,
    challenge_token,
    challenge_rank,
    challenge_grand_prize,
    challenge_2nd_place,
    challenge_3rd_place
} from '../../../assets/images';
import { Win_demoWIcon } from '../../../assets/svgs';
import { scale, scaleHeight, getWindowWidth, scaleWidth, heightRatio } from '../../platformUtils';
import { color, flatListStyles } from '../../styles';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import Banner, { BANNER_TYPE } from '../common/Banner';
import IconButton from '../common/IconButton';
import { SCREENS } from '../../constants';
import { UserContext } from '../../context/User.context';
import { PopupContext } from '../../context/Popup.context'

const screenWidth = getWindowWidth();
const Background = styled.ImageBackground`
height: 100%;
width: 100%;
`;

const IconBar = styled.View`
width: 25%;
background-color: ${color.darkNavyBlue}
`;

const Container = styled.View`
flex:1;
`;

const RowContainer = styled.View`
flex:1;
flex-direction: row;
`;

const ChallengeGamesContainer = styled.View`
width: 75%;
background-color: ${color.daisyBush}
`;

const HeaderContainer = styled.View`
flex-direction: row;
right: ${scale(10)};
justify-content: flex-end;
padding-bottom:5;
`;

const BannerWrapper = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: ${scaleHeight(13)};
  margin-top: ${scaleHeight(25)}
`;

const IconButtonContainer = styled.View`
align-items: center;
margin-top: 5px;
`;

const BackIconButtonContainer = styled.View`
align-items: center;
`;

const IconButtonWrapper = styled(IconButton)`
margin-top: ${({ marginTop }) => (marginTop ? scale(marginTop) : scale(10))};
margin-left: ${({ marginLeft }) => (marginLeft ? scale(marginLeft) : scale(0))};
margin-right: ${({ marginRight }) => (marginRight ? scale(marginRight) : scale(0))};
width: ${({ width }) => (width || scale(45))};
align-items: center;
background-color:${({ isBorderApply, backGroundColor }) => isBorderApply ? backGroundColor : 'transparent'};;
`;

const BackIconButtonWrapper = styled(IconButton)`
margin-top: 25px;
margin-left: ${({ marginLeft }) => (marginLeft ? scale(marginLeft) : scale(0))};
margin-right: ${({ marginRight }) => (marginRight ? scale(marginRight) : scale(0))};
width: ${scale(45)};
height: ${scale(45)};
align-items: center;
justify-content: center;
background-color:${color.transparent};
transform: rotate(180deg);
`;

const IconBarText = styled(Text)`
  margin-top: ${10};
`;

const DrawerIconBarText = styled(Text)`
  margin: 5px 0;
  height: 25px;
`;

const IconViewWrapper = styled.View`
    margin-top: ${scaleHeight(15)}
`;

const ListHeaderWrapper = styled.View`
`;

const ChanllengeDescriptionWrapper = styled.ImageBackground`
    margin-horizontal: ${scaleHeight(15)}
    margin-vertical: ${scaleHeight(10)}
`;

const ChallengeDescriptionText = styled(Text)`
    margin-vertical: ${scaleHeight(15)}
    margin-bottom: ${scaleHeight(20)}
    margin-horizontal: ${scaleHeight(15)}
`;

const GrandPrizeWrapper = styled.View`
width:100%;
justify-content:center;
align-items:center;
height: 50;
`;

const MyRankIcon = styled.Image`
border-radius: ${scaleHeight(50)};
height: 50;
width: 50;
position:absolute;
left:${Platform.OS === 'ios' && heightRatio > 1.1 ? -scaleHeight(15) : -scaleHeight(20)};
`;

const PersonRank = styled.Image`
border-radius: ${scaleHeight(50)};
height: 40;
width: 40;
position:absolute;
border:${({ borderColor }) => `${borderColor || 'transparent'} 2px solid`};
left:${Platform.OS === 'ios' && heightRatio > 1.1 ? -scaleHeight(15) : -scaleHeight(20)};
`;

const MyRankText = styled(Text)`
text-align: center;
align-items:center;
width:75%
position:absolute;
left:20%;
transform: scale(.9)
padding-left:-5;
`;

const ApplyBorder = styled.View`
padding:${({ padding }) => (padding ? padding : 5)}px;
background-color:${color.white};
border-radius:200px
`;

const IconButtonWithBorder = styled(IconButton)`
margin-top: ${({ marginTop }) => (marginTop ? scale(marginTop) : scale(10))};
margin-left: ${({ marginLeft }) => (marginLeft ? scale(marginLeft) : scale(0))};
margin-right: ${({ marginRight }) => (marginRight ? scale(marginRight) : scale(0))};
width: ${({ width }) => (width || scale(45))};
overflow: hidden;
align-items: center;
margin: 0 !important;
padding: 0 !important;
background-color:${({ isBorderApply, backGroundColor }) => isBorderApply ? backGroundColor : 'transparent'};;
`;

class TimerComp extends React.Component {
    state = { timer: "", days:"" }
    setInterval = null
    componentDidMount() {
        this.setInterval = setInterval(() => {
            const { challengeIndex, endDate } = this.props
            let start = moment(new Date().toUTCString());
            let end = moment.utc(endDate);
            let diff = end.diff(start);
            this.setState({ timer: moment.utc(diff).format("DD.HH.mm.ss") })
        }, 1000);
    }

    componentWillUnmount() {
        if (this.setInterval) clearInterval(this.setInterval)
    }
    render() {
        return <Text style={styles.timeText}> {this.state.timer}</Text>
    }
};

const Challenges = ({ navigation }) => {
    const { navigate, goBack } = navigation;
    const { challengeIndex, selectedChallenge } = navigation.state.params;
    const [isLoading, setIsLoading] = useState(false);
    const [playerChallengeGames, setPlayerChallengeGames] = useState([])
    const [playerChallengeRank, setPlayerChallengeRank] = useState([])
    const [playerChallengeRankMsg, setPlayerChallengeRankMsg] = useState("")
    const [isViewGamesOrRank, setIsViewGamesOrRank] = useState(true) // true for showing games data
    const [isRefreshing, setIsRefreshing] = useState(false)
    const { setIsBecomeVipPopUpShown } = useContext(PopupContext);
    const { isVip } = useContext(UserContext);

    const fetchChallengeGames = async () => {
        const { challengeId, challengeType } = selectedChallenge
        try {
            setIsLoading(true);
            const result = await api.playerChallengeGames(challengeId, challengeType);
            if (result.status === 200 && result.data) {
                setPlayerChallengeGames(result.data.data)
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }

    const fetchChallengeRank = async () => {
        const { challengeId, challengeType } = selectedChallenge
        try {
            setIsLoading(true);
            const result = await api.playerChallengeRank(challengeId, challengeType);
            if (result.status === 200 && result.data) {
                setPlayerChallengeRank(result.data.data)
                if (!result.data.data?.length) {
                    setPlayerChallengeRankMsg(result.data.message)
                }
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchChallengeGames()
        if (challengeIndex) fetchChallengeRank()
    }, []);


    const backToGameRoom = () => {
        navigate(SCREENS.GAME_ROOM);
    }

    const closeChallenge = () => {
        goBack(null);
        goBack(null);
    }

    const backToChallenges = () => {
        navigate(SCREENS.CHALLENGE);
    }

    const renderCloseIcon = () =>
        <HeaderContainer>
            <IconButtonContainer>
                <IconButtonWrapper
                    marginTop={Platform.OS === 'android' ? scaleHeight(15) : scaleHeight(25)}
                    marginRight={scaleWidth(10)}
                    size={scale(35)}
                    width={scale(35)}
                    icon={ExitCircle}
                    backGroundColor={color.cornflowerBlue}
                    borderRadius={scale(60)}
                    paddingBottom={scale(0)}
                    paddingHorizontal={scale(0)}
                    onPress={closeChallenge}
                />
            </IconButtonContainer>
        </HeaderContainer>

    const renderChallengeGames = ({ isWinned, onPress, icon, text }) => {
        return (
            <IconButtonContainer>
                {isWinned && <View style={styles.isWonBlur}>
                    <View style={styles.isWonMain}>
                        <Text
                            style={{ fontSize: 14 }}
                            fontFamily={FONT_FAMILY.BOLD_ITALIC}
                            color={color.white}
                        >WON!</Text>
                    </View>
                </View>
                }
                <TouchableOpacity disabled={isWinned} onPress={onPress} style={{ borderRadius: 200, overflow: 'hidden' }}>
                    <Image source={{ uri: icon }} style={{ height: scale(110), width: scale(110) }} />
                </TouchableOpacity>
                <IconBarText
                    alignCenter
                    color={color.white}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}
                    size={SIZE.XXXSMALL}
                    numberOfLines={2}
                    style={{ width: 100, marginBottom: 10, height: 30 }}
                >
                    {text}
                </IconBarText>
            </IconButtonContainer>
        );
    }

    const renderBackButton = () => {
        return (
            <BackIconButtonContainer>
                <BackIconButtonWrapper
                    size={scale(30)}
                    icon={back_arrow}
                    backGroundColor={color.transparent}
                    borderRadius={scale(0)}
                    paddingBottom={scale(0)}
                    paddingHorizontal={scale(0)}
                    onPress={backToChallenges}
                    marginRight={5}
                    isBorderApply={true}
                />
            </BackIconButtonContainer>
        )
    }

    const renderDescription = (text) => (
        !!selectedChallenge?.description && <ChanllengeDescriptionWrapper
            source={challenge_description} resizeMode="stretch"
        >
            <ChallengeDescriptionText alignCenter
                color={color.white}
                fontFamily={FONT_FAMILY.SEMI_BOLD}
                size={SIZE.NORMAL}
            >{text || selectedChallenge.description}
            </ChallengeDescriptionText>

        </ChanllengeDescriptionWrapper>
    )

    const renderChanllengeHeader = () => {
        return (
            <ListHeaderWrapper>
                {renderCloseIcon()}
                {renderTopBanner(selectedChallenge?.name || 'name not found')}
                {renderChallageLogo()}
                {renderDescription()}
                {selectedChallenge.challengeRewards.map(reward => renderPrizeCircle(reward))}
                {renderTopBanner("PRIZES TO WIN")}
                {!isLoading && !playerChallengeGames.length && <Text style={[styles.timeText, {textAlign:'center'}]}>No prize to play</Text>}

                {renderLoader()}

            </ListHeaderWrapper>
        );
    }

    const renderLoader = () => (
        !!isLoading && <View style={styles.smallBox}>
            <LoadingSpinner isLoading={isLoading} />
        </View>
    )

    const renderRankHeader = () => {
        return (
            <ListHeaderWrapper>
                {renderCloseIcon()}
                {renderTopBanner('CHALLENGE RANK')}
                {renderLoader()}
                {!!playerChallengeRankMsg && renderDescription(playerChallengeRankMsg)}
                {!playerChallengeRankMsg && renderShortRankHeader()}
            </ListHeaderWrapper>
        );
    }

    const renderShortRankHeader = () => (
        <View style={styles.rankLabelHeader}>
            <Text
                style={{ fontSize: 16 }}
                fontFamily={FONT_FAMILY.SEMI_BOLD}
                color={color.white}
            >Rank</Text>
            <Text
                style={{ fontSize: 16, marginRight: 15 }}
                fontFamily={FONT_FAMILY.SEMI_BOLD}
                color={color.white}
            >{selectedChallenge.challengeType == 3 ? "Losses" : "Wins"}</Text>
        </View>
    )
    const renderChallageLogo = () => (
        <IconButtonContainer>
                <IconButtonWithBorder
                    marginTop={10}
                    size={scale(110)}
                    width={scale(110)}
                    icon={selectedChallenge.imageUrl}
                    backGroundColor={color.appBarIcon}
                    borderRadius={scale(60)}
                    disabled={true}
                    paddingBottom={scale(0)}
                    paddingHorizontal={scale(0)}
                    isUrl={true}
                />
        </IconButtonContainer>
    )

    const handleRankContent = (rank) => {
        const rewardsContent = {
            image: challenge_grand_prize,
            labelColor: color.darkPink,
            labelText: "MORE PLACES"
        }
        if (rank == 1) rewardsContent.labelText = "GRAND PRIZE"
        if (rank == 2) {
            rewardsContent.image = challenge_2nd_place
            rewardsContent.labelColor = color.cyanBlue
            rewardsContent.labelText = "SECOND PLACE"
        }
        if (rank == 3) {
            rewardsContent.image = challenge_3rd_place
            rewardsContent.labelColor = color.havelockBlue
            rewardsContent.labelText = "THIRD PLACE"
        }

        return rewardsContent
    }

    const renderPrize = (rank) => {
        const { image, labelColor, labelText } = handleRankContent(rank)
        return (
            <GrandPrizeWrapper paddingHorizontal={'8%'} >
                <TouchableOpacity disabled={true} style={[styles.rankLabelBack, { borderTopColor: labelColor }]}>
                    <MyRankIcon source={image} resideMode="contain" />
                    <MyRankText
                        style={Platform.OS == 'ios' ? {bottom: 2}: {}}
                        fontFamily={FONT_FAMILY.BOLD}
                        color={color.white} >
                        {labelText}
                    </MyRankText>
                </TouchableOpacity>
            </GrandPrizeWrapper>
        )
    }

    const handleRankColor = (rank, index) => {
        if (rank == 1) return color.darkPink // 1st color
        if (!index) return color.bestValueBgColor // my color
        return color.cyanBlue
    }

    const renderPersonRank = (item, index) => {
        const { player, rank, winsCount, lossesCount } = item
        return (
            <GrandPrizeWrapper paddingHorizontal={'8%'}>
                <TouchableOpacity style={[styles.rankListMain, { borderTopColor: handleRankColor(rank, index) }]}>
                    <PersonRank borderColor={handleRankColor(rank, index) == color.bestValueBgColor ? handleRankColor(rank, index) : color.white} source={{ uri: player.profileImageUrl }} resideMode="contain" />
                    <View style={styles.rankLabel}>
                        <Text
                            style={{ fontSize: 18 }}
                            fontFamily={FONT_FAMILY.SEMI_BOLD}
                            color={color.white}
                        >#{rank}</Text>
                        <Text
                            style={{ width: 60, textAlign: 'center', fontSize: 18 }}
                            fontFamily={FONT_FAMILY.SEMI_BOLD}
                            color={color.white}
                        >{selectedChallenge.challengeType == 3 ? `${lossesCount} loss${lossesCount != 1 ?'es':''}`: `${winsCount} win${winsCount != 1 ? 's':''}`} </Text>
                    </View>
                </TouchableOpacity>
            </GrandPrizeWrapper>
        )
    }

    const renderPrizeCircle = ({ prize, ticketAmount, tokenAmount, rank }) => {
        return <>
            {renderPrize(rank)}
            <IconButtonContainer
                flexDirection="row"
                width={'100%'}
                justifyContent="space-evenly"
                paddingHorizontal={'5%'}
                paddingBottom={10}
            >
                {!!prize?.imageUrl && <IconButtonContainer>
                    <Image
                        style={styles.prizeImg}
                        source={{ uri: prize.imageUrl }}
                    />
                    <IconBarText
                        alignCenter
                        color={color.white}
                        fontFamily={FONT_FAMILY.SEMI_BOLD}
                        size={SIZE.XXXSMALL}
                        numberOfLines={1}
                        style={{ marginBottom:0, width:60}}
                    >
                        {prize?.name || ""}
                    </IconBarText>

                    <IconBarText
                        alignCenter
                        color={color.white}
                        fontFamily={FONT_FAMILY.SEMI_BOLD}
                        size={SIZE.XXXSMALL}
                        numberOfLines={2}
                        style={{ marginTop:0 }}
                    >
                        {"PRIZE"}
                    </IconBarText>
                </IconButtonContainer>}

                {!!tokenAmount && <IconButtonContainer>
                    <IconButtonWithBorder
                        marginTop={10}
                        size={scale(60)}
                        width={scale(60)}
                        icon={challenge_token}
                        backGroundColor={color.appBarIcon}
                        borderRadius={scale(60)}
                        paddingBottom={scale(0)}
                        paddingHorizontal={scale(0)}
                        disabled={true}
                        isUrl={false}
                    />
                    <IconBarText
                        alignCenter
                        color={color.white}
                        fontFamily={FONT_FAMILY.SEMI_BOLD}
                        style={{ width: 50, marginBottom:0 }}
                        size={SIZE.XXXSMALL}
                        numberOfLines={1}
                    >
                        {tokenAmount}
                    </IconBarText>
                    <IconBarText
                        alignCenter
                        color={color.white}
                        fontFamily={FONT_FAMILY.SEMI_BOLD}
                        style={{ marginTop:0 }}
                        size={SIZE.XXXSMALL}
                        numberOfLines={2}
                    >
                        {`TOKENS`}
                    </IconBarText>
                </IconButtonContainer>}

                {!!ticketAmount && <IconButtonContainer>
                    <IconButtonWithBorder
                        marginTop={10}
                        size={scale(60)}
                        width={scale(60)}
                        icon={challenge_ticket}
                        backGroundColor={color.appBarIcon}
                        borderRadius={scale(60)}
                        paddingBottom={scale(0)}
                        disabled={true}
                        paddingHorizontal={scale(0)}
                        isUrl={false}
                    />
                    <IconBarText
                        alignCenter
                        color={color.white}
                        fontFamily={FONT_FAMILY.SEMI_BOLD}
                        size={SIZE.XXXSMALL}
                        marginBottom={0}
                        style={{ marginBottom:0, width:50}}
                        numberOfLines={1}
                    >
                        {`${ticketAmount}`}
                    </IconBarText>

                    <IconBarText
                        alignCenter
                        color={color.white}
                        fontFamily={FONT_FAMILY.SEMI_BOLD}
                        size={SIZE.XXXSMALL}
                        style={{ marginTop:0}}
                        numberOfLines={2}
                    >
                        {`TICKETS`}
                    </IconBarText>
                </IconButtonContainer>}

            </IconButtonContainer>
        </>
    }

    const handleTextLength = (text) => {
        if (text.length > 20) {
            return text.slice(0, 18) + "..."
        }
        return text
    }

    const renderTopBanner = (name) => (
        <BannerWrapper>
            <Banner
                label={handleTextLength(name)}
                fontSize={15}
                width={screenWidth - scale(90)}
                bannerType={BANNER_TYPE.BLUE_BANNER}
                textSize={SIZE.XXSMALL}
            />
        </BannerWrapper>
    )

    const renderIcon = () => {
        return(
            <Win_demoWIcon 
                width={Platform.OS === 'android' ? 25 : 30} 
                height={Platform.OS === 'android' ? 25 : 30} 
            />
        )
    }

    const renderRightDrawer = () => {
        return <IconBar>
            <IconButtonContainer>
                <IconButtonWrapper
                    marginTop={Platform.OS === 'android' ? scaleHeight(15) : scaleHeight(25)}
                    size={30}
                    icon={renderIcon}
                    backGroundColor={color.governorBay}
                    borderRadius={scale(60)}
                    paddingVertical={scale(10)}
                    paddingHorizontal={scale(8)}
                    onPress={backToGameRoom}
                    isBorderApply={true}
                    isSvg
                />
            </IconButtonContainer>
            {renderBackButton()}
            <IconViewWrapper>
                <IconButtonContainer>
                    <View style={[styles.activeTab, { borderColor: isViewGamesOrRank ? color.white : 'transparent' }]}>
                        <IconButtonWithBorder
                            marginTop={10}
                            size={scale(45)}
                            width={scale(45)}
                            icon={selectedChallenge.imageUrl}
                            backGroundColor={color.appBarIcon}
                            borderRadius={scale(60)}
                            paddingBottom={scale(0)}
                            paddingHorizontal={scale(0)}
                            isUrl={true}
                            onPress={() => setIsViewGamesOrRank(true)}
                        />
                    </View>
                    <DrawerIconBarText
                        alignCenter
                        color={color.white}
                        fontFamily={FONT_FAMILY.MEDIUM}
                        size={SIZE.XXXSMALL}
                        numberOfLines={2}
                        style={{ width: '90%', height:34 }}
                    >
                        {selectedChallenge?.name || ''}
                    </DrawerIconBarText>
                </IconButtonContainer>

                {!!challengeIndex && <IconButtonContainer>
                    <View style={[styles.activeTab, { borderColor: !isViewGamesOrRank ? color.darkPink : 'transparent' }]}>
                        <IconButtonWithBorder
                            marginTop={20}
                            size={scale(45)}
                            width={scale(45)}
                            icon={challenge_rank}
                            backGroundColor={color.appBarIcon}
                            borderRadius={scale(60)}
                            paddingBottom={scale(0)}
                            paddingHorizontal={scale(0)}
                            isUrl={false}
                            onPress={() => setIsViewGamesOrRank(false)}
                        />
                    </View>
                    <DrawerIconBarText
                        alignCenter
                        color={color.white}
                        fontFamily={FONT_FAMILY.MEDIUM}
                        size={SIZE.XXXSMALL}
                        numberOfLines={2}
                    >
                        {"My Rank"}
                    </DrawerIconBarText>
                </IconButtonContainer>}

                {!!selectedChallenge?.endDate && <View style={styles.timeMain}>
                    <View style={styles.timeBox}>

                        <TimerComp endDate={selectedChallenge.endDate} challengeIndex={challengeIndex} />
                    </View>
                    <Text style={styles.timeText}>End</Text>
                </View>}
            </IconViewWrapper>
        </IconBar>
    }

    const handleGamePlay = (machineData) => {
        const { challengeId } = selectedChallenge
        if(!machineData.isVip) {
            navigate(SCREENS.GAME_PLAY, { machineData, challengeId, challengeIndex, selectedChallenge });
        } else if(isVip){
            navigate(SCREENS.GAME_PLAY, { machineData, challengeId, challengeIndex, selectedChallenge });
        } else {
            setIsBecomeVipPopUpShown(true)
        }
    }

    const onRefresh = (isGameData) => {
        setIsRefreshing(true)
        setTimeout(() => {
            setIsRefreshing(false)
            if (!isGameData) return fetchChallengeGames()
            fetchChallengeRank()
        }, 100)
    }

    const renderChallengeData = () => (
        <ChallengeGamesContainer>
            <FlatList
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl
                    tintColor={color.white}
                    refreshing={isRefreshing}
                    onRefresh={() => onRefresh(0)} />}
                data={playerChallengeGames}
                renderItem={({ item, index }) =>
                    renderChallengeGames({
                        icon: item.prize.imageUrl,
                        text: item.prize.name,
                        onPress: () => handleGamePlay(item),
                        isWinned: item.isWinned
                    })}
                ListHeaderComponent={renderChanllengeHeader()}
                keyExtractor={item => String(item.id)}
                numColumns={2}
                columnWrapperStyle={flatListStyles.columnStyle}
                contentContainerStyle={flatListStyles.containerStyle}
            />


        </ChallengeGamesContainer>
    )

    const renderChallengeRank = () => (
        <ChallengeGamesContainer>
            <FlatList
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => onRefresh(1)} />}
                data={playerChallengeRank}
                renderItem={({ item, index }) => renderPersonRank(item, index)}
                ListHeaderComponent={renderRankHeader()}
                keyExtractor={item => String(item.id)}
                numColumns={1}
                contentContainerStyle={flatListStyles.containerStyle}
            />
        </ChallengeGamesContainer>
    )

    const renderFooter = () => <>
        <BottomNavigator navigation={navigation}
            showSideBar={true}
            setSidebarOpen={backToGameRoom}
            setLoader={() => { setIsLoading(true) }}
            dismissLoader={() => { setIsLoading(false) }}
        />
    </>

    return (
        <ParentLayer>
            <RowContainer>
                {renderRightDrawer()}
                {isViewGamesOrRank && renderChallengeData()}
                {!isViewGamesOrRank && renderChallengeRank()}
            </RowContainer>
            {renderFooter()}
        </ParentLayer>
    );
};

function ParentLayer(props) {
    return (
        <PopUpWrapper>
            <GeoRestrictedModal>
                <Background source={ScatteredCircleBackGround} resizeMode="stretch">
                    <Container>
                        {props.children}
                    </Container>
                </Background>
            </GeoRestrictedModal>
        </PopUpWrapper >
    )
}

const styles = StyleSheet.create({
    activeTab: {
        borderWidth: 2,
        borderRadius: 200
    },
    smallBox: {
        height: 100,
        width: "100%"
    },
    timeMain: {
        width: '100%',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    timeBox: {
        backgroundColor: color.deepDarkBlue,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 100
    },
    timeText: {
        color: color.white,
        fontSize: 14,
        marginBottom: Platform.OS == 'ios' ? -4 : 0,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    rankLabel: {
        width: '90%',
        position: 'absolute',
        left: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    rankLabelHeader: {
        width: '90%',
        marginLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 50,
    },
    rankLabelBack: {
        flexDirection: 'row',
        borderRightWidth: 8,
        borderTopWidth: 30,
        borderRightColor: 'transparent',
        backgroundColor: 'transparent',
        width: '85%',
        marginTop: scaleHeight(0),
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankListMain: {
        flexDirection: 'row',
        borderRightWidth: 8,
        borderTopWidth: 26,
        borderRightColor: 'transparent',
        backgroundColor: 'transparent',
        width: '90%',
        marginTop: scaleHeight(0),
        justifyContent: "space-around",
        alignItems: 'center',
    },
    isWonMain: {
        height: 45,
        width: 45,
        backgroundColor: color.bestValueBgColor,
        position: 'absolute',
        borderRadius: 200,
        top: 0,
        zIndex: 40,
        left: 0,
        borderWidth: 2,
        borderColor: color.white,
        alignItems: 'center',
        justifyContent: 'center'
    },
    prizeImg: {
        marginTop: 0,
        width: scale(60),
        height: scale(60),
        paddingHorizontal: scale(0),
        borderRadius: scale(60)
    },
    isWonBlur: {
        position: 'absolute',
        zIndex: 39,
        borderRadius: 200,
        backgroundColor: '#8a8a8a90',
        height: scale(110),
        width: scale(110)
    }
})

Challenges.propTypes = {
    navigation: PropTypes.shape({
        replace: PropTypes.func.isRequired,
        navigate: PropTypes.func.isRequired,
        dispatch: PropTypes.bool
    }).isRequired,
};

export default Challenges;
