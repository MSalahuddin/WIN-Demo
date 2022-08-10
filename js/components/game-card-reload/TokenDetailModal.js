import React, { useContext } from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import { SafeAreaView,Platform} from 'react-native';
import PropTypes from 'prop-types';
import IconButton from '../common/IconButton';
import { closeBlack,star, coin } from '../../../assets/images';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import PopUpWrapper from '../common/PopUpWrapper';
import { scale, scaleHeight, scaleWidth, getWindowWidth } from '../../platformUtils';
import { color } from '../../styles';
import LevelProgressBar from '../common/LevelProgressBar';
import { accountProfileStrings,gameCardReloadStrings } from '../../stringConstants';
import Banner, { BANNER_TYPE } from '../common/Banner';
import { UserContext } from '../../context/User.context';


const StyledModal = styled(Modal)`
  background-color: ${({ backgroundColor }) => backgroundColor};
  margin: 0;
  justify-content: flex-start;
`;

const Header = styled.View`
  flex-direction: row;
  padding-horizontal: ${scale(24)};
  position: absolute;
  width: 100%;
  justify-content: flex-end;
  z-index: 1;
`;

const PrizeImage = styled.Image`
height: ${scaleHeight(308)};
width: 100%;
`;

const MissingImageView = styled.View`
  background-color: ${color.darkGrey};
  height: ${scaleHeight(308)};
  width: 100%;
`;

const ProgressBarView = styled.View`
justify-content:center;
align-items: center;
`;
const LevelProgressBarContainer = styled(LevelProgressBar)`
  margin-top: ${scaleHeight(16)};
  margin-horizontal: ${scale(10)};
`;




const PrizeText = styled(Text)`
font-weight:bold;
margin-top:${scaleWidth(Platform.OS==='android'?0:10)};
`;
const BonusDescription = styled.View`
  margin-top: ${scaleHeight(20)};
  background-color: ${color.darkerWhite};
  height: ${scaleHeight(50)};
  width: 100%;
  align-items: center;
  justify-content:center;
  padding-horizontal:${scaleWidth(40)};
  flex-direction:row;
`;

const Icon = styled.Image`
  height: ${scale(15)};
  width: ${scale(15)};
  margin-left: ${scale(10)};
  margin-right: ${scale(5)};
`;
const MainIcon = styled.Image`
  height: ${scale(15)};
  width: ${scale(15)};
  margin-left: ${scale(10)};
  margin-right: ${scale(5)};
`;
// scaleHeight(44) takes to half of play button
const FirstLayerBackground = styled.View`
  background-color: ${({ backgroundColor }) => backgroundColor};
  position: absolute;
  top: ${({ height }) => height + scaleHeight(44)};
  width: 100%;
  height: 100%;
`;

const VIPBannerContainer = styled(Banner)`
  margin-top: ${scaleHeight(8)};
  align-self: center;
  padding-top:${scaleHeight(Platform.OS==='android'?5:5)}
`;


const TokenDetailModal = ({ isVisible, setVisible, modalData, navigation }) => {

  const { isVip, vipLevel } = useContext(UserContext);
  const vipLevelId = vipLevel?.vipLevelId || 0;
  const vipBannerLabel = `${accountProfileStrings.vip} ${vipLevelId}`;
  const { imageUrl } = modalData;
  const tokenAmount = modalData?.tokenAmount || 0;
  const bonusTokenAmount = modalData?.bonusTokenAmount || 0;
  const vipLevelBonusPercent = vipLevel?.vipLevelBonusPercent || 0;
  const imageSource = imageUrl ? { uri: imageUrl } : null;
  const renderPrizeImage = () =>
    imageSource ? <PrizeImage source={imageSource} resizeMode="cover" /> : <MissingImageView />;
  const bannerWidth = getWindowWidth() - scale(20);
  return (
    <SafeAreaView>
      <StyledModal isVisible={isVisible} backgroundColor={color.white}>
        <PopUpWrapper navigation={navigation} onDismiss={() => setVisible(false)}>
          <FirstLayerBackground height={0} backgroundColor={color.white} />
          <Header>
            <IconButton testID="cancel-button" onPress={() => setVisible(false)} icon={closeBlack} size={32} />
          </Header>
          {renderPrizeImage()}
          <VIPBannerContainer bannerType={BANNER_TYPE.STAR} width={bannerWidth} label={vipBannerLabel} />
          <BonusDescription>
            <MainIcon source={coin} resizeMode="contain" />
            <PrizeText color={color.grayBlack} size={SIZE.XXXSMALL} fontFamily={FONT_FAMILY.REGULAR}>
              {vipLevelBonusPercent}%
          </PrizeText>
          
            <Icon source={star} resizeMode="contain" />
            <PrizeText color={color.grayBlack} size={SIZE.XXXSMALL} fontFamily={FONT_FAMILY.REGULAR}>
              {gameCardReloadStrings.tokenPurchaseBonus(tokenAmount,bonusTokenAmount)}
          </PrizeText>
          </BonusDescription>
          {isVip &&
            <ProgressBarView>
              <LevelProgressBarContainer />
            </ProgressBarView>
          }
      
        </PopUpWrapper>
      </StyledModal>
    </SafeAreaView>
  );
};

TokenDetailModal.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired
  }).isRequired,
  modalData: PropTypes.shape({
    imageUrl: PropTypes.string,
    tokenAmount: PropTypes.number.isRequired,
    bonusTokenAmount: PropTypes.number.isRequired
  }),
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

TokenDetailModal.defaultProps = {
  modalData: null
};

export default TokenDetailModal;
