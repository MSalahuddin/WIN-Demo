import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import Text, { SIZE, FONT_FAMILY } from './Text';
import { scaleHeight, scale } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings, commonStrings } from '../../stringConstants';
import StampPopUp from './StampPopUp';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import { iconTokenGrant, howtoBackgroundPopUp } from '../../../assets/images';
import {LOCAL_STORAGE_NAME} from '../../constants';
import api from '../../api';
import SimpleButton from './SimpleButton'



const LimitText = styled(Text)`
  color: ${color.darkGrey};
`

const PopUpContentView = styled.View`
  align-items: center;
  justify-content: center;
`;

const TextWrapper = styled(Text)`
  margin-top: ${({ marginTop }) => (marginTop ? scaleHeight(marginTop) : 0)};
  margin-bottom: ${({ marginBottom }) => (marginBottom ? scaleHeight(marginBottom) : 0)};
`;


const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  margin-top: ${Platform.OS === 'ios' ? scaleHeight(5) : 0};
`;

const ButtonWrapper = styled(SimpleButton)`
`;



const Limit = ({ day }) => (
  <LimitText size={SIZE.XXSMALL} >{`${commonStrings.day} ${day}`}</LimitText>
);

Limit.propTypes = {
  day: PropTypes.isRequired
};


const FreeTokenPopUp = ({
  isVisible,
  onPress,
  tokenGranted, 
}) => {
    
  const [isFreeTokenPopupVisible, setFreeTokenPopupVisible] = useState(false);
  // const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setFreeTokenPopupVisible(isVisible)
  }, [isVisible])


  const claimedBonusReward = async () => {
    onPress()
    await  AsyncStorage.removeItem(LOCAL_STORAGE_NAME.FREE_TOKEN_GIFT);
  }
  

  const claimBonusReward = async () => {
    try {
      const { tokenGrantId } = tokenGranted
      const res = await api.getAvailFreeTokens(tokenGrantId);
      if (res.status === 200 && res.data.status) {
        claimedBonusReward()
      }
      else{
        await  AsyncStorage.removeItem(LOCAL_STORAGE_NAME.FREE_TOKEN_GIFT);
      setFreeTokenPopupVisible(false)      
      }
    } catch (error) {
      // fail
      await  AsyncStorage.removeItem(LOCAL_STORAGE_NAME.FREE_TOKEN_GIFT);
      setFreeTokenPopupVisible(false)      
    }
  }



  return (
    <>
    {/* <InstructionPopUp
      isVisible={isFreeTokenPopupVisible}
      mascot={happyChicken}
      bannerLabel={popUpStrings.congratulations}
      buttonText={popUpStrings.awesome}
      icon={medalGold}
      onPress={()=> claimBonusReward()}
    >
        <CoinImage source={goldBarsPlus}/>

      <BackdropTextWrapper>
        <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.MEDIUM} color={color.black}>
          {tokenGranted && popUpStrings.freeTokenAward(tokenGranted.tokens)}
        </Text>
      </BackdropTextWrapper>


    </InstructionPopUp> */}
      <StampPopUp
        isVisible={isFreeTokenPopupVisible}
        backgroundImage={howtoBackgroundPopUp}
        stampIcon={iconTokenGrant}
      >
        <PopUpContentView>
        <TextWrapper
          fontFamily={FONT_FAMILY.BOLD}
          size={SIZE.XXLARGE}
          color={color.white}
        >
          {popUpStrings.congratulations}
        </TextWrapper>
        <TextWrapper
          marginTop={20}
          marginBottom={20}
          fontFamily={FONT_FAMILY.MEDIUM}
          size={SIZE.SMALL}
          color={color.white}
          alignCenter
          
        >
           {tokenGranted && popUpStrings.freeTokenAward(tokenGranted.tokens)}
        </TextWrapper>
        <ButtonWrapper
          testID="popup-button"
          borderRadius={44}
          marginTop={25}
          height={53}
          width={200}
          onPress={claimBonusReward}
          >
            <ButtonContentContainer>
                <ButtonText fontFamily={FONT_FAMILY.BOLD} color={color.darkNavyBlue} size={SIZE.LARGE}>
                   {popUpStrings.awesome}
                </ButtonText>
            </ButtonContentContainer>
          </ButtonWrapper>
        </PopUpContentView>
      </StampPopUp>
    </>
    );
    
};

FreeTokenPopUp.propTypes = {
  tokenGranted: PropTypes.shape({
    tokenGrantId:PropTypes.number.isRequired,
    tokens: PropTypes.number.isRequired
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired
};

export default FreeTokenPopUp;
