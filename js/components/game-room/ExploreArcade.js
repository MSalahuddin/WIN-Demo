/* eslint-disable no-use-before-define */
import React, { useState, useContext, useEffect } from 'react';
import { FlatList, Platform } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import LoadingSpinner from '../common/LoadingSpinner';
import BottomNavigator from './BottomBar';
import PopUpWrapper from '../common/PopUpWrapper';
import api from '../../api';
import GeoRestrictedModal from '../common/GeoRestrictedModal';
import { UserContext } from '../../context/User.context';
import { PopupContext } from '../../context/Popup.context';
import {
    ScatteredCircleBackGround,
    allMachinesIcon,
    selectDifficulty,
    arrowBack,
} from '../../../assets/images';
import { Win_demoWIcon } from '../../../assets/svgs';
import { scale, scaleHeight, getWindowWidth, scaleWidth } from '../../platformUtils';
import { color, flatListStyles } from '../../styles';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import Banner, { BANNER_TYPE } from '../common/Banner';
import { exploreArcade } from '../../stringConstants';
import IconButton from '../common/IconButton';
import { ERROR_STATUS_CODE, SCREENS } from '../../constants';


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
`;

const CloseButtonContainer = styled.TouchableOpacity``;

const CloseIcon = styled.Image`
  height: ${scale(36)};
  width: ${scale(36)};
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
margin-top: 25
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
margin-top: ${Platform.OS === 'android' ? scaleHeight(5) : scaleHeight(10)};
margin-left: ${({ marginLeft }) => (marginLeft ? scale(marginLeft) : scale(0))};
margin-right: ${({ marginRight }) => (marginRight ? scale(marginRight) : scale(0))};
width: ${scale(45)};
height: ${scale(45)};
align-items: center;
justify-content: center;
background-color:${color.grayBlack};
`;

const IconBarText = styled(Text)`
  margin-top: ${10}
  ;
`;

const IconViewWrapper = styled.View`
    margin-top: ${scaleHeight(15)}
`;

const SelectedIconWrapper = styled.View`
    flex-direction: row;
