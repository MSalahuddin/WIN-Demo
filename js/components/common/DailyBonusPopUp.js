import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native'
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import Text, { SIZE, FONT_FAMILY } from './Text';
import { scaleHeight, scale, scaleWidth, heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings, commonStrings } from '../../stringConstants';
import { getPercentage, formatTokensLabel } from '../../utils';
import InstructionPopUpDark from './InstructionPopupdark';
import { happyChicken, dailyBonusCoin, medalGold,backGroundPiggyBank, DailyBonusHeader, inviteFriendBottomCoins,upRollToken, inviteFriendBackgroundTokenImage1, inviteFriendBackgroundTokenImage2,downToken } from '../../../assets/images';
import { LOCAL_STORAGE_NAME } from '../../constants';
import api from '../../api';







const LimitText = styled(Text)`
  color: ${color.darkGrey};
`
const BarText = styled(Text)`
  color: ${color.black};
`
const BackdropTextWrapper = styled.View`
  align-items: center;
  margin-horizontal: ${scale(10)};
  margin-top: ${scaleHeight(24)};
  margin-bottom: ${scaleHeight(14)};
`;


const DailyBonusTokenContainer = styled.View`
margin-top:${scaleHeight(0)}
flex-direction:row;
z-index:10
`;
const ContentView = styled.View`
flex-direction:column;

`;
const DailyBonusHeadingCoinLeft = styled.Image`
  height: ${scaleHeight(50)};
  margin-top:${scaleHeight(-10)};
  position:absolute;
  z-index:10;
  left:${scaleWidth(-90)}
  
`;
const DailyBonusHeadingCoinRight =Platform.OS==='android'? styled.Image`
  height: ${scaleHeight(140)};
  width: ${scaleHeight(140)};
  margin-top:${scaleHeight(-30)};
  position:absolute;
  z-index:10;
  right:${scaleWidth(-105)}
  
`:
styled.Image`
height: ${scaleHeight(heightRatio> 1 ?120:140)};
width: ${scaleHeight(heightRatio> 1 ?120:140)};
margin-top:${scaleHeight(-50)};
position:absolute;
z-index:10;
right:${scaleWidth(-95)}

`
;

const ProgressBar = styled.View`
  margin-top: ${Platform.OS === 'ios' ? scaleHeight(15) : scaleHeight(30)};
  background-color: ${color.PurpleProgress};
  border-radius: ${scale(20)};
  border-width:4;
  border-color:${color.borderBlue};
  height: 35;
  width: 80%;
`;
const DailyBonusTokenView = styled.View`
background-color:${color.tagBlue};
justify-content:center;
align-items:center;
width:${scaleWidth(200)};
border-radius:${scale(45)};
`;
const DailyBonusTokens = styled(Text)`
  margin-top: ${scale(13)};
  margin-bottom: ${scaleHeight(Platform.OS==='android'?14:7)};
`;

const Progress = styled(LinearGradient)`
  align-items: center;
  justify-content: center;
  border-radius: ${scale(14)};
  padding-top: ${Platform.OS === 'ios' ? '7' : '0'};
  height: 28;
  position: absolute;
  width: ${({ widthPercentage }) => widthPercentage}%;
`;
const HeadingTextWrapper = styled(Text)`
  margin-top: ${scaleHeight(0)};
  margin-bottom: ${scaleHeight(10)};
`;
const BottomCoinContainer =styled.View`
margin-vertical:${scale(10)};
flex-direction:column;
width:100%;
`;
const DailyBonusBottomCoinRight = styled.Image`
height: ${scaleHeight(40)};
width: ${scaleHeight(40)};
position:absolute;
top:${scaleHeight(-25)}
right:${scaleWidth(3)}

`;
const DailyBonusBottomCoinLeft = styled.Image`
height: ${scaleHeight(100)};
width: ${scaleHeight(100)};
position:absolute;
top:${scaleHeight(-25)}
left:${scaleWidth(-42)}

`;

const Limit = ({ day }) => (
  <LimitText size={SIZE.XSMALL} >{`${commonStrings.day} ${day}`}</LimitText>
);

Limit.propTypes = {
  day: PropTypes.isRequired
};


