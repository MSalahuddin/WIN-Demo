import React, { useRef, useContext, useState } from 'react';
import styled from 'styled-components/native';
import Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';

import RewardOption, { REWARD_TYPE } from './RewardOption';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import { getWindowWidth, scale, scaleHeight, heightRatio } from '../../platformUtils';
import { gameResultScreenStrings } from '../../stringConstants';
import { color } from '../../styles';
import { UserContext } from '../../context/User.context';
import { unavailable } from '../../../assets/images';
import SimpleButton from '../common/SimpleButton';
import CountdownTimer from '../common/CountdownTimer';

const CarouselContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: ${scaleHeight(190)};
  margin-top: ${scaleHeight(-50)};
`;

const screenWidth = getWindowWidth();

const LostContentContainer = styled.View`
  margin-top: ${scaleHeight(-80)};
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
`;

const LostImage = styled.Image`
  width: ${scale(48)};
  height: ${scale(48)};
  margin-top: ${heightRatio > 1 ? scaleHeight(45) : scaleHeight(45)};
  margin-bottom:${heightRatio > 1 ? scaleHeight(15) : scaleHeight(15)};
`;
const LowTokenImage = styled.Image`
  width: ${scale(55)};
  height: ${scale(55)};
  position:absolute;
  top:${scale(-10)};
  right:${scale(-10)};
`;

const RewardPrizeImage = styled.Image`
height: 130;
width: 130;
borderRadius: 40;
border-color:${color.white}


border-color:${color.white}
`;

const LostContentImageView = styled.View`
  justify-content: center;
  align-items: center;
  height: 120;
    width: 120;
  border-color:${color.white}
overflow:hidden;
  border-width:${scale(2)};
  borderRadius: 60;
 
`;
const LostTokenContainer = styled.View`
`
const ButtonWrapper = styled.View`
        height: ${scale(50)};
        width:  ${scale(130)};
        margin-top: ${scale(20)};
        border-radius: ${scale(30)};
        align-items: center;
        justify-content: center;
        background-color: ${color.PurpleProgress};
`;
const LostContentView = styled.View`
  justify-content: center;
  align-items: center;
  margin-top:${heightRatio > 1 ? scaleHeight(25) : scaleHeight(25)}
`;

const RewardSection = ({ isGameWon, lostMascot, rewardIndex, setRewardIndex, machineData, areTokenLow , setCountDownComplete}) => {
  const carouselRef = useRef();
  const { isUserLoggedIn } = useContext(UserContext);
  const { prizeDuration } = machineData;

  const { name, imageUrl, ticketsValue } = machineData.prize;
  const data = [{ prizeName: name, type: REWARD_TYPE.PRIZE, prizeImage: imageUrl }];
  // if (isUserLoggedIn) {
    // TODO: bonus point will come with VIP level
    data.push({ prizeName: '', type: REWARD_TYPE.TICKETS, ticketsValue });
  // }

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item: { prizeName, type, prizeImage }, index }) => (
    <RewardOption
      isActive={rewardIndex === index}
      prizeImage={prizeImage}
      prizeName={prizeName}
      ticketsValue={ticketsValue}
      type={type}
    />
  );

  if (isGameWon) {
    return (
      <CarouselContainer>
        <Text size={SIZE.SMALL} fontFamily={FONT_FAMILY.BOLD_ITALIC} color={color.white}>
          {gameResultScreenStrings.pickYourReward}
        </Text>
        <Carousel
          data={data}
          firstItem={0}
          inactiveSlideScale={1}
          itemWidth={scale(150)}
          sliderWidth={screenWidth}
          onSnapToItem={setRewardIndex}
          ref={carouselRef}
          containerCustomStyle={{ height: scaleHeight(160) }}
          renderItem={renderItem}
          useScrollView
        />
      </CarouselContainer>
    );
  }

  return (
    <LostContentContainer>
      <LostContentView>
        <Text alignCenter color={color.white} size={SIZE.BOLD_ITALIC}>{!areTokenLow ? gameResultScreenStrings.betterLuckNextTime : gameResultScreenStrings.tokenEndContent}</Text>
      </LostContentView>
   {  areTokenLow &&
     <ButtonWrapper>
      <CountdownTimer
            time={prizeDuration}
            size={SIZE.LARGEST}
            fontFamily={FONT_FAMILY.BOLD}
            color={color.warningRed}
            onTimerEnd={()=>{setCountDownComplete(true)}}
          />
      </ButtonWrapper>
    }
      <LostTokenContainer>
       <LostContentImageView>
          <RewardPrizeImage source={{uri:imageUrl}} resizeMode="contain" />
       </LostContentImageView>
          {areTokenLow && <LowTokenImage source={unavailable} resizeMode="contain" />}
      </LostTokenContainer>
      <LostImage source={lostMascot} resizeMode="contain" />
    </LostContentContainer>
  );
};

RewardSection.propTypes = {
  isGameWon: PropTypes.bool.isRequired,
  lostMascot: PropTypes.node.isRequired,
  rewardIndex: PropTypes.number.isRequired,
  setRewardIndex: PropTypes.func.isRequired,
  machineData: PropTypes.shape({
    prize: PropTypes.shape({
      imageUrl: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      ticketsValue: PropTypes.number.isRequired
    }).isRequired
  }).isRequired
};

export default RewardSection;
