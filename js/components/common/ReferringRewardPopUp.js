import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import Text, { SIZE, FONT_FAMILY } from './Text';
import { popUpStrings } from '../../stringConstants';
import InstructionPopUp from './InstructionPopUp';
import { iconRaf, wwVipChicken, happyChicken } from '../../../assets/images';
import { LOCAL_STORAGE_NAME } from '../../constants';
import { scale } from '../../platformUtils';
import { color } from '../../styles';


const BackdropTextWrapper = styled.View`
  align-items: center;
  justify-content: center;
  margin-vertical: ${scale(30)};
`;

export const modes = {
  SENDER: 'sender',
  RECEIVER: 'receiver'
};

const ReferringRewardPopUp = ({ isVisible, onPress, tokens, mode }) => {

const [isPopUpVisible, setPopUpVisible] = useState(isVisible);

  /* eslint-disable no-use-before-define */

  useEffect(() => {
    setPopUpVisible(isVisible);
  }, [isVisible]);

  const removeItem = () => {
    AsyncStorage.removeItem(LOCAL_STORAGE_NAME.REFERRER_DATA);
  }

  const onButtonPress = () => {
    removeItem()
    onPress()

  }
  const textButtonOnPress = () => {
    setPopUpVisible(false)
    removeItem()
  }
  const getButtonLabel = mode === modes.SENDER ? popUpStrings.referMoreFriends : popUpStrings.referFriendsNow;

  return (
    <>
      <InstructionPopUp
        isVisible={isPopUpVisible}
        mascot={happyChicken}
        mascotLeft={wwVipChicken}
        bannerLabel={popUpStrings.CONGRATS}
        buttonText={getButtonLabel}
        icon={iconRaf}
        textButtonLabel={popUpStrings.takeMeToGameRoom}
        onPress={() => onButtonPress()}
        textButtonOnPress={() => textButtonOnPress(false)}
      >
        <BackdropTextWrapper>
          <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.grayBlack}>
            {popUpStrings.referringRewardOne(tokens)}
          </Text>
          {mode === modes.SENDER && (
            <>
              <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.grayBlack}>
                {popUpStrings.referringRewardTwo}
              </Text>
            </>
          )}
          {mode === modes.RECEIVER && (
            <>
              <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.grayBlack}>
                {popUpStrings.referringRewardThree}
              </Text>
              <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.grayBlack}>
                {popUpStrings.referringRewardFour}
              </Text>
              <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.grayBlack}>
                {popUpStrings.referringRewardFive}
              </Text>
            </>
          )}
        </BackdropTextWrapper>
      </InstructionPopUp>
    </>
  );
};

ReferringRewardPopUp.propTypes = {
  onPress: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  tokens: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired
};

export default ReferringRewardPopUp;
