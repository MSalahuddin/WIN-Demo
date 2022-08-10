/* eslint-disable no-use-before-define */
import React, { useState, useContext, useRef } from 'react';
import { Platform , ScrollView, SafeAreaView} from 'react-native';
import Modal from 'react-native-modal';
import Config from 'react-native-config';
import styled from 'styled-components/native';
import DeviceInfo from 'react-native-device-info';
import TextButton from '../common/TextButton';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import { UserContext } from '../../context/User.context';
import {
    ExitCircle,
    collection,
    todays_challenge,
    weekly_challenge,
    monthly_challenge,
} from '../../../assets/images';

import { scale, scaleHeight } from '../../platformUtils';
import {  gameRoomStrings, challenge } from '../../stringConstants';
import BottomNavigator from '../game-room/BottomBar';
import { SCREENS } from '../../constants';
import { color } from '../../styles';
import IconButton from '../common/IconButton';

const StyledModal = styled(Modal)`
  margin: 0;
`;

const LogoutContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: ${scaleHeight(10)};
  width: 100%;
`;

const BarContainer = styled.View`
flex:1;
margin-bottom: -1px;
`;
const EmptySpace = styled.TouchableOpacity`
 height:100%;
 width:72%; 
 position:absolute;
`

const IconBar = styled.View`
width: 25%;
background-color: ${color.darkNavyBlue};
align-self: flex-end;
height: 100%;
z-index: -100;
`;

const IconButtonContainer = styled.View`
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

const IconViewWrapper = styled.View`
    margin-top: ${scaleHeight(15)}
`;

const IconBarText = styled(Text)`
  margin-top: ${10}
  ;
`;

const ChallengeModal = ({ navigation, isSidebarOpen, setSidebarOpen, showLogout }) => {
    const sideBarScroll = useRef()
    const { isUserLoggedIn } = useContext(UserContext);
    const { navigate } = navigation;
    const [isLoading, setIsLoading] = useState(true);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const appBarIcons = [
        {
            item: challenge.collection,
            icon: collection,
            isPadding: false,
            iconSize: scale(45),
            backgroundColor: color.appBarIcon,
            marginTop: 10,
            onPress: () => {
                setSidebarOpen(false);
                navigate(SCREENS.CHALLENGE, { challengeIndex: 0 });
            }

        },
        {
            item: challenge.todayChallenge,
            icon: todays_challenge,
            isPadding: false,
            iconSize: scale(45),
            backgroundColor: color.appBarIcon,
            marginTop: 10,
            onPress: () => {
                setSidebarOpen(false);
                navigate(SCREENS.CHALLENGE, { challengeIndex: 1 });
            }

        },
        {
            item: challenge.weeklyChallenge,
            icon: weekly_challenge,
            isPadding: false,
            iconSize: scale(45),
            backgroundColor: color.appBarIcon,
            marginTop: 10,
            onPress: () => {
                setSidebarOpen(false);
                navigate(SCREENS.CHALLENGE, { challengeIndex: 2 });
            }

        },
        {
            item: challenge.monthlyChallenge,
            icon: monthly_challenge,
            isPadding: false,
            iconSize: scale(45),
            backgroundColor: color.appBarIcon,
            marginTop: 10,
            onPress: () => {
                setSidebarOpen(false);
                navigate(SCREENS.CHALLENGE, { challengeIndex: 3 });
            }

        }
    ]

    const renderLogOutButton = () => {
        const version = DeviceInfo.getVersion();
        return (
            <LogoutContainer>
                <TextButton label={gameRoomStrings.logOut} onPress={() => handleLogout()} />
                <Text size={SIZE.XXSMALL}>{`v${version}`}</Text>
            </LogoutContainer>
        );
    };

    const renderIcon = ({ onPress, icon, text, isPadding, iconSize, backgroundColor, maginTop, isUrl, isBorderApply }) => {

        return (
            <IconButtonContainer>
                <IconButtonWrapper
                    marginTop={maginTop}
                    size={iconSize || 30}
                    width={iconSize}
                    icon={icon}
                    isUrl={isUrl}
                    backGroundColor={backgroundColor}
                    borderRadius={scale(60)}
                    paddingBottom={isPadding ? scale(15) : scale(0)}
                    paddingHorizontal={isPadding ? scale(8) : scale(0)}
                    onPress={onPress}
                />
                <IconBarText
                    alignCenter
                    color={color.white}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}
                    size={SIZE.XXXSMALL}
                    style={{ width: 85 }}
                    numberOfLines={2}
                >
                    {text}
                </IconBarText>
            </IconButtonContainer>
        );
    }

    return (
        <StyledModal animationType='slide' isVisible={isSidebarOpen} transparent={true} backdropOpacity={0}>
            <BarContainer >
                <EmptySpace activeOpacity={1} onPress={() => setSidebarOpen(false)} />
                <IconBar>
                    <IconButtonContainer>
                        <IconButtonWrapper
                            marginTop={Platform.OS === 'android' ? scaleHeight(15) : scaleHeight(25)}
                            size={35}
                            icon={ExitCircle}
                            backGroundColor={color.governorBay}
                            borderRadius={scale(60)}
                            paddingBottom={scale(10)}
                            paddingHorizontal={scale(0)}
                            onPress={() => setSidebarOpen(false)}
                            isBorderApply={false}
                        />
                    </IconButtonContainer>
                    <ScrollView ref={sideBarScroll} style={{ position: 'relative' }} >
                        <IconViewWrapper>
                            {appBarIcons.map((data) =>
                                renderIcon({
                                    icon: data.icon,
                                    text: data?.item,
                                    isPadding: data.isPadding,
                                    iconSize: data?.iconSize,
                                    backgroundColor: data.backgroundColor,
                                    marginTop: data?.marginTop,
                                    onPress: data?.onPress,
                                }))}
                        </IconViewWrapper>
                    </ScrollView>
                </IconBar>
            </BarContainer>
            <BottomNavigator navigation={navigation}
                showSideBar={true}
                setSidebarOpen={() => { setSidebarOpen(false) }}
                setLoader={() => { setIsLoading(false) }} dismissLoader={() => { setIsLoading(false) }} />
            {Config.LOG_OUT_ENABLED === 'true' && !isSearchActive && isUserLoggedIn && showLogout && renderLogOutButton()}
            {Platform.OS == "ios" && <SafeAreaView />}
        </StyledModal>
    )
}

export default ChallengeModal;
