import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Text, { SIZE, FONT_FAMILY } from './Text';
import { scaleHeight, scale } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings } from '../../stringConstants';
import InstructionPopUp from './InstructionPopUp';
import { happyChicken, goldBarsPlus, medalGold } from '../../../assets/images';




const CoinImage = styled.Image`
  height: 95;
  width: 95;
  margin-vertical: ${scaleHeight(5)};
`;



const BackdropTextWrapper = styled.View`
  align-items: flex-start;
  margin-horizontal: ${scale(10)};
  margin-top: ${scaleHeight(24)};
`;







const StackEmPopUp = ({
  isVisible,
  onPress,
  game,
  freeToken, 
}) => {
    
  const [isFreeTokenPopupVisible, setFreeTokenPopupVisible] = useState(false);
  // const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setFreeTokenPopupVisible(isVisible)
  }, [isVisible])

  const claimStackEm = async () => {
    onPress()
  }


  return (
    <>
    <InstructionPopUp
      isVisible={isFreeTokenPopupVisible}
      mascot={happyChicken}
      bannerLabel={popUpStrings.congratulations}
      buttonText={popUpStrings.awesome}
      icon={medalGold}
      onPress={()=>claimStackEm()}
    >
        <CoinImage source={goldBarsPlus}/>

      <BackdropTextWrapper>
        <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.black}>
          {popUpStrings.stackEmReward(freeToken,game)}
        </Text>
      </BackdropTextWrapper>


    </InstructionPopUp>

    </>
    );
    
};

StackEmPopUp.propTypes = {
  freeToken: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  game:PropTypes.number.isRequired
};

export default StackEmPopUp;
