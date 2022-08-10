/* eslint-disable no-nested-ternary */
import React, { useContext } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { NavigationActions, StackActions } from 'react-navigation';
import { Platform } from 'react-native'
import Ellipse from './Ellipse';
import { color } from '../../styles';
import IconButton from './IconButton';
import ProfileIconButton from './ProfileIconButton';
import { UserContext } from '../../context/User.context';
import { scale, scaleHeight, scaleWidth } from '../../platformUtils';
import { coin, ticket, redBack, gearBorderless } from '../../../assets/images';
import { Win_demoWIcon } from '../../../assets/svgs';
import { SCREENS } from '../../constants';
const Header =
  styled.SafeAreaView`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-horizontal: ${scaleWidth(Platform.OS === 'android' ? 0 : 16)};
  margin-bottom: ${Platform.OS === 'android' ? scaleHeight(10) : scaleHeight(24)};
  margin-top: ${Platform.OS === 'android' ? scaleHeight(27) : scaleHeight(10)};
`;

const BackButton = styled(IconButton)`
  margin-top: 0;
`;

const IconButtonWrapper = styled(IconButton)`
  margin-left: ${Platform.OS === 'android' ? scaleWidth(8) : 0};
  margin-top: 0;
`;
const ProfileIconWrapper = styled(ProfileIconButton)`
margin-left: ${Platform.OS === 'android' ? scaleWidth(8) : 0};
margin-top: 0;
`;


const ProfileHeader = ({ navigation, isProfileImageShown }) => {
  const {
    tokens,
    tickets,
    vipLevel,
    profilePicture,
    isFreePlayHeaderIconNotificationVisible,
    totalFreePlays,
    setFreePlayHeaderNotificationVisible,
    FreePlayStatus,
    liveArcade
  } = useContext(UserContext);

  const vipLevelId = vipLevel?.vipLevelId || 0;
  const imageSource = profilePicture ? { uri: profilePicture } : null;
  const { navigate } = navigation;

  const profileIconOnPress = () => {
    navigate(SCREENS.ACCOUNT_PROFILE);
  };

  const renderIcon = () => {
    return (
      <Win_demoWIcon
        width={Platform.OS === 'android' ? 25 : 30}
        height={Platform.OS === 'android' ? 25 : 30}
      />
    )
  }

  const renderFirstIcon = () => {
    const routeName = navigation?.state?.routeName;
    if (isProfileImageShown) {
      return (
        <IconButtonWrapper
          size={Platform.OS === 'android' ? 25 : 30}
          icon={renderIcon}
          backGroundColor={color.governorBay}
          borderRadius={scale(50)}
          paddingVertical={scale(8)}
          paddingHorizontal={scale(8)}
          onPress={() => {

            const resetAction = routeName === SCREENS.DIGITAL_GAME_ROOM ?
              StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: SCREENS.GAME_ROOM })]
              }) : StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: SCREENS.DIGITAL_GAME_ROOM })]
              });
            navigation.dispatch(resetAction);

            const navigate = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: SCREENS.DIGITAL_GAME_ROOM })]
            });
            navigation.dispatch(liveArcade ? resetAction : navigate);

          }}
          isSvg
        />
      );
    }
    return (
      <BackButton
        testID="back-button"
        onPress={() => {
          navigation.goBack();
        }}
        icon={redBack}
      />
    );
  };
  const handleOnPress = () => {
    navigate(SCREENS.GAME_CARD_RELOAD)
    setFreePlayHeaderNotificationVisible(false)
  }
  return (
    <>
      <Header>
        {renderFirstIcon()}
        {Platform.OS === "android" ? <Ellipse
          testID="coin-button"
          width={!vipLevel ? scaleWidth(110) : scaleWidth(93)}
          borderRadius={44}
          icon={coin}
          amount={tokens}
          freePlay={totalFreePlays}
          freePlayNotification={isFreePlayHeaderIconNotificationVisible}
          isPlusPresent
          onPress={handleOnPress}
          freePlayStatus={FreePlayStatus}
        />
          :
          <Ellipse
            testID="coin-button"
            width={95}
            borderRadius={44}
            icon={coin}
            amount={tokens}
            freePlay={totalFreePlays}
            freePlayNotification={isFreePlayHeaderIconNotificationVisible}
            isPlusPresent
            onPress={handleOnPress}
            freePlayStatus={FreePlayStatus}
          />}
        {Platform.OS === "android" ?
          <Ellipse
            testID="ticket-button"
            width={!vipLevel ? scaleWidth(100) : scaleWidth(85)}
            borderRadius={44}
            icon={ticket}
            amount={tickets}
            onPress={() => {
              navigate(SCREENS.WINNERS_CIRCLE);
            }}
          />
          : <Ellipse
            testID="ticket-button"
            width={88}
            borderRadius={44}
            icon={ticket}
            amount={tickets}
            onPress={() => {
              navigate(SCREENS.WINNERS_CIRCLE);
            }}
          />}

        {!vipLevel ?
          (
            <>
              {imageSource && <ProfileIconWrapper size={40} icon={imageSource} onPress={() => profileIconOnPress()} />}
              {!imageSource &&
                <ProfileIconWrapper size={40} icon={gearBorderless} onPress={() => profileIconOnPress()} />}
            </>
          )
          : (
            <Ellipse
              width={Platform.OS === 'android' ? scaleWidth(76) : 88}
              borderRadius={44}
              icon={imageSource}
              vipLevelId={vipLevelId}
              isIconAlignedRight
              onPress={() => {
                profileIconOnPress();
              }}
            />
          )}
      </Header>
    </>
  );
};

ProfileHeader.propTypes = {
  isProfileImageShown: PropTypes.bool,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  }).isRequired
};

ProfileHeader.defaultProps = {
  isProfileImageShown: false
};

export default ProfileHeader;
