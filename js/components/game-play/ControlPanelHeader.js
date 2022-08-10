import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Animated, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { getWindowHeight, scaleHeight, heightRatio, scale } from '../../platformUtils';
import { coin, howToIcon, tokensToPlayBackground, topPlayerIcon } from '../../../assets/images';
import { gameRoomStrings } from '../../stringConstants';
import { color } from '../../styles';
import { convertNumberToStringWithComma } from '../../utils';
import HowToPopUp from '../common/HowToPopUp';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import WatchAd from '../watch-ads/WatchAd';


const styles = StyleSheet.create({
  tokensToPlay: {
    position: 'absolute',
    right: 0
  },
  howTo: {
    position: 'absolute',
    width: 90,
    paddingVertical:10,
    justifyContent: 'space-between',
    backgroundColor:color.darkShadow,
    alignItems: 'center',
    borderTopRightRadius:20,
    left: -12
  }
})

const PrizeContainer = styled.View`
  justify-content: center;
  align-items: center;
  height: 66px;
  width: 62px;
  border-radius: 10;
  margin-top: 15;
  margin-bottom:-10;
`;

const ButtonText = styled(Text)`
  margin-top: ${({ marginTop }) => (marginTop)};
  margin-horizontal: ${({ marginHorizontal }) => (marginHorizontal)};
`;

const ContainerTokensToPlay = styled.ImageBackground`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: ${({ height }) => (height)};
  width: 160;
`;

const CoinIcon = styled.Image`
  height: 25;
  width: 25;
`;

const PrizeIcon = styled.Image`
  height: 55;
  width: 62;
  margin-bottom: 32;
  border-radius: 50; 
  border-color:red;
  border-width:2

`;

const TrophyIcon = styled.Image`
    height : 25;
    width: 25;
    position: absolute;
    top:-20;
    right:5
`;

const PlayContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: 66px;
  width: 62px;
  border-radius: 10;
  margin-top: 15;
`;

const InstructionIcon = styled.Image`
  height: 65;
  width: 62;
  border-top-left-radius: 10;
  border-top-right-radius: 10;
  margin-bottom: 3;
`;


const ControlPanelHeader = ({ isFree, prizeImageUrl, yAxis, tokensCost, helpText }, ref) => {
  const [positionYAxis, setPositionYAxis] = useState(0);
  const [howToWorkPopUpVisible, setHowToWorkPopUpVisible] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isShowAd, setShowAd] = useState(false)
  const tokensToPlayY = useRef(new Animated.Value(0)).current;
  const addToShow = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const howToLeft = useRef(new Animated.Value(0)).current;
  const playContainerHeight = 42



  const fadeOut = () => {
    setIsButtonDisabled(true)
    Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: 250,
      }
    ).start();
  }


  useEffect(() => {
    if (Number(yAxis) > 0) {
      setPositionYAxis(yAxis)
      tokensToPlayY.setValue(yAxis - playContainerHeight)
      addToShow.setValue(yAxis - 180)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
      }).start();
      howToLeft.setValue(10)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yAxis])

  useImperativeHandle(ref, () => ({
    hideComponents: () => {
      fadeOut();
    },
    hideAdComponent: (isShowAdBool) => {
      setShowAd(isShowAdBool)
    }
  }));

  const onPress = () => {
    isButtonDisabled ? null : setHowToWorkPopUpVisible(true)
  }

  const onGotItPress = () => {
    setHowToWorkPopUpVisible(false)
  }

  return <>
    <Animated.View
      style={[
        styles.howTo,
        {
          // Bind opacity to animated value
          bottom: ((getWindowHeight() - positionYAxis)),
          transform: [{ translateX: howToLeft }],
          opacity: fadeAnim
        }
      ]}
    >
      <PlayContainer onPress={onPress} >
        <InstructionIcon source={howToIcon} />
      </PlayContainer>
      <PrizeContainer>
        <PrizeIcon source={{ uri: prizeImageUrl }} />
        <TrophyIcon source={topPlayerIcon}/>
      </PrizeContainer>
    </Animated.View>
    <Animated.View
      style={[
        styles.tokensToPlay,
        {
          transform: [{ translateY: tokensToPlayY }],
          opacity: fadeAnim
        }
      ]}
    >
      <ContainerTokensToPlay
        height={playContainerHeight}
        resizeMode={'stretch'}
        source={tokensToPlayBackground}>
        <ButtonText
          size={SIZE.LARGE}
          color={color.white}
          fontFamily={FONT_FAMILY.BOLD}
          marginTop={Platform.OS === 'ios' ? 10 : 0}
          marginHorizontal={20}
        >
          {isFree ? gameRoomStrings.free : convertNumberToStringWithComma(tokensCost)}
        </ButtonText>
        <CoinIcon source={coin} resizeMode="contain" />
      </ContainerTokensToPlay>
    </Animated.View>
    <Animated.View
      style={[
        styles.tokensToPlay,
        {
          transform: [{ translateY: addToShow }],
          opacity: fadeAnim
        }
      ]}
    >
      {!!isShowAd && <WatchAd gamePlayCard={true} />}
    </Animated.View>
    <HowToPopUp
      isVisible={howToWorkPopUpVisible}
      onGotItPress={onGotItPress}
      helpText={helpText} />
  </>
}

ControlPanelHeader.propTypes = {
  isFree: PropTypes.string.isRequired,
  prizeImageUrl: PropTypes.string.isRequired,
  yAxis: PropTypes.number.isRequired,
  tokensCost: PropTypes.number.isRequired,
  helpText: PropTypes.string.isRequired
}


const ControlPanelHeaderForwardRef = forwardRef(ControlPanelHeader);


export default ControlPanelHeaderForwardRef
