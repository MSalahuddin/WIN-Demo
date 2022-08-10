import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import * as RNIap from 'react-native-iap';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import { popUpStrings } from '../../stringConstants';
import { refill } from '../../../assets/images';
import { LOCAL_STORAGE_NAME } from '../../constants';
import InstructionPopUp from './InstructionPopUp';
import Text, { SIZE, FONT_FAMILY } from './Text';
import { scale } from '../../platformUtils';



const BackdropTextWrapper = styled.View`
  align-items: center;
  margin-horizontal: ${scale(10)};
`;

const FreeTokensWrapper = styled.View`
  align-items: center;
  margin-vertical: ${scale(10)};
`;



const PurchasePrompt = ({ isVisible, data, onClose }) => {
  
    const [isPopUpVisible, setPopUpVisible] = useState(isVisible);

    useEffect(() => {
      setPopUpVisible(isVisible)
    }, [isVisible]);


    const requestPurchase = async (id) => {
        try {
          await RNIap.initConnection()
          await RNIap.requestPurchase(id,false);
        } catch (error) {
          // Error handled in purchase listener
        }
      }

    const removePurchasePrompt = async () => {
        await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.PURCHASE_PROMPT);
      }

    const onPress = async() => {
      await removePurchasePrompt()
      await requestPurchase(data.activeRefillTokenPackProductId)
    }

    const secondaryButtonOnPress  = async () => {
      setPopUpVisible(false)
      await onClose()
      removePurchasePrompt()
    }
    

    return (
        <InstructionPopUp
          isVisible={isPopUpVisible}
          buttonText={`${popUpStrings.Buy} ${data.localizedPrice}`}
          bannerLabel={popUpStrings.tokenRefillDeal}
          icon={refill}
          secondaryButtonOnPress={() => secondaryButtonOnPress()}
          onPress={() => onPress()}
        >
        <BackdropTextWrapper>
          <Text alignCenter size={SIZE.XSMALL} fontFamily={FONT_FAMILY.REGULAR} >
              {popUpStrings.lineOnePurchasePrompt}
            </Text>
            <Text alignCenter size={SIZE.XSMALL} fontFamily={FONT_FAMILY.REGULAR} >
              {popUpStrings.lineTwoPurchasePrompt}
            </Text>
            <FreeTokensWrapper>
              { data.extraToken &&
              <Text alignCenter size={SIZE.NORMAL} fontFamily={FONT_FAMILY.MEDIUM} >
                {popUpStrings.lineThreePurchasePrompt(data.extraToken)}
              </Text>
              }
            </FreeTokensWrapper>
            <Text alignCenter size={SIZE.XSMALL} fontFamily={FONT_FAMILY.REGULAR}>
              {popUpStrings.lineFourPurchasePrompt}
            </Text>
          </BackdropTextWrapper>
        </InstructionPopUp>
    )
}


PurchasePrompt.propTypes = {
  onClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    activeRefillTokenPackProductId: PropTypes.string,
    tokenAmount: PropTypes.number,
    extraToken: PropTypes.number,
    localizedPrice: PropTypes.string,
  }).isRequired
}

export default PurchasePrompt