const DailyPopUp = ({
  isVisible,
  onPress,
  dailyBonus,
}) => {
  let widthPercentage = 0
  if (dailyBonus) {
    widthPercentage = getPercentage(1.428 * dailyBonus.rewardDays, 10);
  }

  const [isClaimPopUpVisible, setClaimPopUpVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);


  // initally props value is false
  // re render when its value is change

  useEffect(() => {
    setClaimPopUpVisible(isVisible)
  }, [isVisible]);


  const getDailyBonus = async () => {
    let retreivedailyBonus = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.DAILY_BONUS);
    retreivedailyBonus = await JSON.parse(retreivedailyBonus);
    return retreivedailyBonus
  }

  const claimedBonusRewardReset = (error = null) => {
    setClaimPopUpVisible(false)
    if (error === null) {
      onPress()
    }
  }

  const claimedBonusReward = async () => {
    await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.DAILY_BONUS);
    claimedBonusRewardReset()
  }

  const claimDailyBonusReward = async () => {
    setDisabled(true)
    const body = await getDailyBonus()
    try {
      const res = await api.postClaimDailyRewards(body);
      if (res.status === 200) {
        setClaimPopUpVisible(false)
        claimedBonusReward()
      }
    } catch (error) {
      // fail 
      claimedBonusRewardReset(error)
    }
  }


  return (
    <>
      <InstructionPopUpDark
        isVisible={isClaimPopUpVisible}
        sideCoin={downToken}
        bannerLabel={popUpStrings.dailyBonus}
        buttonText={popUpStrings.awesome}
        icon={DailyBonusHeader}
        disabled={disabled}
        backgroundImage={backGroundPiggyBank}
        onPress={() => claimDailyBonusReward()}
      >
        <DailyBonusTokenContainer>
          <DailyBonusHeadingCoinLeft source={inviteFriendBackgroundTokenImage1} resizeMode="contain" />
          <ContentView>
            <HeadingTextWrapper fontFamily={FONT_FAMILY.SEMI_BOLD}
              size={SIZE.LARGE} color={color.white} alignCenter>
              {popUpStrings.youveEarnedTokens}
            </HeadingTextWrapper>
            <DailyBonusTokenView>
              <DailyBonusTokens fontFamily={FONT_FAMILY.SEMI_BOLD}
                size={SIZE.NORMAL} color={color.gold} alignCenter >
                {dailyBonus && popUpStrings.HeadingOnePiggyBankAddToken(formatTokensLabel(dailyBonus.claimableTokens))}
              </DailyBonusTokens>
            </DailyBonusTokenView>
          </ContentView>
          <DailyBonusHeadingCoinRight source={inviteFriendBackgroundTokenImage2} resizeMode="contain" />
        </DailyBonusTokenContainer>
        <ProgressBar>
          <Progress colors={[color.goldentGradientLight, color.goldentGradientMid, color.goldentGradientDark]} widthPercentage={widthPercentage} >
            <BarText size={SIZE.SMALL} color={color.black} fontFamily={FONT_FAMILY.BOLD}>{dailyBonus && dailyBonus.rewardDays}</BarText>
          </Progress>
        </ProgressBar>
        <BackdropTextWrapper>
          <Text alignCenter size={SIZE.XSMALL} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
            {dailyBonus && popUpStrings.lineOneDailyBonus(dailyBonus.rewardDays)}
          </Text>
          <Text alignCenter size={SIZE.XSMALL} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
            {popUpStrings.lineTwoDailyBonus}
          </Text>
          <Text alignCenter size={SIZE.XSMALL} fontFamily={FONT_FAMILY.BOLD} color={color.white}>
            {popUpStrings.lineThreeDailyBonus}
          </Text>
        
        </BackdropTextWrapper>
        <BottomCoinContainer>
        <DailyBonusBottomCoinRight source={inviteFriendBackgroundTokenImage2} resizeMode="contain" />
          <DailyBonusBottomCoinLeft source={upRollToken} resizeMode="contain" />
        </BottomCoinContainer>
      </InstructionPopUpDark>
    </>
  );

};

DailyPopUp.propTypes = {
  dailyBonus: PropTypes.node.isRequired,
  onPress: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired
};

export default DailyPopUp;
