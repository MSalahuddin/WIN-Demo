import React, { useState } from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { SafeAreaView, Platform, FlatList } from 'react-native';
import Text, { SIZE, FONT_FAMILY } from './Text';
import Banner, { BANNER_TYPE } from './Banner';
import { scaleHeight, getWindowWidth, scale, scaleWidth, heightRatio } from '../../platformUtils';
import {flatListStyles, color } from '../../styles';
import { popUpStrings } from '../../stringConstants';
import PrizePopUpCard from './PrizePopupCard'

const StyledModal = styled(Modal)`
  align-items: center;
  background-color: ${color.popupOpaqueBlack};
  justify-content: flex-start;
  margin: 0;
`;

const Icon = styled.Image`
  height: ${scaleHeight(38)};
  width: ${scaleHeight(38)};
  margin-top: ${scaleHeight(20)};
  align-self: flex-end
`;

const IconWrapper = styled.TouchableOpacity`
  width:${getWindowWidth() - scaleWidth(50)};
`

const BannerWrapper = styled(Banner)`
  margin-top: ${scaleHeight(24)};
`;

const PrizePopUp = ({
  bannerLabel,
  icon,
  isVisible,
  isLowerCase,
  secondaryButtonOnPress,
  onPress,
  bannerType,
  prizeData,
}) => {
  // const [bannerPosition, setBannerPosition] = useState(0);

  const managePrize = (item) =>{
    const {prize, tokensCost } = item;  
    prizeData.item.prize = prize;
    prizeData.item.tokensCost = tokensCost;
    return prizeData?.item;
  }

  const renderPrizeCard = (item, index) =>{
    const {prize, tokensCost } = item;
    const { imageUrl , name } = prize;
    const isFree = prizeData?.item?.isFree
    return(
        <PrizePopUpCard
          image={imageUrl}
          Title={name}
          btnTxt={isFree ? popUpStrings.free : tokensCost}
          Detailedtext={name}
          onPress={() => onPress(managePrize(item))}
          isFree={isFree}
          data
      />
    )
  }


  return (
    <SafeAreaView>
      <StyledModal isVisible={isVisible}>
      <IconWrapper onPress={secondaryButtonOnPress}>
          <Icon source={icon} resizeMode="contain" />
      </IconWrapper>
      <BannerWrapper
        bannerType={bannerType}
        isLowerCase={isLowerCase}
        label={bannerLabel}
        textSize={SIZE.BANNER_LARGE}
        width={getWindowWidth() - scaleWidth(50)}
        // onLayout={event => {
        //   const { y } = event.nativeEvent.layout;
        //   setBannerPosition(y);
        // }}
      />

      <FlatList
        data={prizeData?.data}
        renderItem={({ item, index }) => renderPrizeCard(item, index)}
        keyExtractor={item => String(item.uniqueMachinePrizeId)}
        contentContainerStyle={flatListStyles.containerStyle}
        initialNumToRender={4}
      />
        
      </StyledModal>
    </SafeAreaView>
  );
};

PrizePopUp.defaultProps = {
  backdropText: '',
  children: null,
  textButtonLabel: '',
  textButtonOnPress: () => { },
  secondaryButtonText: popUpStrings.cancel,
  secondaryButtonOnPress: null,
  mascot: null,
  disabled: false,
  isLowerCase: false,
  mascotLeft: false,
  bannerType: BANNER_TYPE.NORMAL,
  prizeData:{}
};

PrizePopUp.propTypes = {
  backdropText: PropTypes.string,
  bannerLabel: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  children: PropTypes.node,
  isLowerCase: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]).isRequired,
  isVisible: PropTypes.bool.isRequired,
  textButtonLabel: PropTypes.string,
  textButtonOnPress: PropTypes.func,
  mascot: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]),
  mascotLeft: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]),
  onPress: PropTypes.func.isRequired,
  secondaryButtonText: PropTypes.string,
  secondaryButtonOnPress: PropTypes.func,
  disabled: PropTypes.bool,
  bannerType: PropTypes.string,
  prizeData: PropTypes.object.isRequired,
};

export default PrizePopUp;
