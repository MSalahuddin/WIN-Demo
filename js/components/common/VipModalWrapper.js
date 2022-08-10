import React, { useState } from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import Text, { SIZE } from './Text';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import Banner, { BANNER_TYPE } from './Banner';
import { scaleHeight, getWindowWidth, scaleWidth, scale, heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import { accountProfileStrings } from '../../stringConstants';
import { medalStar, chickenWithBalloon } from '../../../assets/images';

const StyledModal = styled(Modal)`
  background-color: ${color.popupBlack};
  justify-content: center;
  margin: 0;
`;

const InnerModalContainer = styled.View`
  align-items: center;
`;

const StarIcon = styled.Image`
  height: ${scaleHeight(88)};
  margin-bottom: ${scaleHeight(24)};
  width: ${scaleHeight(88)};
`;

const mascotPositionVariation = heightRatio < 1 ? scaleHeight(75) : scaleHeight(52);
const ChickenImage = styled.Image`
  position: absolute;
  right: 0;
  top: ${({ top }) => scaleHeight(top) - mascotPositionVariation};
`;

const Backdrop = styled.View`
  align-items: center;
  background-color: ${color.white};
  border-bottom-left-radius: ${scaleHeight(8)};
  border-bottom-right-radius: ${scaleHeight(8)};
  height: ${({ height }) => scaleHeight(height)};
  justify-content: flex-start;
  margin-top: ${-scaleHeight(20)};
  padding-top: ${({ paddingTop }) => scaleHeight(paddingTop)};
  padding-horizontal: ${scale(28)};
  shadow-color: ${color.blackShadow};
  shadow-offset: 4px 4px;
  shadow-opacity: ${1};
  shadow-radius: 2px;
  width: 85%;
  z-index: -1;
`;

const ButtonWrapper = styled(Button)`
  margin-top: ${({ marginTop }) => scaleHeight(marginTop)};
`;

const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  margin-top: ${scaleHeight(7)};
`;

const VipModalWrapper = ({ isVisible, setVisible, children, showChicken, backdropHeight, backdropTopPadding }) => {
  const [bannerPosition, setBannerPosition] = useState(0);

  return (
    <StyledModal isVisible={isVisible} hideModalContentWhileAnimating>
      <InnerModalContainer>
        <StarIcon source={medalStar} resizeMode="contain" />
        <Banner
          bannerType={BANNER_TYPE.STAR}
          label={accountProfileStrings.vip}
          textSize={SIZE.BANNER_LARGE}
          width={getWindowWidth() - scaleWidth(32)}
        />
        <Backdrop
          height={backdropHeight}
          paddingTop={backdropTopPadding}
          onLayout={event => {
            const { y } = event.nativeEvent.layout;
            setBannerPosition(y);
          }}
        >
          {children}
        </Backdrop>
        <ButtonWrapper
          testID="dismiss-button"
          borderRadius={44}
          height={88}
          width={271}
          theme={BUTTON_COLOR_SCHEME.GREEN}
          onPress={setVisible}
          marginTop={-46}
        >
          <ButtonContentContainer>
            <ButtonText color={color.white} size={SIZE.XLARGE}>
              {accountProfileStrings.awesome}
            </ButtonText>
          </ButtonContentContainer>
        </ButtonWrapper>
      </InnerModalContainer>
      {showChicken && <ChickenImage source={chickenWithBalloon} resizeMode="contain" top={bannerPosition} />}
    </StyledModal>
  );
};

VipModalWrapper.defaultProps = {
  showChicken: false,
  backdropHeight: 177,
  backdropTopPadding: 40
};

VipModalWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  showChicken: PropTypes.bool,
  backdropHeight: PropTypes.number,
  backdropTopPadding: PropTypes.number
};

export default VipModalWrapper;
