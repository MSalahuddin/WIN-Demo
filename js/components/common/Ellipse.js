import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Text, { SIZE } from './Text';
import { color } from '../../styles';
import { scale, scaleHeight, scaleWidth } from '../../platformUtils';
import { formatTicketsLabel, formatTokensLabel } from '../../utils';
import { accountProfileStrings } from '../../stringConstants';
import { NotificationCircle } from '../../../assets/images';

const Container = styled.TouchableOpacity`
  align-items: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: ${({ borderRadius }) => borderRadius};
  flex-direction: row;
  height: ${({ height }) => scaleHeight(height)};
  justify-content: center;
  opacity: ${({ semiTransparent }) => (semiTransparent ? 0.7 : 1)};
  width: ${({ width }) => scale(width)};
`;

const Icon = styled.ImageBackground`
  height: ${({iconSize})=>scale(iconSize)};
  margin-right: ${scale(5)};
  width: ${({iconSize})=>scale(iconSize)};
`;
const ProfileIcon = styled.Image`
height: ${scale(24)};
margin-left: ${scale(5)};
border-radius:${scale(150)};
width: ${scale(24)};
`;

const RightAlignedIcon = styled.Image`
  height: ${scale(24)};
  margin-left: ${scale(5)};
  width: ${scale(24)};
`;

const AmountText = Platform.OS === 'android' ? styled(Text)`
margin-top: ${scale(0)};
color: ${({ textColor }) => textColor};
`
  :
  styled(Text)`
margin-top: ${scale(7)};
color: ${({ textColor }) => textColor};
`;

const PlusSymbol = Platform.OS === 'android' ? styled.TouchableOpacity`
background-color: ${color.havelockBlue}; 
border-radius: ${scale(9)};
height: ${scale(18)};
border-color:${color.white};
border-width:${scale(1)};
align-items: center;
justify-content: center;
position: absolute;
right: ${scale(-4.5)};
width: ${scale(18)};
`
  :
  styled.TouchableOpacity`
background-color: ${color.havelockBlue};
border-radius: ${scale(9)};
height: ${scale(18)};
border-color:${color.white};
border-width:${scale(1)};
padding-left: ${scale(3)};
padding-top: ${scale(1)};
position: absolute;
right: ${scale(-3.5)};
width: ${scale(18)};
`;

const BlackPlusSymbol = Platform.OS === 'android' ? styled.TouchableOpacity`
background-color: ${color.black}; 
border-radius: ${scale(9)};
height: ${scale(18)};
border-width:${scale(1)};
align-items: center;
justify-content: center;
position: absolute;
right: ${scale(-4.5)};
width: ${scale(18)};
`
  :
  styled.TouchableOpacity`
background-color: ${color.black};
border-radius: ${scale(9)};
height: ${scale(18)};
border-width:${scale(1)};
padding-left: ${scale(3)};
padding-top: ${scale(1)};
position: absolute;
right: ${scale(-3.5)};
width: ${scale(18)};
`;

const NotificationIcon = styled.Image`
  position:absolute;
  right:${scaleWidth(-2)};
  top:0;  
  z-index:1;
  margin-bottom:${scaleHeight(Platform.OS === 'android' ? 0 : 8)};
  height: ${Platform.OS === 'android' ? scaleHeight(9) : scaleHeight(9)};
  width: ${Platform.OS === 'android' ? scaleHeight(9) : scaleHeight(9)};
`;

const Ellipse = ({
  children,
  backgroundColor,
  borderRadius,
  height,
  width,
  icon,
  amount,
  isIconAlignedRight,
  isPlusPresent,
  onPress,
  semiTransparent,
  vipLevelId,
  isGamePlay,
  freePlayNotification,
  iconSize,
  textSize,
  ...rest
}) => {

  const renderContent = (textSize) => {
    if (amount !== null && isPlusPresent) {
      return <AmountText textColor={backgroundColor === color.white ?
        color.black : color.white} size={textSize}>{formatTokensLabel(amount)}</AmountText>;
    }
    if(amount !== null && isGamePlay){
      return <AmountText textColor={color.black} size={textSize}>{formatTokensLabel(amount)}</AmountText>;
    }
    if (amount !== null && !isPlusPresent) {
      return <AmountText textColor={backgroundColor === color.white ?
        color.black : color.white} size={textSize}>{formatTicketsLabel(amount)}</AmountText>;
    }
    if (vipLevelId && vipLevelId > 0) {
      return <AmountText textColor={backgroundColor === color.white ?
        color.black : color.white} size={textSize}>{`${accountProfileStrings.vip} ${vipLevelId}`}</AmountText>;
    }
    return children;
  };


  return (
    <Container
      style={[Platform.OS === 'android' ? { marginHorizontal: scaleWidth(7) } : {}]}
      onPress={onPress}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      height={height}
      width={width}
      activeOpacity={1}
      testID="ellipse-button"
      semiTransparent={semiTransparent}
      {...rest}
    >
      { isIconAlignedRight ? renderContent(textSize) :
        <Icon source={icon} iconSize={iconSize} resizeMode="contain" >
          {freePlayNotification &&
            <NotificationIcon source={NotificationCircle} resizeMode="cover" />
          }
        </Icon>
      }
      {
        isIconAlignedRight &&
        (vipLevelId ?
          <ProfileIcon source={icon} resizeMode="contain" /> : <RightAlignedIcon source={icon} resizeMode="contain" />
        )
      }
      { !isIconAlignedRight && renderContent(textSize)}
      {
        isPlusPresent && (       
          <PlusSymbol activeOpacity={1} onPress={onPress} {...rest}>
            <Text allowFontScaling={false} color={color.white}>+</Text>
          </PlusSymbol>       
        )
      }

      {
        isGamePlay && (
          <BlackPlusSymbol activeOpacity={1} onPress={onPress} {...rest}>
          <Text allowFontScaling={false} color={color.white}>+</Text>
         </BlackPlusSymbol>
        )
      }
      
    </Container >
  );
};

Ellipse.propTypes = {
  children: PropTypes.node,
  amount: PropTypes.number,
  backgroundColor: PropTypes.string,
  borderRadius: PropTypes.number,
  height: PropTypes.number,
  icon: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]).isRequired,
  isPlusPresent: PropTypes.bool,
  isIconAlignedRight: PropTypes.bool,
  onPress: PropTypes.func,
  semiTransparent: PropTypes.bool,
  width: PropTypes.number.isRequired,
  vipLevelId: PropTypes.number,
  freePlayNotification: PropTypes.bool,
  iconSize:PropTypes.number,
  textSize:PropTypes.number,
  isGamePlay:PropTypes.bool
};

Ellipse.defaultProps = {
  amount: null,
  children: null,
  backgroundColor: color.governorBay,
  borderRadius: 44,
  height: 40,
  isPlusPresent: false,
  isIconAlignedRight: false,
  onPress: () => { },
  semiTransparent: false,
  vipLevelId: null,
  freePlayNotification: false,
  iconSize:24,
  textSize:SIZE.XXSMALL,
  isGamePlay:false
};

export default Ellipse;
