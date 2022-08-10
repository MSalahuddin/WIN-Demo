/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext } from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import Text, { SIZE } from './Text';
import TextButton from './TextButton';
import {scaleHeight, scale} from '../../platformUtils';
import { color } from '../../styles';
import { UserContext } from '../../context/User.context';

const StyledModal = styled(Modal)`
  align-items: center;
  background-color: ${color.popupBlack};
  justify-content: center;
  margin: 0;
`;
const Icon = styled.Image`
  height: ${scaleHeight(194)};
  width: ${scaleHeight(194)};
`;
const TextButtonWrapper = styled(TextButton)`
  color: ${color.white};
  text-decoration-color: ${color.white};
`;
const TextButtonContainer = styled.View`
  margin-top: ${scaleHeight(45)};
`;
const NotificationIcon = styled.ImageBackground`
  position:absolute;
  left:${scaleHeight(8)};
  top:${scaleHeight(16)};
  z-index:10;
  margin-bottom:${scaleHeight(Platform.OS === 'android' ? 0 : 8)};
  height: ${Platform.OS === 'android' ? scaleHeight(45) : scaleHeight(40)};
  width: ${Platform.OS === 'android' ? scaleHeight(45) : scaleHeight(40)};
  flex-direction:row;
`;
const NotificationText = styled(Text)`
  color: ${color.white};
  margin-top: ${Platform.OS === 'android'? 0: scale(8)};
  text-align:center;
  align-items: center;
  justify-content:center;
  align-self:center;
  width:100%;
`;

const FreePlayPopUp = ({
  icon,
  isVisible,
  useLater,
  notificationIcon,
  textButtonLabel,
  onPress,
}) => {
  const { getFreePlay } = useContext(UserContext);


  const handleModal = () => {
    useLater()
  }

  const renderTextButton = () => (
    <TextButtonContainer>
      <TextButtonWrapper testID="text-button" label={textButtonLabel} onPress={handleModal} />
    </TextButtonContainer>
  );

  return (
    <SafeAreaView>
      <StyledModal isVisible={isVisible} >
        <TouchableOpacity onPress={onPress}>
          <Icon source={icon} resizeMode="contain" />
          <NotificationIcon source={notificationIcon} resizeMode="cover" >
            <NotificationText size={SIZE.SMALL} >{getFreePlay}</NotificationText>
          </NotificationIcon>
        </TouchableOpacity>
        {!!textButtonLabel && renderTextButton()}
      </StyledModal>
    </SafeAreaView >

  );
};

FreePlayPopUp.defaultProps = {
  textButtonLabel: '',
  useLater: () => { },
  onPress: false
};

FreePlayPopUp.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]).isRequired,
  isVisible: PropTypes.bool.isRequired,
  notificationIcon: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]).isRequired,
  textButtonLabel: PropTypes.string,
  useLater: PropTypes.func,
  onPress: PropTypes.bool,
};

export default FreePlayPopUp;
