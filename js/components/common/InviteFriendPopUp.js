/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView, Platform, Modal, View } from 'react-native';
import PropTypes from 'prop-types';
import { GetSocial } from 'getsocial-react-native-sdk';
import IconButton from './IconButton';
import {
  ExitCircle,
  raf_icon,
  smsIcon,
  facebookIcon,
  more_icon,
  email_icon,
  onBoardingBackgroundImage,
  CenterCircleBackGround,
  inviteFriendBackgroundTokenImage1,
  inviteFriendBackgroundTokenImage2
} from '../../../assets/images';
import Text, { FONT_FAMILY, SIZE } from './Text';
import { scale, scaleHeight, scaleWidth, getWindowWidth, heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings, landingStrings } from '../../stringConstants';
import { CHANNELS, ANALYTICS_APPSFLYER_EVENTS, ANALYTICS_APPSFLYER_EVENTS_PARAMETER } from '../../constants'
import TextButton from './TextButton';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import { AFLogCustomEvent } from "../../appFlyer.utils";

const Icon = styled.Image`
margin-top: ${heightRatio > 1.1 ? scaleHeight(-75) : scaleHeight(-85)};
`;

const BackgroundCoinImage1 = styled.Image`
  height: ${scaleHeight(45)};
  margin-top:${scaleHeight(110)}
  left:${scaleWidth(-25)}
  position:absolute;  
`;

const BackgroundCoinImage7 = styled.Image`
  height: ${scaleHeight(80)};
  margin-top:${scaleHeight(20)}
  left:${scaleWidth(80)}
  position:absolute;  
`;

const BackgroundCoinImage8 = styled.Image`
  height: ${scaleHeight(25)};
  margin-top:${scaleHeight(20)}
  left:${scaleWidth(-50)}
  position:absolute;  
`;

const BackgroundCoinImage9 = styled.Image`
  height: ${scaleHeight(50)};
  top:${scaleHeight(-20)}
  left:${scaleWidth(120)}
  position:absolute;  
`;

const BackgroundCoinImage2 = styled.Image`
  height: ${scaleHeight(150)};
  top:${scaleHeight(30)}
  left:${scaleWidth(250)}
  position:absolute;  
`;

const BackgroundCoinImage10 = styled.Image`
  height: ${scaleHeight(35)};
  margin-top:${scaleHeight(80)}
  right:${scaleWidth(0)}
  position:absolute;

`;
const BackgroundCoinImage3 = styled.Image`
  position:absolute;
  height: ${scaleHeight(120)};
  margin-left:${heightRatio < 1.1 ? scaleHeight(200) : scaleHeight(185)};
  margin-top:${scaleHeight(-52)}
`;
const BackgroundCoinImage4 = styled.Image`
  height: ${scaleHeight(95)};
  left:${scaleWidth(-190)};
  position:absolute;
  top:${heightRatio > 0.9 ? scaleHeight(5) : scaleHeight(-12)}
`;
const BackgroundCoinImage5 = styled.Image`
  height: ${scaleHeight(85)};
  margin-top:${scaleWidth(-10)};
  margin-right:${scaleWidth(-250)};
`;

const BackgroundCoinImage6 = styled.Image`
  height: ${scaleHeight(150)};
  margin-top:${scaleWidth(140)};
  left:${scaleWidth(-80)};
  position:absolute;
`;

const Background = styled.ImageBackground`
  height: 100%;
  width: 100%;
  align-items: center;
`;

const Header = Platform.OS === 'android' ? styled.View`
  flex-direction: row;
  padding-horizontal: ${scale(24)};
  position: absolute;
  width: 100%;
  justify-content: flex-end;
  z-index: 1;
`: styled.View`
  flex-direction: row;
  padding-horizontal: ${scale(24)};
  position: absolute;
  top:${heightRatio < 1.1 ? scaleHeight(0) : scaleHeight(15)};
  width: 100%;
  justify-content: flex-end;
  z-index: 1;
`;

const BackgroundImage = styled.ImageBackground`
  margin-top:${scaleHeight(165)}
  align-items: center;
  padding-horizontal: ${scaleWidth(10)};
  border-radius:10
`;

const TextWrapper = styled.View`
  align-items: center;
  justify-content: center;
  padding-top: ${scaleHeight(10)};
  padding-bottom: ${heightRatio < 0.9 ? scaleHeight(2) : scaleHeight(15)};
  padding-horizontal: ${scaleWidth(40)};
`;
const TextTitleWrapper = styled.View`
  align-items: center;
  justify-content: center;
  padding-top: ${scaleHeight(5)};
  padding-bottom: ${heightRatio < 1 ? scaleHeight(0) : scaleHeight(5)};
  padding-horizontal: ${scaleWidth(10)};
`;

const ButtonWrapper = styled(Button)`
  margin-vertical: ${scaleHeight(10)};
`;

const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(-5) : scaleHeight(0)};
`;

const ChannelCardContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: ${scaleHeight(100)};
  padding-bottom: ${scale(20)}
  margin-bottom: ${scaleHeight(0)}
`;

const ChannelImage = styled.Image`
  height: ${scaleHeight(60)};
  width: ${scaleHeight(60)};
  margin-bottom: ${scaleWidth(2)};
`;

const ChannelCardRow = styled.View`
  flex-direction: row;
  margin-bottom: ${scaleHeight(0)};
`;

const FooterContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-top:${heightRatio < 1.1 ? scaleHeight(-15) : scaleHeight(-12)}
  
`;

const FooterLink = styled(TextButton)`
  margin-top: ${scale(30)};
  color: ${color.white};
  text-decoration-color: ${color.white};
