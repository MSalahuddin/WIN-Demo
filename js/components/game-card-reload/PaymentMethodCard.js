/* eslint-disable no-nested-ternary */
import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { Platform, Linking } from 'react-native';
import { PopupContext } from '../../context/Popup.context';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import api from '../../api';
import  { BUTTON_COLOR_SCHEME } from '../common/Button';
import { scale, getWindowWidth, scaleHeight, heightRatio } from '../../platformUtils';
import { color } from '../../styles';
import { plusGreenIcon } from '../../../assets/images';
import { gameCardReloadStrings } from '../../stringConstants';
import ViewGradient from '../common/GradientView';

// showing 2 cards per row minus padding 16 each side and between
const cardWidth = (getWindowWidth() - scale(55));
// the height should be proportional to the image size we get
const tokenIconHeight = (cardWidth * 200) / 800;

const Container = styled.TouchableOpacity`
  align-items: center;
  justify-content: flex-end;
  align-self:center;
  flex-direction:row;
  margin-top: ${scale(5)};
  margin-bottom: ${scale(5)};
  width: ${getWindowWidth() * 0.94};
  height:${tokenIconHeight};
`;

const CardView = styled.View`
  align-items: center;
  align-self: flex-end;
  flex-direction:row;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: ${scale(8)};
  shadow-color: ${color.blackShadow};
  shadow-offset: 2px 2px;
  shadow-opacity: ${1};
  shadow-radius: 1px;
  elevation: 8;
  width: ${cardWidth};
  height:${tokenIconHeight}
`;

const TextView = styled.View`
  flex: 3;
  justify-content:center;
  height:${tokenIconHeight};
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const ButtonView = styled.View`
  flex: 2.5;
  align-items:flex-start;
  justify-content:center;
  height:${tokenIconHeight};
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const InfoButton = styled.Image`
  position:absolute;
  left:0;
  elevation:9;
  height: ${({ size }) => scale(size)};
  width: ${({ size }) => scale(size)};
  z-index:100;
`;

const ContentText = styled(Text)`
  align-items: center;
  align-self:flex-end;
  width:${getWindowWidth() * 0.35};
`;

const ButtonText = styled(Text)`
  text-align:center;
  align-items: center;
`;

const ButtonWrapper = styled(ViewGradient)`
`;

const ButtonContentContainer = styled.View`
  align-items: center;
  justify-content: center;
  
`;


const PaymentMethodCard = () => {
  const { displayRequestError } = useContext(PopupContext);

  const paymentGateway = async () => {
    try {
      const response = await api.getPaymentGateway();
      if (response.status === 200 && response.data) {
        const { data } = response;
        Linking.openURL(`${data?.token}?platformID=${Platform.OS === "android" ? 1 : 2}`)
      }
    } catch (error) {
      displayRequestError(error?.message);
    }
  };

  return (
    <Container   activeOpacity={0.6}    onPress={paymentGateway}>
         <InfoButton source={plusGreenIcon} size={scale(68)} resizeMode="cover" />
      <CardView backgroundColor={color.leaderBoardcardBackgroundColor}>
      <TextView backgroundColor={color.leaderBoardcardBackgroundColor}>
        <ContentText fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.NORMAL} color={color.white}>
          {gameCardReloadStrings.wantMoreTickets}
        </ContentText>
      </TextView>
      <ButtonView backgroundColor={color.leaderBoardcardBackgroundColor}>
        <ButtonWrapper
          height={heightRatio > 1 ? scaleHeight(Platform.OS === 'android' ? 50 : 53) : scaleHeight(Platform.OS === 'android' ? 50 : 55)}
          width={getWindowWidth() * 0.35}
          borderRadius={Platform.OS === 'android' ? 26 : 35}
          theme={BUTTON_COLOR_SCHEME.GREEN}
         >
          <ButtonContentContainer>
            <ButtonText fontFamily={FONT_FAMILY.BOLD}  size={SIZE.XSMALL} color={color.white}>
            {gameCardReloadStrings.learnMore}
            </ButtonText>
          </ButtonContentContainer>
        </ButtonWrapper>
        </ButtonView>
      </CardView>
    </Container >
  );
};

// TokenCard.propTypes = {
//   imageUrl: PropTypes.string.isRequired,
//   tokenAmount: PropTypes.number.isRequired,
//   bonusTokenAmount: PropTypes.number,
//   onPress: PropTypes.func.isRequired,
//   isOnSale: PropTypes.bool.isRequired,
//   backgroundColor: PropTypes.string,
//   ribbonName: PropTypes.string,
//   ribbonColor: PropTypes.string,
//   iapData: PropTypes.PropTypes.shape({
//     localizedPrice: PropTypes.string
//   }).isRequired,
// };

// TokenCard.defaultProps = {
//   bonusTokenAmount: null,
//   backgroundColor: color.cyanBlue,
//   ribbonColor: '',
//   ribbonName: '',
// };

export default PaymentMethodCard;
