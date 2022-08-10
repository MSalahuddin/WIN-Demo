import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import { scaleHeight, scaleWidth } from '../../platformUtils';
import { color } from '../../styles';


const StyledModal = styled(Modal)`
  align-items: center;
  background-color: ${color.popupBlack};
  justify-content: center;
  margin: 0;
`;

const WrapperContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 90%;
`;

const BackgroundWrapper = styled.ImageBackground`
  align-items: center;
  justify-content: center;
  padding-bottom:${scaleHeight(50)};
  padding-top:${scaleHeight(80)};
  padding-horizontal: ${scaleWidth(30)};
  shadow-radius: 2px;
  width: 100%;
  z-index: -1;
`;

const Icon = styled.Image`
  height: 130;
  width: 130;
  z-index: 1;
  position: absolute;
  top: ${({ top }) => top - 65};
  `;



const StampPopUp = ({ isVisible, children, stampIcon, backgroundImage }) => {

    const [position, setPosition] = useState(0);

    return (
        <SafeAreaView>
            <StyledModal isVisible={isVisible}>
                <Icon top={position} source={stampIcon} />
                <WrapperContainer
                    onLayout={event => {
                        const { y } = event.nativeEvent.layout;
                        setPosition(y)
                    }} >
                    <BackgroundWrapper
                        source={backgroundImage}
                        resizeMode='stretch'
                    >
                        {children}
                    </BackgroundWrapper>
                </WrapperContainer>
            </StyledModal>
        </SafeAreaView>
    );
};

StampPopUp.propTypes = {
    isVisible: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    stampIcon: PropTypes.string.isRequired,
    backgroundImage: PropTypes.string.isRequired,

}

export default StampPopUp;
