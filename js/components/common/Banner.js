import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { scale, scaleHeight } from '../../platformUtils';
import Text, { FONT_FAMILY, SIZE } from './Text';
import { color } from '../../styles';
import {
  bannerWithStar,
  banner,
  bannerWithBowTie,
  bannerPurple,
  bannerBlue,
  bannerPurpleBig,
  bannerSale,
  bannerCoin,
  BlankBanner
} from '../../../assets/images';

export const BANNER_TYPE = {
  BACKDROP: 'BACKDROP',
  BLUE: 'BLUE',
  BOW_TIE: 'BOW_TIE',
  NORMAL: 'NORMAL',
  PURPLE_BIG: 'PURPLE_BIG',
  PURPLE: 'PURPLE',
  SALE: 'SALE',
  STAR: 'STAR',
  COIN: 'COIN',
  BLUE_BANNER: 'BLUE_BANNER',
};

const getHeight = (bannerType, width) => {
  switch (bannerType) {
    case BANNER_TYPE.BOW_TIE:
      return scale(width) * (85 / 345);
    case BANNER_TYPE.BACKDROP:
      return scale(width) * (66 / 345);
    case BANNER_TYPE.SALE:
      return scale(width);
    case BANNER_TYPE.STAR:
      return width * (32 / 175);
    default:
      return width * (66 / 345);
  }
};

const VIPBannerContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const VIPBanner = styled.Image`
  height: ${({ bannerType, width }) => getHeight(bannerType, width)};
  width: ${({ width }) => width};
`;

const BannerText = Platform.OS === 'android' ? styled(Text)`
position: absolute;
color: ${color.white};
padding-bottom: ${scaleHeight(9)};
${({ fontSize }) => `font-size:${fontSize}`}
${({ bannerType }) => bannerType === BANNER_TYPE.BOW_TIE && `padding-top: ${scaleHeight(20)}`};
letter-spacing: 1.5;
`:
  styled(Text)`
  position: absolute;
  color: ${color.white};
  ${({ bannerType }) => bannerType === BANNER_TYPE.BOW_TIE && `padding-top: ${scaleHeight(20)}`};
  letter-spacing: 1.5;
` ;
// top position should be the height of the image and minus 10
// to move it to the top a bit.
const Backdrop = styled.View`
  align-items: center;
  background-color: ${color.white};
  border-bottom-left-radius: ${scaleHeight(8)};
  border-bottom-right-radius: ${scaleHeight(8)};
  bottom: ${-scaleHeight(50)};
  height: ${scaleHeight(68)};
  justify-content: center;
  opacity: 0.85;
  padding-top: ${scaleHeight(10)};
  position: absolute;
  shadow-color: ${color.blackShadow};
  shadow-offset: 4px 4px;
  shadow-opacity: ${1};
  shadow-radius: 2px;
  width: ${scale(50)}%;
  z-index: -1;
`;

const Banner = ({ children, label, bannerType, backdropText, backdropSubtext, textSize, fontSize, width, ...rest }) => {
  const getBannerSource = () => {
    switch (bannerType) {
      case BANNER_TYPE.PURPLE:
        return bannerPurple;
      case BANNER_TYPE.BLUE:
        return bannerBlue;
      case BANNER_TYPE.STAR:
        return bannerWithStar;
      case BANNER_TYPE.BOW_TIE:
        return bannerWithBowTie;
      case BANNER_TYPE.PURPLE_BIG:
        return bannerPurpleBig;
      case BANNER_TYPE.SALE:
        return bannerSale;
      case BANNER_TYPE.COIN:
        return bannerCoin;
      case BANNER_TYPE.BLUE_BANNER:
        return BlankBanner;
      default:
        return banner;
    }
  };

  const renderBackdrop = () => {
    return (
      <Backdrop width={width}>
        <Text size={SIZE.XSMALL} fontFamily={FONT_FAMILY.SEMI_BOLD}>
          {backdropText}
        </Text>
        <Text size={SIZE.XXSMALL} fontFamily={FONT_FAMILY.REGULAR}>
          {backdropSubtext}
        </Text>
      </Backdrop>
    );
  };

  return (
    <VIPBannerContainer width={width} {...rest}>
      <VIPBanner width={width} source={getBannerSource()} resizeMode="contain" bannerType={bannerType} />
      {children ||
        (!!label && (
          <BannerText allowFontScaling={false} fontFamily={FONT_FAMILY.BOLD} fontSize={fontSize} size={textSize}
            isUppercase bannerType={bannerType}>
            {label}
          </BannerText>
        ))}
      {bannerType === BANNER_TYPE.BACKDROP && renderBackdrop()}
    </VIPBannerContainer>
  );
};

Banner.propTypes = {
  children: PropTypes.node,
  backdropText: PropTypes.string,
  backdropSubtext: PropTypes.string,
  fontSize: PropTypes.number,
  bannerType: PropTypes.oneOf([
    BANNER_TYPE.NORMAL,
    BANNER_TYPE.BOW_TIE,
    BANNER_TYPE.BACKDROP,
    BANNER_TYPE.STAR,
    BANNER_TYPE.PURPLE,
    BANNER_TYPE.BLUE,
    BANNER_TYPE.PURPLE_BIG,
    BANNER_TYPE.SALE
  ]),
  label: PropTypes.string,
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

Banner.defaultProps = {
  children: null,
  backdropText: '',
  fontSize: 22,
  backdropSubtext: '',
  bannerType: BANNER_TYPE.NORMAL,
  textSize: SIZE.XSMALL,
  label: ''
};

export default Banner;
