import React, { useState, useContext } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Platform, Animated } from 'react-native';
import IconButton from '../common/IconButton';
import { scaleHeight, scaleWidth } from '../../platformUtils';
import { plus, notificationOn, challengeIcon } from '../../../assets/images';
import ExpandedBottomNav from './ExpandedBottomNav';
import { UserContext } from '../../context/User.context';
import ChallengeModal from '../Challenges/ChallengeModal';


const BottomBar =
    styled.SafeAreaView`
  align-items: center;
  flex-direction: row;
  margin-bottom: ${Platform.OS === 'android' ? scaleHeight(8) : scaleHeight(8)};
  margin-top: ${Platform.OS === 'android' ? scaleHeight(5) : scaleHeight(5)};
`;


const BottomView = styled.View`
flex-direction:row;
width :100%;
justify-content:flex-end;
`;
const PlusButtonView = styled.View`
justify-content:center;
align-items:center;
width :20%;

`;
const ChallengeIconButtonView = styled.View`
justify-content:center;
align-items:flex-end;
width :40%;

`;
const PlusIconButtonWrapper = styled(IconButton)`
margin:0;
`;
const IconButtonWrapper = styled(IconButton)`
  margin: 0;
  margin-right:20%;
`;

const NotificationIcon = styled.Image`
position:absolute;
  right:${scaleWidth(80)};
  top:0;  
  z-index:1;
  margin-bottom:${scaleHeight(Platform.OS === 'android' ? 0 : 8)};
  height: ${Platform.OS === 'android' ? scaleHeight(15) : scaleHeight(12)};
  width: ${Platform.OS === 'android' ? scaleHeight(15) : scaleHeight(12)};
`;

const BottomNavigator = ({ navigation, setLoader, dismissLoader, setSidebarOpen, showLogout }) => {
    const { newsFeedCount, isPiggyBankFull } = useContext(UserContext);
    const [isExpandedNav, setIsExpandedNav] = useState(false);
    const [isCompressNav, setIsCompressNav] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const fadeAnim = React.useRef(new Animated.Value(0)).current;


    React.useEffect(() => {
        // eslint-disable-next-line no-use-before-define
        onLoad()
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [isExpandedNav])

    const onLoad = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };


    const renderNotificationIcon = () => {
        return (
            <Animated.View
                style={{
                    left: scaleWidth(120),
                    opacity: fadeAnim
                }}
            >
                <NotificationIcon source={notificationOn} />
            </Animated.View>
        )
    }
    const renderPlusIcon = () => {

        return (
            <BottomView>
                <PlusButtonView>
                    {(newsFeedCount > 0 || isPiggyBankFull) && renderNotificationIcon()}
                    <PlusIconButtonWrapper
                        size={45}
                        icon={plus}
                        onPress={() => {
                            setIsExpandedNav(true);
                            setIsCompressNav(false);
                        }}
                    />
                </PlusButtonView>
                <ChallengeIconButtonView>
                    <IconButtonWrapper
                        size={35}
                        icon={challengeIcon}
                        onPress={() => {
                            if (!setSidebarOpen) return setIsSidebarOpen(true)
                            setSidebarOpen()
                        }}
                    />
                </ChallengeIconButtonView>
            </BottomView>
        );

    }
    return (
        <>
            {isCompressNav && <BottomBar>
                {renderPlusIcon()}
            </BottomBar>}
            {isExpandedNav &&
                    <ExpandedBottomNav
                        navigation={navigation}
                        onPressClose={() => {
                            setIsExpandedNav(false);
                            setIsCompressNav(true)
                        }}
                        setLoader={() => { setLoader() }}
                        dismissLoader={() => { dismissLoader() }}
                    />
                    }

            {isSidebarOpen &&
                <ChallengeModal
                    showLogout={showLogout}
                    setSidebarOpen={setIsSidebarOpen}
                    isSidebarOpen={isSidebarOpen}
                    navigation={navigation}
                />}

        </>
    );
};
BottomNavigator.defaultProps = {
    setLoader: () => { },
    dismissLoader: () => { },
}

BottomNavigator.propTypes = {
    navigation: PropTypes.shape({
        replace: PropTypes.func.isRequired,
        navigate: PropTypes.func.isRequired
    }).isRequired,
    setLoader: PropTypes.func,
    dismissLoader: PropTypes.func,
};

export default BottomNavigator;
