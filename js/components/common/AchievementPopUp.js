import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { SafeAreaView,Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Text, { SIZE, FONT_FAMILY } from './Text';
import Button, { BUTTON_COLOR_SCHEME } from './Button';
import Banner from './Banner';
import { scaleHeight, getWindowWidth, scale, scaleWidth } from '../../platformUtils';
import { color } from '../../styles';
import { popUpStrings } from '../../stringConstants';
import { balloonFloat, goldStar } from '../../../assets/images';
import { LOCAL_STORAGE_NAME } from '../../constants';

const Backdrop = styled.View`
  align-items: center;
  background-color: ${color.white};
  border-bottom-left-radius: ${scaleHeight(8)};
  border-bottom-right-radius: ${scaleHeight(8)};
  justify-content: flex-start;
  margin-top: ${-scaleHeight(20)};
  padding-bottom: ${scaleHeight(60)};
  padding-top: ${scaleHeight(40)};
  shadow-color: ${color.blackShadow};
  shadow-offset: 4px 4px;
  shadow-opacity: 1;
  shadow-radius: 2px;
  width: 80%;
  z-index: -1;
`;

const BalloonThread = styled.View`
  border-left-width: 1;
  border-color: ${color.white};
  height: ${scaleHeight(32)};
`;

const BalloonView = styled.View`
  align-items: center;
  margin-right: ${scaleWidth(24)};
`;

const ButtonContentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonWrapper = styled(Button)`
  margin-top: ${({ marginTop }) => scaleHeight(marginTop)};
`;

const ButtonText = styled(Text)`
  margin-top: ${Platform.OS==='android'?scaleHeight(0):scaleHeight(7)};
`;

const GoldStarEllipse = styled.View`
  align-items: center;
  background-color: ${color.yellowDark};
  border-radius: ${scaleHeight(9)};
  bottom: ${-scaleHeight(9)};
  height: ${scaleHeight(18)};
  justify-content: center;
  position: absolute;
  width: ${scaleHeight(40)};
`;

const GoldStarIcon = styled.ImageBackground`
  align-items: center;
  height: ${scaleHeight(80)};
  width: ${scaleHeight(80)};
`;

const MultipleAchievementsIcon = styled.ImageBackground`
  align-items: center;
  height: ${scaleHeight(Platform.OS==='android'?190:227)};
  justify-content: flex-end;
  margin-top: ${scaleHeight(5)};
  padding-bottom: ${scaleHeight(24)};
  width: ${scaleHeight(238)};
`;

const PointText = styled(Text)`
  color: ${color.white};
  padding-top: ${Platform.OS==='android'?scaleHeight(0):scaleHeight(4)};
`;

const PopUpContentView = styled.View`
  align-items: center;
  justify-content: center;
  padding-horizontal: ${scale(15)};
`;

const SingleAchievementIcon = styled.Image`
  height: ${scaleHeight(84)};
  width: ${scaleHeight(84)};
`;

const SingleAchievementIconContainer = styled.View`
  flex-direction: row;
  height: ${scaleHeight(116)};
  justify-content: center;
  margin-top: ${scaleHeight(101)};
  width: 100%;
`;

const StyledModal = Platform.OS==='android'? styled(Modal)`
align-items: center;
background-color: ${color.popupBlack};
justify-content: flex-start;
margin-top: 0;
margin-horizontal:0;
margin-bottom:10;
`:
styled(Modal)`
  align-items: center;
  background-color: ${color.popupBlack};
  justify-content: flex-start;
  margin: 0;
  margin-top: 2;
`;

const TextWrapper = styled(Text)`
  margin-horizontal: ${scale(28)};
  margin-top: ${scaleHeight(16)};
`;

const AchievementPopUp = ({ achievementData, isVisible, navigateToAchievements, dismissPopup }) => {
  const numberOfAchievements = achievementData.length;
  const hasMultipleAchievements = numberOfAchievements > 1;
  const { achievementDetails, achievementName, imageUrl } = achievementData[0];
  let rewardsToken = hasMultipleAchievements ? 0 : achievementDetails?.rewardTokens;
  let rewardPoints = hasMultipleAchievements ? 0 : achievementDetails?.rewardPoints;
 
  if (hasMultipleAchievements) {
    rewardPoints = achievementData.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.achievementDetails?.rewardPoints;
    }, 0);
  }
  if (hasMultipleAchievements) {
    rewardsToken = achievementData.reduce((accumulator, currentValue) => {
     
      return accumulator + currentValue.achievementDetails?.rewardTokens;
    }, 0);
  }
  const achievementText = hasMultipleAchievements
    ? popUpStrings.unlockedAchievements(numberOfAchievements)
    : popUpStrings.congratulations;
  const achievementSubtext = hasMultipleAchievements
    ? popUpStrings.achievementUnlockedMultiple(rewardPoints)
    : popUpStrings.achievementUnlockedOne(rewardPoints);
  const rewardTokenTxt = popUpStrings.rewardTokenTxt(rewardsToken);
  const renderGoldStar = () => {
    return (
      <GoldStarIcon source={goldStar} resizeMode="contain">
        <GoldStarEllipse>
          <PointText size={SIZE.XXSMALL}>{popUpStrings.xPoints(rewardPoints)}</PointText>
        </GoldStarEllipse>
      </GoldStarIcon>
    );
  };
  const renderIcon = () => {
    if (!hasMultipleAchievements) {
      return (
        <SingleAchievementIconContainer>
          <BalloonView>
            <SingleAchievementIcon source={{ uri: imageUrl }} resizeMode="contain" />
            <BalloonThread />
          </BalloonView>
          {renderGoldStar()}
        </SingleAchievementIconContainer>
      );
    }
    return (
      <MultipleAchievementsIcon source={balloonFloat} resizeMode="contain">
        {renderGoldStar()}
      </MultipleAchievementsIcon>
    );
  };

  const deleteAchievementOnDevice = () => {
    AsyncStorage.removeItem(LOCAL_STORAGE_NAME.ACHIEVEMENTS);
  };

  return (
    <SafeAreaView>
      <StyledModal isVisible={isVisible}>
        {renderIcon()}
        <Banner
          label={hasMultipleAchievements ? popUpStrings.wow : achievementName}
          textSize={SIZE.BANNER_LARGE}
          width={getWindowWidth() - scaleWidth(5)}
        />
        <Backdrop>
          <PopUpContentView>
            <Text size={SIZE.NORMAL} color={color.grayBlack} alignCenter isUppercase={!hasMultipleAchievements}>
              {achievementText}
            </Text>
            <TextWrapper fontFamily={FONT_FAMILY.REGULAR} size={SIZE.SMALL} color={color.grayBlack} alignCenter>
              {achievementSubtext}
            </TextWrapper>
            <TextWrapper fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XSMALL} color={color.grayBlack} alignCenter>
            {popUpStrings.rewardTxt}
            <Text size={SIZE.XSMALL} color={color.grayBlack} alignCenter isUppercase={!hasMultipleAchievements}>
            {rewardTokenTxt}
            </Text>
            {popUpStrings.freeTokenTxt}
            </TextWrapper>
          </PopUpContentView>
        </Backdrop>
        <ButtonWrapper
          testID="achievement-popup-button"
          borderRadius={44}
          height={88}
          width={271}
          theme={BUTTON_COLOR_SCHEME.GREEN}
          onPress={() => {
            deleteAchievementOnDevice();
            navigateToAchievements();
          }}
          marginTop={-46}
        >
          <ButtonContentContainer>
            <ButtonText color={color.white} size={SIZE.XLARGE}>
              {popUpStrings.viewAchievements}
            </ButtonText>
          </ButtonContentContainer>
        </ButtonWrapper>
        <ButtonWrapper
          testID="achievement-cancel-button"
          borderRadis={32}
          height={64}
          width={207}
          theme={BUTTON_COLOR_SCHEME.PURPLE}
          onPress={() => {
            deleteAchievementOnDevice();
            dismissPopup();
          }}
          marginTop={16}
        >
          <ButtonContentContainer>
            <ButtonText color={color.white} size={SIZE.SMALL}>
              {popUpStrings.backToGameRoom}
            </ButtonText>
          </ButtonContentContainer>
        </ButtonWrapper>
      </StyledModal>
    </SafeAreaView>
  );
};

AchievementPopUp.propTypes = {
  achievementData: PropTypes.arrayOf(
    PropTypes.shape({
      achievementDetails: PropTypes.shape({
        rewardPoints: PropTypes.number
      }),
      achievementName: PropTypes.string,
      imageUrl: PropTypes.string
    })
  ).isRequired,
  isVisible: PropTypes.bool.isRequired,
  navigateToAchievements: PropTypes.func.isRequired,
  dismissPopup: PropTypes.func.isRequired
};

export default AchievementPopUp;