`;

const ExploreArcade = ({ navigation }) => {
    const { navigate } = navigation;
    const [isLoading, setIsLoading] = useState(false);
    const [machineTypes, setMachineTypes] = useState([{
        imageUrl: allMachinesIcon,
        name: exploreArcade.allMachine,
        id: null
    }]);
    const [MachineDifficulty, setMachineDifficulty] = useState([{
        imageUrl: allMachinesIcon,
        name: exploreArcade.allDifficulty,
        id: null,
    }]);
    const [showMachineType, setshowMachineType] = useState(true);
    const [selectedMachineType, setSelectedMachineType] = useState({ item: null, index: null });
    const [selectedMachineDifficulty, setSelectedMachineDifficulty] = useState({ item: null, index: null });
    const {
        setGeoRestrictedStatusCode,
        setShouldRefreshGameRoom
    } = useContext(UserContext);
    const { displayRequestError } = useContext(PopupContext);

    const appBarIcons = [
        {
            item: exploreArcade.exploreArcade,
            icon: allMachinesIcon,
            isPadding: false,
            iconSize: scale(45),
            backgroundColor: color.appBarIcon,
            marginTop: 10,
            onPress: () => setshowMachineType(true)

        },
        {
            item: exploreArcade.selectDifficulty,
            icon: selectDifficulty,
            isPadding: false,
            iconSize: scale(45),
            backgroundColor: color.appBarIcon,
            marginTop: 10,
            onPress: () => setshowMachineType(false)

        }
    ];

    useEffect(() => {
        // eslint-disable-next-line no-use-before-define
        fetchMachineTypes();
        fetchMachineDifficulty();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sort = (data) => {
        return data.sort((a, b) => {
            if (a.difficultyOrder < b.difficultyOrder) return -1
            return a.difficultyOrder > b.difficultyOrder ? 1 : 0
        })
    }

    const backToGameRoom = () => {
        setShouldRefreshGameRoom(true);
        navigate(SCREENS.GAME_ROOM, {
            data: {
                typeId: selectedMachineType?.item ?
                    selectedMachineType?.item?.id :
                    null,

                difficultyId: selectedMachineDifficulty?.item ?
                    selectedMachineDifficulty?.item?.id :
                    null
            }
        })
    }

    const fetchMachineDifficulty = async () => {
        try {
            const result = await api.GetMachineDifficulty();
            if (result.status === 200 && result.data) {

                const machineDifficulty = [...MachineDifficulty, ...sort(result.data.data)]
                setMachineDifficulty(machineDifficulty)
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
    }

    const fetchMachineTypes = async () => {
        try {
            const result = await api.GetMachineTypes();
            if (result.status === 200 && result.data) {
                const machine = [...machineTypes, ...result.data]
                setMachineTypes(null);
                setMachineTypes([...machine]);
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
    }

    const renderSelectedIcon = () =>
        <SelectedIconWrapper>
            <IconButtonContainer>
                <IconButtonWrapper
                    marginTop={Platform.OS === 'android' ? scaleHeight(25) : scaleHeight(25)}
                    marginRight={scaleWidth(10)}
                    size={scale(45)}
                    width={scale(45)}
                    icon={selectedMachineType.item ? selectedMachineType.item.imageUrl : null}
                    isUrl={selectedMachineType.index > 0 ? true : false}
                    backGroundColor={color.cornflowerBlue}
                    borderRadius={scale(60)}
                    paddingBottom={scale(0)}
                    paddingHorizontal={scale(0)}
                    isBorderApply={selectedMachineType.item ? false : true}
                />
            </IconButtonContainer>
            <IconButtonContainer>
                <IconButtonWrapper
                    marginTop={Platform.OS === 'android' ? scaleHeight(25) : scaleHeight(25)}
                    marginRight={scaleWidth(10)}
                    size={scale(45)}
                    width={scale(45)}
                    icon={selectedMachineDifficulty.item ? selectedMachineDifficulty.item.imageUrl : null}
                    isUrl={selectedMachineDifficulty.index > 0 ? true : false}
                    backGroundColor={color.cornflowerBlue}
                    borderRadius={scale(60)}
                    paddingBottom={scale(0)}
                    paddingHorizontal={scale(0)}
                    isBorderApply={selectedMachineDifficulty.item ? false : true}
                />
            </IconButtonContainer>
        </SelectedIconWrapper>
    const renderIcon = ({ onPress, icon, text, isPadding, iconSize, backgroundColor, maginTop, isUrl, isBorderApply }) => {
        const isBorder = isBorderApply || (
            text === exploreArcade.exploreArcade && showMachineType)
            || (text === exploreArcade.selectDifficulty && !showMachineType);
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
                    isBorderApply={isBorder}
                />
                <IconBarText
                    alignCenter
                    color={color.white}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}
                    size={SIZE.XXXSMALL}
                    numberOfLines={2}
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
                    marginTop={Platform.OS === 'android' ? scaleHeight(30) : scaleHeight(10)}
                    size={scale(20)}
                    icon={arrowBack}
                    backGroundColor={color.governorBay}
                    borderRadius={scale(60)}
                    paddingBottom={scale(0)}
                    paddingHorizontal={scale(0)}
                    onPress={backToGameRoom}
                    isBorderApply={true}
                />
            </BackIconButtonContainer>
        )
    }

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
                                        marginTop={Platform.OS === 'android' ? scaleHeight(25) : scaleHeight(25)}
                                        size={30}
                                        icon={renderWIcon}
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
                            </IconBar>
                            <MachineTypesContiner>
                                <HeaderContainer>
                                    {renderSelectedIcon()}
                                </HeaderContainer>
                                <BannerWrapper>
                                    <Banner
                                        label={showMachineType ? exploreArcade.exploreArcade : exploreArcade.selectDifficulty}
                                        fontSize={15}
                                        width={screenWidth - scale(90)}
                                        bannerType={BANNER_TYPE.BLUE_BANNER}
                                        textSize={Platform.OS === 'ios' ? SIZE.NORMAL : SIZE.XXSMALL}
                                    />
                                </BannerWrapper>
                                {(machineTypes && showMachineType) && (
                                    <FlatList
                                        data={machineTypes}
                                        renderItem={({ item, index }) =>
                                            renderIcon({
                                                icon: item.imageUrl,
                                                text: item.name,
                                                isPadding: false,
                                                iconSize: scale(120),
                                                backgroundColor:
                                                    selectedMachineType?.index === index
                                                        ? color.gradientDarkBlue
                                                        : "transparent",
                                                maginTop: scale(0),
                                                isUrl: index !== 0,
                                                onPress: () => {
                                                    setSelectedMachineType({ item, index })
                                                },
                                                isBorderApply: true
                                            })}
                                        keyExtractor={item => String(item.id)}
                                        numColumns={2}
                                        columnWrapperStyle={flatListStyles.columnStyle}
                                        contentContainerStyle={flatListStyles.containerStyle}
                                        initialNumToRender={4}
                                    />
                                )}
                                {(MachineDifficulty && !showMachineType) && (
                                    <FlatList
                                        data={MachineDifficulty}
                                        renderItem={({ item, index }) =>
                                            renderIcon({
                                                icon: item.imageUrl,
                                                text: item.name,
                                                isPadding: false,
                                                iconSize: scale(120),
                                                backgroundColor: selectedMachineDifficulty?.index === index
                                                    ? color.gradientDarkBlue
                                                    : "transparent",
                                                maginTop: scale(0),
                                                isUrl: index !== 0,
                                                onPress: () => {
                                                    setSelectedMachineDifficulty({ item, index })
                                                },
                                                isBorderApply: true
                                            })}
                                        keyExtractor={item => String(item.id)}
                                        numColumns={2}
                                        columnWrapperStyle={flatListStyles.columnStyle}
                                        contentContainerStyle={flatListStyles.containerStyle}
                                        initialNumToRender={4}
                                    />
                                )}
                            </MachineTypesContiner>
                        </RowContainer>
                        <LoadingSpinner isLoading={isLoading} />
                        <BottomNavigator navigation={navigation}
                            setLoader={() => { setIsLoading(true) }}
                            dismissLoader={() => { setIsLoading(false) }}
                        />
                    </Container>
                </Background>
            </GeoRestrictedModal>
        </PopUpWrapper>
    );
};

ExploreArcade.propTypes = {
    navigation: PropTypes.shape({
        replace: PropTypes.func.isRequired,
        navigate: PropTypes.func.isRequired,
        dispatch: PropTypes.bool
    }).isRequired,
};

export default ExploreArcade;
