/* eslint-disable no-nested-ternary */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Text, { SIZE, FONT_FAMILY } from './Text';
import { scale, scaleHeight, getWindowWidth, heightRatio } from '../../platformUtils';
import { coin } from '../../../assets/images';
import { color } from '../../styles';

const cardWidth = (getWindowWidth() - scale(50));
const tokenIconHeight = (cardWidth * 200) / 650;

const OuterContainer = styled.View`
width: ${cardWidth};
height:${tokenIconHeight - 7}
align-items: center;
align-self:center;
background-color:${color.prizePopupCardTextBackground};
border-radius: ${scale(8)};
margin-top: ${scale(10)};
`;

const Container = styled.View`
width:100%;
flex-direction:column;
`;


const ImageContainer = styled.ImageBackground`
  height: ${tokenIconHeight - 7};
  flex:1;
  border-bottom-left-radius: ${scale(5)};
  border-top-left-radius: ${scale(5)};
`;

const Icon = styled.Image`
  height: ${scaleHeight(24)};
  width: ${scaleHeight(24)};
`;


const CardInfo = styled.View`
height: ${tokenIconHeight - 7};
flex-direction:row;
`;
const CardInfoBox = styled.View`
flex-direction:row;
height: 100%;
flex:2.2;
`;

const ValueInfo = styled.View`
flex:1.2;
flex-direction:column;
justify-content:center;
background-color: ${color.skyDarkBlue};
`;



const ButtonContainer = styled.View`
align-items:center;
justify-content:center;
flex:1;
`;

const ButtonWrapper = styled.TouchableOpacity`
  width: ${cardWidth * 0.27};
  height: ${Platform.OS === 'android' ? heightRatio > 1 ? 35 : 37 : heightRatio > 1 ? 34 : 35}
  background-color: ${color.white};
  align-items: center;
  justify-content: center;
  border-radius: ${scale(40)};
`;

const SubButtonWrapper = styled.View`
flex-direction: row;
align-items: center;
width:${cardWidth*0.18};
justify-content: space-around;
`;


const CardTextContainer = styled.View`
  align-self:center;
  flex-direction: row;
  margin-top: ${({ marginTop }) => scaleHeight(marginTop)};
`;

const StyledText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(3)};
  margin-horizontal: ${scale(5)};
  text-align:center;
`;

const PaddedText = styled(Text)`
  text-align: center;
  top:${Platform.OS === 'android' ? 0 : 3}
`;



const PrizePopUpCard = (
  {
    image,
    Detailedtext,
    onPress,
    isDisabled,
    btnTxt,
    data,
    isFree
  }
) => {
  if (data) {
    return (
      <OuterContainer>
        <Container>
          <CardInfo>
            <ImageContainer source={{ uri : image}}
              // eslint-disable-next-line react-native/no-inline-styles
              imageStyle={{ borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
            </ImageContainer>
            <CardInfoBox>
              <ValueInfo>
                <CardTextContainer marginTop={0}>
                  <StyledText fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.XXXXSMALL} color={color.white}>
                    {Detailedtext}
                  </StyledText>
                </CardTextContainer>
              </ValueInfo>

              <ButtonContainer>
                <ButtonWrapper onPress={onPress} disabled={false} >
                  <SubButtonWrapper>
                     <PaddedText
                      fontFamily={FONT_FAMILY.BOLD}
                      color={color.black}
                      size={Platform.OS === 'android' ? SIZE.XSMALL : SIZE.SMALL}>
                      {btnTxt}
                    </PaddedText>
                    {!isFree && <Icon source={coin} resizeMode="contain" />}
                  </SubButtonWrapper>
                </ButtonWrapper>
              </ButtonContainer>
            </CardInfoBox>
          </CardInfo>
        </Container>

      </OuterContainer >
    );
  }
  return null;
};

PrizePopUpCard.defaultProps = {

  Detailedtext: '',
  infoPress: () => { },
  onPress: () => { },
  isDisabled: true,
  isFree: false,
  btnTxt: '',
};

PrizePopUpCard.propTypes = {
  image: PropTypes.string.isRequired,
  Detailedtext: PropTypes.string,
  onPress: PropTypes.func,
  isDisabled: PropTypes.bool,
  isFree: PropTypes.bool,
  btnTxt: PropTypes.string,
  data: PropTypes.node.isRequired,
};

export default PrizePopUpCard;
