import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Text, { SIZE, FONT_FAMILY } from './Text';
import { scaleHeight, scale } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings } from '../../stringConstants';
import InstructionPopUp from './InstructionPopUp';
import { sadChicken } from '../../../assets/images';








const BackdropTextWrapper = styled.View`
  align-items: flex-start;
  margin-horizontal: ${scale(10)};
  margin-top: ${scaleHeight(0)};
`;







const MinPiggyBankPopup = ({
    isVisible,
    onPress,
    minToken
}) => {

    const [isFreeTokenPopupVisible, setFreeTokenPopupVisible] = useState(false);
    // const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setFreeTokenPopupVisible(isVisible)
    }, [isVisible])

    const ClosePop = async () => {
        onPress()
    }


    return (
        <>
            <InstructionPopUp
                isVisible={isFreeTokenPopupVisible}
                mascot={sadChicken}
                bannerLabel={popUpStrings.oops}
                buttonText={popUpStrings.gotIt}
                onPress={() => ClosePop()}
            >

                <BackdropTextWrapper>
                    <Text alignCenter size={SIZE.SMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.grayBlack}>
                        {popUpStrings.minPiggybank(minToken)}
                    </Text>
                </BackdropTextWrapper>


            </InstructionPopUp>

        </>
    );

};

MinPiggyBankPopup.propTypes = {

    onPress: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
    minToken:PropTypes.string.isRequired
};

export default MinPiggyBankPopup;
