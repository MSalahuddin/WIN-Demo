import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import { Platform } from 'react-native';
import { scale, scaleHeight } from '../../platformUtils';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import Arrow, { ARROW_DIRECTION } from '../common/Arrow';
import { color } from '../../styles';
import { BlankBanner, StarBanner } from '../../../assets/images';

export const BANNER_TYPE = {
  BACKDROP: 'BACKDROP',
  BOW_TIE: 'BOW_TIE',
  NORMAL: 'NORMAL',
  STAR: 'STAR',
  PURPLE: 'PURPLE'
};

const getHeight = (bannerType, width) => {
  switch (bannerType) {
    case BANNER_TYPE.BOW_TIE:
      return scale(width) * (85 / 345);
    case BANNER_TYPE.BACKDROP:
      return scale(width) * (66 / 345);
    default:
      return width * (66 / 345);
  }
};

const VIPBannerContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-top:${Platform.OS === "android" ? 0 : 12}
`;

const VIPBanner = Platform.OS === "android" ?
  styled.Image`
  height: ${({ bannerType, width }) => getHeight(bannerType, width)};
  width: ${({ width }) => width};
  elevation: 3;
   z-index: 2;
`
  : styled.Image`
  height: ${({ bannerType, width }) => getHeight(bannerType, width)};
  width: ${({ width }) => width};
`;

const BannerText = Platform.OS === 'android' ? styled(Text)`
position: absolute;
color: ${color.white};
elevation: 4;
z-index: 3;
padding-bottom: ${scaleHeight(12)};
${({ bannerType }) => bannerType === BANNER_TYPE.BOW_TIE && `padding-bottom: ${scaleHeight(20)}`};
letter-spacing: 1.5;
`:
  styled(Text)`
  position: absolute;
  padding-bottom: ${scaleHeight(5)};
  color: ${color.white};
  ${({ bannerType }) => bannerType === BANNER_TYPE.BOW_TIE && `padding-top: ${scaleHeight(20)}`};
  letter-spacing: 1.5;
`;

// top position should be the height of the image and minus 10
// to move it to the top a bit.
const Backdrop = Platform.OS === 'android' ? styled.View`
background-color: ${color.white};
width: ${scale(50)}%;
border-bottom-left-radius: ${scaleHeight(8)};
border-bottom-right-radius: ${scaleHeight(8)};
height: ${scaleHeight(49)};
justify-content: space-between;
flex-direction: row;
opacity: 0.85;
top: ${scaleHeight(49)};
padding-top: ${scaleHeight(15)};
position: absolute;
shadow-color: ${color.blackShadow};
shadow-offset: 4px 4px;
shadow-opacity: ${1};
shadow-radius: 2px;
elevation: 2;
z-index: 1;
`:
  styled.View`
align-items: center;
background-color: ${color.white};
border-bottom-left-radius: ${scaleHeight(8)};
border-bottom-right-radius: ${scaleHeight(8)};
bottom: ${-scaleHeight(22)};
height: ${scaleHeight(49)};
justify-content: space-between;
flex-direction: row;
opacity: 0.85;
padding-top: ${scaleHeight(15)};
position: absolute;
shadow-color: ${color.blackShadow};
shadow-offset: 4px 4px;
shadow-opacity: ${1};
shadow-radius: 2px;
width: ${scale(50)}%;
elevation: 8;
z-index: -1;
`;

const BackdropText = Platform.OS === 'android' ? styled(Text)`
margin-top: ${scaleHeight(0)};
`:
  styled(Text)`
  margin-top: ${scaleHeight(6)};
`;

const StoreBanner = ({
  label,
  bannerType,
  backdropText,
  textSize,
  width,
  leftAction,
  rightAction,
  leftEnabled,
  rightEnabled,
  ...rest
}) => {
  const renderBackdrop = () => {
    return (
      <Backdrop width={width}>
        <Arrow
          testID="arrow-left"
          arrowDirection={ARROW_DIRECTION.LEFT}
          onPress={() => {
            if (leftEnabled) {
              leftAction();
            }
          }}
          color={leftEnabled ? color.black : color.lightGrey}
        />
        <BackdropText size={SIZE.XSMALL} fontFamily={FONT_FAMILY.SEMI_BOLD}>
          {backdropText}
        </BackdropText>
        <Arrow
          testID="arrow-right"
          arrowDirection={ARROW_DIRECTION.RIGHT}
          onPress={() => {
            if (rightEnabled) {
              rightAction();
            }
          }}
          color={rightEnabled ? color.black : color.lightGrey}
        />
      </Backdrop>
    );
  };

  return (
    <VIPBannerContainer width={width} {...rest}>
      <VIPBanner
        width={width}
        source={bannerType === BANNER_TYPE.STAR ? StarBanner : BlankBanner}
        resizeMode="contain"
        bannerType={bannerType} />
      <BannerText allowFontScaling={false} fontFamily={FONT_FAMILY.BOLD}
        size={textSize} isUppercase bannerType={bannerType}>
        {label}
      </BannerText>
      {bannerType === BANNER_TYPE.BACKDROP && renderBackdrop()}
    </VIPBannerContainer>
  );
};

StoreBanner.propTypes = {
  backdropText: PropTypes.string,
  bannerType: PropTypes.oneOf([
    BANNER_TYPE.NORMAL,
    BANNER_TYPE.BOW_TIE,
    BANNER_TYPE.BACKDROP,
    BANNER_TYPE.STAR,
    BANNER_TYPE.PURPLE
  ]),
  leftEnabled: PropTypes.bool,
  rightEnabled: PropTypes.bool,
  leftAction: PropTypes.func,
  rightAction: PropTypes.func,
  label: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  textSize: PropTypes.oneOf([
    SIZE.NORMAL,
    SIZE.LARGE,
    SIZE.BANNER_LARGE,
    SIZE.XLARGE,
    SIZE.XXLARGE,
    SIZE.LARGEST,
    SIZE.SMALL,
    SIZE.XSMALL,
    SIZE.XXSMALL
  ])
};

StoreBanner.defaultProps = {
  backdropText: '',
  bannerType: BANNER_TYPE.NORMAL,
  textSize: SIZE.XSMALL,
  leftEnabled: true,
  rightEnabled: true,
  leftAction: () => { },
  rightAction: () => { }
};

export default StoreBanner;
