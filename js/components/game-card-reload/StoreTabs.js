import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import { Platform, PixelRatio } from 'react-native';
import { scale, scaleHeight, scaleWidth } from '../../platformUtils';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import { color } from '../../styles';

//  for font ratio
const fontSizeRatio = PixelRatio.getFontScale()
// top position should be the height of the image and minus 10
// to move it to the top a bit.
const TabsOutterView = styled.View`
width: ${scale(30)}%;
margin-horizontal:${scale(5)};
`;

const TabsDotView = styled.TouchableOpacity`
background-color: ${color.navyBlue};
width:100%
border-radius: ${scaleHeight(25)};
height:${scaleHeight(Platform.OS === 'android' ? 38 : 41)};
justify-content:center;
align-items:center;
`;
const TabsView = styled.TouchableOpacity`
height:${scaleHeight(35)};
justify-content:center;
align-items:center;
`;
const InnerView = styled.View`

`;
const BackdropText = Platform.OS === 'android' ? styled(Text)`
margin-top: ${scaleHeight(0)};
`:
  styled(Text)`
  margin-top: ${scaleHeight(6)};
  
`;
const NotificationIcon = styled.Image`
  position:absolute;
  right:${scaleWidth(6)};
  top:5;  
  z-index:1;
  margin-bottom:${scaleHeight(Platform.OS === 'android' ? 0 : 8)};
  height: ${Platform.OS === 'android' ? scaleHeight(9) : scaleHeight(9)};
  width: ${Platform.OS === 'android' ? scaleHeight(9) : scaleHeight(9)};
`;

const StoreTabs = ({
  backdropText,
  isDotted,
  width,
  onPress,
  freePlayNotification,
  freePlayNotificationImg,
}) => {
  const renderWithDottedBox = () => {
    return (
      <TabsDotView onPress={onPress} width={width}>
        <BackdropText
          size={fontSizeRatio > 1 ? SIZE.XXSMALL : SIZE.XSMALL}
          fontFamily={FONT_FAMILY.SEMI_BOLD}
          color={color.white}
        >
          {backdropText}
        </BackdropText>
      </TabsDotView>
    );
  };
  const renderWithOutDottedBox = () => {
    return (
      <InnerView>
        <TabsView onPress={onPress} height={scaleHeight(35)} width={width}>
          {freePlayNotification &&
            <NotificationIcon source={freePlayNotificationImg} resizeMode="cover" />
          }
          <BackdropText
            size={SIZE.XSMALL}
            fontFamily={FONT_FAMILY.SEMI_BOLD}
            color={color.navyBlue}
          >
            {backdropText}
          </BackdropText>

        </TabsView>
      </InnerView>
    );
  };
  return (
    <TabsOutterView>
      {isDotted ? renderWithDottedBox() : renderWithOutDottedBox()}
    </TabsOutterView>
  );
};

StoreTabs.propTypes = {
  backdropText: PropTypes.string,
  isDotted: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  freePlayNotification: PropTypes.bool,
  freePlayNotificationImg: PropTypes.string,
};

StoreTabs.defaultProps = {
  backdropText: '',
  freePlayNotificationImg: null,
  freePlayNotification: false,
  onPress: () => { }
};

export default StoreTabs;