`;

const ChannelCard = ({ onPress, source, label, disabled }) => {
  return (
    <ChannelCardContainer disabled={disabled} onPress={onPress}>
      <ChannelImage source={source} />
      <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
        {label}
      </Text>
    </ChannelCardContainer>
  );
};

ChannelCard.defaultProps = {
  disabled: false
};

ChannelCard.propTypes = {
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  source: PropTypes.node.isRequired,
  disabled: PropTypes.bool
};

const InviteFriendButton = ({ onPress, label }) => {
  return (
    <ButtonWrapper
      testID="popup-button"
      borderRadius={44}
      height={40}
      width={130}
      theme={BUTTON_COLOR_SCHEME.GREEN}
      onPress={onPress}
    >
      <ButtonContentContainer>
        <ButtonText color={color.white} size={SIZE.XLARGE}>
          {label}
        </ButtonText>
      </ButtonContentContainer>
    </ButtonWrapper>
  );
};

InviteFriendButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

const InviteFriendText = () => {
  return (
    <TextWrapper>
      <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
        {popUpStrings.referFriendOne}
      </Text>
      <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
        {popUpStrings.referFriendTwo}
      </Text>
      <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
        {popUpStrings.referFriendThree}
      </Text>
      <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
        {popUpStrings.referFriendFour}
      </Text>
    </TextWrapper>
  );
};

const InviteFriendTitle = () => {
  return (
    <TextTitleWrapper>
      <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.white}>
        {popUpStrings.referFriendScreenTitle}
      </Text>
    </TextTitleWrapper>
  );
};
const ReferAFriend = () => {
  return (
    <TextTitleWrapper>
      <Text alignCenter size={SIZE.XXLARGE} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
        {popUpStrings.referAFriend}
      </Text>
    </TextTitleWrapper>
  );
};

const InviteFriendPopUp = ({ isVisible, footerPress, onDissmiss, onShare }) => {
  const [facebookDisabled, setFacebookDisabled] = useState(true);
  const [smsDisabled, setSmsDisabled] = useState(true);
  const [emailDisabled, setEmailDisabled] = useState(true);
  const { more, email, facebook, sms } = CHANNELS

  const enableChannels = channels => {
    for (let i = 0; i < channels.length; i += 1) {
      const c = channels[i];
      if (c.channelId === email) {
        setEmailDisabled(false);
      }
      if (c.channelId === facebook) {
        setFacebookDisabled(false);
      } else if (c.channelId === sms) {
        setSmsDisabled(false);
      }
    }
  };

  const getChannels = async () => {
    const channels = await GetSocial.getInviteChannels();
    enableChannels(channels);
  };

  useEffect(() => {
    getChannels();
  }, []);

  const appsFlyerTracking = (channelId) => {
    AFLogCustomEvent(ANALYTICS_APPSFLYER_EVENTS.INVITE, {
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PLATFORM]: Platform.OS,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.CHANNEL]: channelId,
    });
  }

  const sendInvite = channelId => {
    onDissmiss()
    onShare(channelId);
    appsFlyerTracking(channelId);
  };

  return (
    <SafeAreaView>
      <Modal visible={isVisible}>
        <Background source={CenterCircleBackGround} resizeMode="stretch">
          <Header>

            <IconButton testID="cancel-button" onPress={onDissmiss} icon={ExitCircle} size={32} />
          </Header>
          <BackgroundCoinImage1 source={inviteFriendBackgroundTokenImage1} resizeMode="contain" />
          <BackgroundCoinImage7 source={inviteFriendBackgroundTokenImage1} resizeMode="contain" />
          <BackgroundCoinImage8 source={inviteFriendBackgroundTokenImage2} resizeMode="contain" />
          <BackgroundCoinImage2 source={inviteFriendBackgroundTokenImage1} resizeMode="contain" />

          <BackgroundImage source={onBoardingBackgroundImage} resizeMode="stretch">
            <Icon source={raf_icon} resizeMode="contain" />
            <ReferAFriend />
            <InviteFriendTitle />
            <BackgroundCoinImage6 source={inviteFriendBackgroundTokenImage1} resizeMode="contain" />
            <InviteFriendText />
            <ChannelCardRow>
              <ChannelCard onPress={() => sendInvite(more)} source={more_icon} label={popUpStrings.more} />
              <ChannelCard
                onPress={() => sendInvite(facebook)}
                disabled={facebookDisabled}
                source={facebookIcon}
                label={popUpStrings.facebook}
              />
              <BackgroundCoinImage3 source={inviteFriendBackgroundTokenImage1} resizeMode="contain" />
            </ChannelCardRow>
            <ChannelCardRow>
              <ChannelCard
                onPress={() => sendInvite(sms)}
                disabled={smsDisabled}
                source={smsIcon}
                label={popUpStrings.sms}
              />
              <ChannelCard
                onPress={() => sendInvite(email)}
                disabled={emailDisabled}
                source={email_icon}
                label={popUpStrings.email}
              />
            </ChannelCardRow>
          </BackgroundImage>
          <FooterContainer>
            <BackgroundCoinImage4 source={inviteFriendBackgroundTokenImage2} resizeMode="contain" />
            <FooterLink onPress={footerPress} label={landingStrings.termsAndConditions} />
            <BackgroundCoinImage5 source={inviteFriendBackgroundTokenImage1} resizeMode="contain" />
            <BackgroundCoinImage9 source={inviteFriendBackgroundTokenImage1} resizeMode="contain" />
            <BackgroundCoinImage10 source={inviteFriendBackgroundTokenImage1} resizeMode="contain" />
          </FooterContainer>
        </Background>
      </Modal>
    </SafeAreaView>
  );
};

InviteFriendPopUp.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  footerPress: PropTypes.func.isRequired,
  onDissmiss: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired
};

export default InviteFriendPopUp;
