import React, { } from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import { SafeAreaView,Platform} from 'react-native';
import PropTypes from 'prop-types';
import IconButton from '../common/IconButton';
import { closeBlack, coin } from '../../../assets/images';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import PopUpWrapper from '../common/PopUpWrapper';
import { scale, scaleHeight, scaleWidth, getWindowWidth } from '../../platformUtils';
import { color } from '../../styles';
import { convertNumberToStringWithComma, capitalize } from '../../utils';
import { gameCardReloadStrings } from '../../stringConstants';
import Banner, { } from '../common/Banner';


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


// scaleHeight(44) takes to half of play button
const FirstLayerBackground = styled.View`
  background-color: ${({ backgroundColor }) => backgroundColor};
  position: absolute;
  top: ${({ height }) => height + scaleHeight(44)};
  width: 100%;
  height: 100%;
`;



const RowContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

const TokenTextContainer = styled.View`
  align-items: center;
  margin-bottom: ${scaleHeight(8)};
  margin-top: ${scaleHeight(22)};
`;

const TokenSection = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const IconTextRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin-top: ${scaleHeight(5)};
`;

const StyledImage = styled.Image`
  width: ${scale(18)};
  height: ${scale(18)};
  margin-right: ${scale(5)};
`;

const StyledText = styled(Text)`
  margin-top: ${scaleHeight(Platform.OS==='android' ? 0 : 3)};
`;
const SubscriptionPackModal = ({ isVisible, setVisible, modalData, navigation }) => {


  const { imageUrl,oneTimeTokenAmount, monthlyTokenAmount, name } = modalData;
  const sectionData = [
    { title: gameCardReloadStrings.tokensToday, token: convertNumberToStringWithComma(oneTimeTokenAmount) },
    {
      title: gameCardReloadStrings.monthlyTokens,
      token: convertNumberToStringWithComma(monthlyTokenAmount)
    }
  ];
  const imageSource = imageUrl ? { uri: imageUrl } : null;
  const renderPrizeImage = () =>
    imageSource ? <PrizeImage source={imageSource} resizeMode="cover" /> : <MissingImageView />;
  
  return (
    <SafeAreaView>
      <StyledModal isVisible={isVisible} backgroundColor={color.white}>
        <PopUpWrapper navigation={navigation} onDismiss={() => setVisible(false)}>
          <FirstLayerBackground height={0} backgroundColor={color.white} />
          <Header>
            <IconButton testID="cancel-button" onPress={() => setVisible(false)} icon={closeBlack} size={32} />
          </Header>
          {renderPrizeImage()}
          <TokenTextContainer>
        <Text color={color.silver} fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XXSMALL}>
          {`${capitalize(name)} ${gameCardReloadStrings.subscriptionPack}`}
        </Text>
      </TokenTextContainer>
      <RowContainer>
        {sectionData.map(({ title, token }, index) => (
          <TokenSection key={index}>
            <Text size={SIZE.XXSMALL}>{title}</Text>
            <IconTextRow>
              <StyledImage source={coin} resizeMode="contain" />
              <StyledText size={SIZE.XSMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.lightGrey}>
                {token}
              </StyledText>
            </IconTextRow>
          </TokenSection>
        ))}
      </RowContainer>
      
        </PopUpWrapper>
      </StyledModal>
    </SafeAreaView>
  );
};

SubscriptionPackModal.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired
  }).isRequired,
  modalData: PropTypes.shape({
    imageUrl: PropTypes.string.isRequired,
    monthlyTokenAmount: PropTypes.number.isRequired,
    oneTimeTokenAmount: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }),
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

SubscriptionPackModal.defaultProps = {
  modalData: null
};

export default SubscriptionPackModal;
