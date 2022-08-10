import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import Text, { SIZE, FONT_FAMILY } from './Text';
import { scaleHeight, scale } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings, commonStrings } from '../../stringConstants';
import InstructionPopUp from './InstructionPopUp';
import { happyChicken, goldBarsPlus, medalGold } from '../../../assets/images';
import {LOCAL_STORAGE_NAME} from '../../constants';



const CoinImage = styled.Image`
  height: 95;
  width: 95;
  margin-vertical: ${scaleHeight(5)};
`;

const LimitText = styled(Text)`
  color: ${color.darkGrey};
`

const BackdropTextWrapper = styled.View`
  align-items: flex-start;
  margin-horizontal: ${scale(10)};
  margin-top: ${scaleHeight(24)};
`;





const GameStreakPopUp = ({
  isVisible,
  onPress,
  text
}) => {
    
  const [isFreeTokenPopupVisible, setFreeTokenPopupVisible] = useState(false);

  useEffect(() => {
    setFreeTokenPopupVisible(isVisible)
  }, [isVisible])

  const claimedBonusReward = async () => {
    onPress()
    await  AsyncStorage.removeItem(LOCAL_STORAGE_NAME.FREE_TOKEN_GIFT);
  }


  return (
    <>
    <InstructionPopUp
      isVisible={isFreeTokenPopupVisible}
      mascot={happyChicken}
      bannerLabel={popUpStrings.congratulations}
      buttonText={popUpStrings.claim}
      icon={medalGold}
      onPress={()=>claimedBonusReward()}
    >
        <CoinImage source={goldBarsPlus}/>

      <BackdropTextWrapper>
        <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.black}>
          {text}
        </Text>
      </BackdropTextWrapper>


    </InstructionPopUp>

    </>
    );
    
};
GameStreakPopUp.defaultProps={
  text:''
}
GameStreakPopUp.propTypes = {
  onPress: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  text:PropTypes.string
};

export default GameStreakPopUp;
