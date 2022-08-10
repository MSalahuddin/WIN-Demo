/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import { FlatList, Platform, View, RefreshControl, StyleSheet, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import LoadingSpinner from '../common/LoadingSpinner';
import BottomNavigator from '../game-room/BottomBar';
import PopUpWrapper from '../common/PopUpWrapper';
import api from '../../api';
import GeoRestrictedModal from '../common/GeoRestrictedModal';
import {
    ScatteredCircleBackGround,
    ExitCircle,
    back_arrow,
    collection,
    todays_challenge,
    weekly_challenge,
    monthly_challenge,
    challenge_description
} from '../../../assets/images';
import { Win_demoWIcon } from '../../../assets/svgs';
import { scale, scaleHeight, getWindowWidth, scaleWidth } from '../../platformUtils';
import { color, flatListStyles } from '../../styles';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import Banner, { BANNER_TYPE } from '../common/Banner';
import { challenge } from '../../stringConstants';
import IconButton from '../common/IconButton';
import { SCREENS } from '../../constants';

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

const MachineTypesContiner = styled.View`
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

const ApplyBorder = styled.View`
padding:5px;
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
  margin-bottom: ${10}
  ;
`;

const IconViewWrapper = styled.View`
    margin-top: ${scaleHeight(15)}
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

const ListHeaderWrapper = styled.View`
`;

const CHALLENGE_BANNER = [
    challenge.collection,
    challenge.todayChallenge,
    challenge.weeklyChallenge,
    challenge.monthlyChallenge,
];

const CHALLENGE_ICON = [
    collection,
    todays_challenge,
    weekly_challenge,
    monthly_challenge
];

const Challenges = ({ navigation }) => {
    const { navigate, goBack } = navigation;
    const { challengeIndex } = navigation.state.params;
    const [isLoading, setIsLoading] = useState(false);
    const [playerChallenges, setPlayerChallenges] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)

    const fetchPlayerChallenge = async () => {
        const challengeSection = challengeIndex + 1
        try {
            setIsLoading(true);
            const result = await api.playerChallenges(challengeSection);
            if (result.status === 200 && result.data) {
                setPlayerChallenges(result.data.data)
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchPlayerChallenge()
    }, []);

    const backToGameRoom = () => {
        goBack(null)
    }

    const renderCloseIcon = () =>
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
                onPress={backToGameRoom}
            />
        </IconButtonContainer>

    const renderIcon = ({ onPress, icon, text }) => {
        return (
            <IconButtonContainer>
                <TouchableOpacity onPress={onPress} style={{ borderRadius: 200, overflow: 'hidden' }}>
                    <Image source={{ uri: icon }} style={{ height: scale(100), width: scale(100) }} />
                </TouchableOpacity>
                <IconBarText
                    alignCenter
                    color={color.white}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}
                    size={SIZE.XXXSMALL}
                    numberOfLines={2}
                    style={{ width:100, height:30}}
                >
                    {text}
                </IconBarText>
            </IconButtonContainer>
        );
    }

    const renderDescription = () => (
        !playerChallenges.length && !isLoading && <ChanllengeDescriptionWrapper
            source={challenge_description} resizeMode="stretch"
        >
            <ChallengeDescriptionText alignCenter
                color={color.white}
                fontFamily={FONT_FAMILY.SEMI_BOLD}
                size={SIZE.NORMAL}
            >{challenge.nochallengefound}
            </ChallengeDescriptionText>

        </ChanllengeDescriptionWrapper>
    )
    
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
                    onPress={backToGameRoom}
                    isBorderApply={true}
                />
            </BackIconButtonContainer>
        )
    }

    const onRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => {
            fetchPlayerChallenge()
            setIsRefreshing(false)
        }, 100)
    }

    const renderLoader = () => (
        !!isLoading && <View style={styles.smallBox}>
            <LoadingSpinner isLoading={isLoading} />
        </View>
    )

    const renderChanllengeIcon = () => {
        return (
            <ListHeaderWrapper>
                {renderTopBanner()}
                {renderDescription()}
                {renderLoader()}
            </ListHeaderWrapper>
        );
    }

    const renderTopBanner = () => (
        <BannerWrapper>
            <Banner
                label={CHALLENGE_BANNER[challengeIndex]}
                fontSize={15}
                width={screenWidth - scale(90)}
                bannerType={BANNER_TYPE.BLUE_BANNER}
                textSize={SIZE.XXSMALL}
            />
        </BannerWrapper>
    )

    const renderWIcon = () => {
        return(
            <Win_demoWIcon 
                width={Platform.OS === 'android' ? 25 : 30} 
                height={Platform.OS === 'android' ? 25 : 30} 
            />
        )
    }

    return (
        <PopUpWrapper>
            <GeoRestrictedModal>
                <Background source={ScatteredCircleBackGround} resizeMode="stretch">
                    <Container>
                        <RowContainer>
                            <IconBar>
                                <IconButtonContainer>
                                    <IconButtonWrapper
                                        marginTop={Platform.OS === 'android' ? scaleHeight(15) : scaleHeight(25)}
                                        size={30}
                                        icon={renderWIcon}
                                        backGroundColor={color.governorBay}
                                        borderRadius={scale(60)}
                                        paddingVertical={scale(10)}
                                        paddingHorizontal={scale(8)}
                                        onPress={()=> navigate(SCREENS.DIGITAL_GAME_ROOM, {sideBar: false})}
                                        isBorderApply={true}
                                        isSvg
                                    />
                                </IconButtonContainer>
                                {renderBackButton()}
                                <IconViewWrapper>

                                    <IconButtonContainer>
                                        <IconButtonWrapper
                                            marginTop={10}
                                            size={scale(45)}
                                            width={scale(45)}
                                            icon={CHALLENGE_ICON[challengeIndex]}
                                            backGroundColor={color.appBarIcon}
                                            borderRadius={scale(60)}
                                            paddingBottom={scale(0)}
                                            paddingHorizontal={scale(0)}
                                        />
                                        <IconBarText
                                            alignCenter
                                            color={color.white}
                                            fontFamily={FONT_FAMILY.SEMI_BOLD}
                                            size={SIZE.XXXSMALL}
                                            numberOfLines={2}
                                            style={{width:"90%"}}
                                        >
                                            {CHALLENGE_BANNER[challengeIndex]}
                                        </IconBarText>
                                    </IconButtonContainer>
                                </IconViewWrapper>
                            </IconBar>
                            <MachineTypesContiner>
                                <HeaderContainer>
                                    {renderCloseIcon()}
                                </HeaderContainer>
                                <FlatList
                                    data={playerChallenges}
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={<RefreshControl
                                        tintColor={color.white}
                                        refreshing={isRefreshing}
                                        onRefresh={onRefresh} />}
                                    renderItem={({ item, index }) =>
                                        renderIcon({
                                            icon: item.imageUrl,
                                            text: item.name,
                                            onPress: () => {
                                                navigate(SCREENS.CHALLENGE_GAME, {challengeIndex, selectedChallenge: item });
                                            },
                                        })}
                                    ListHeaderComponent={renderChanllengeIcon()}
                                    keyExtractor={item => String(item.id)}
                                    numColumns={2}
                                    columnWrapperStyle={flatListStyles.columnStyle}
                                    contentContainerStyle={flatListStyles.containerStyle}
                                />
                            </MachineTypesContiner>
                        </RowContainer>
                        <BottomNavigator navigation={navigation}
                            setSidebarOpen={backToGameRoom}
                            setLoader={() => { setIsLoading(true) }}
                            dismissLoader={() => { setIsLoading(false) }}
                        />
                    </Container>
                </Background>
            </GeoRestrictedModal>
        </PopUpWrapper>
    );
};

const styles = StyleSheet.create({
    smallBox: {
        height: 100,
        width: "100%"
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
