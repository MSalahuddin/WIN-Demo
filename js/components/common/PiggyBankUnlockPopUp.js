import React,{useContext} from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import { SafeAreaView, Platform } from 'react-native';
import { UserContext } from '../../context/User.context';
import Text, { SIZE, FONT_FAMILY } from './Text';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import Banner from './Banner';
import { scaleHeight, getWindowWidth, scale, scaleWidth } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings } from '../../stringConstants';
import { piggyBankBallon, piggyBank } from '../../../assets/images';
import TextButton from './TextButton'
import api from '../../api';
import { LOCAL_STORAGE_NAME } from '../../constants';


const Backdrop = styled.View`
  align-items: center;
  background-color: ${color.white};
  border-bottom-left-radius: ${scaleHeight(8)};
  border-bottom-right-radius: ${scaleHeight(8)};
  justify-content: flex-start;
  margin-top: ${-scaleHeight(20)};
  padding-bottom: ${scaleHeight(50)};
  padding-top: ${scaleHeight(10)};
  shadow-color: ${color.blackShadow};
  shadow-offset: 4px 4px;
  shadow-opacity: 1;
  shadow-radius: 2px;
  width: 80%;
  z-index: -1;
`;

const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonWrapper = styled(Button)`
  margin-top: ${({ marginTop }) => scaleHeight(marginTop)};
`;

const TextButtonWrapper = styled(TextButton)`
  margin-top: 20;
  color: ${color.white};
  text-decoration-color: ${color.white};

`;

const ButtonText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(7)};
`;


const MultipleAchievementsIcon = styled.ImageBackground`
  align-items: center;
  height: ${scaleHeight(227)};
  justify-content: flex-end;
  margin-top: ${scaleHeight(20)};
  padding-bottom: ${scaleHeight(24)};
  width: ${scaleHeight(238)};
`;


const PopUpContentView = styled.View`
  align-items: center;
  justify-content: center;
`;


const StyledModal = styled(Modal)`
  align-items: center;
  background-color: ${color.popupBlack};
  justify-content: flex-start;
  margin: 0;
`;

const ImageContainer = styled.Image`
  width: 150;
  height: 150;
`

const TextWrapper = styled(Text)`
  margin-horizontal: ${scale(28)};
`;

const PiggyBankUnlockPopUp = ({ data, isVisible, onClose, onUnlock, userNotLoggedIn }) => {

  const { isUserLoggedIn } = useContext(UserContext);



  const removePiggyBank = async ()=>{
    await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.PIGGY_BANK_STATUS);
    onUnlock()
  }

  const unlockPiggyBack = async() => {
    try {
      const res = await api.postPiggyBankUnlock();
      if (res.status === 200) {
        await removePiggyBank()
      }
    } catch (error) {
      // fail 
      // onClose()
    }
  }

  const onUnlockPress = async() => {
    if (!isUserLoggedIn) {
      userNotLoggedIn();
    } else {
      unlockPiggyBack()
    }
  }


  return (
    <SafeAreaView>
      <StyledModal isVisible={isVisible}>
        <MultipleAchievementsIcon source={piggyBankBallon} resizeMode="contain" />
        <Banner
          label={popUpStrings.piggyBank}
          textSize={SIZE.BANNER_LARGE}
          width={getWindowWidth() - scaleWidth(5)}
        />
        <Backdrop>
          <PopUpContentView>
            <ImageContainer source={piggyBank} />
            <TextWrapper fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XSMALL} color={color.grayBlack} alignCenter>
              {popUpStrings.lineOnePiggyBank}
            </TextWrapper>
            <TextWrapper fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XSMALL} color={color.grayBlack} alignCenter>
              { data && popUpStrings.lineTwoPiggyBank(data.tokenPercent)}
            </TextWrapper>
          </PopUpContentView>
        </Backdrop>
        <ButtonWrapper
          borderRadius={44}
          height={88}
          width={271}
          theme={BUTTON_COLOR_SCHEME.GREEN}
          onPress={() => onUnlockPress()}
          marginTop={-46}
        >
          <ButtonContentContainer>
            <ButtonText color={color.white} size={SIZE.XLARGE}>
              {data && popUpStrings.gotIt}
            </ButtonText>
          </ButtonContentContainer>
        </ButtonWrapper>
        <TextButtonWrapper
          isUnderlined
          label={popUpStrings.noThanksWithExclamationMark}
          onPress={onClose}
        />
      </StyledModal>
    </SafeAreaView>
  );
};

PiggyBankUnlockPopUp.propTypes = {
  data: PropTypes.node.isRequired, 
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUnlock: PropTypes.func.isRequired,
  userNotLoggedIn: PropTypes.func.isRequired,
  
};

export default PiggyBankUnlockPopUp;
