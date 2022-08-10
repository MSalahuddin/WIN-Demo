import React from 'react';
import { Platform, PixelRatio } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import { color } from '../../styles';
import { scale, scaleHeight, scaleWidth, getWindowWidth } from '../../platformUtils';

const fontSizeRatio = PixelRatio.getFontScale();

const TabsOutterView = styled.View`
  width: ${Platform.OS === 'android' ? getWindowWidth() * 0.43 : getWindowWidth() * 0.45};
  margin-horizontal: ${scale(5)};
`;
const TabsDotView = styled.TouchableOpacity`
  background-color: ${color.navyBlue};
  width: ${Platform.OS === 'android' ? getWindowWidth() * 0.43 : getWindowWidth() * 0.45};
  border-radius: ${scaleHeight(25)};
  height: ${scaleHeight(Platform.OS === 'android' ? 42 : 45)};
  justify-content: center;
  align-items: center;
`;
const TabsView = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: ${scaleHeight(45)};
`;
const InnerView = styled.View``;
const BackdropText = styled(Text)`
  margin-top: ${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(6)};
`;
const NotificationIcon = styled.Image`
  height: ${scaleHeight(18)};
  width: ${scaleHeight(18)};
  margin-left: ${scaleWidth(8)};
`;

const Tabs = ({ backdropText, isSelected, width, onPress, showNotification, notificationImage }) => {
  const renderSelectedBox = () => {
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

  const renderUnselectedBox = () => {
    return (
      <InnerView>
        <TabsView onPress={onPress} height={scaleHeight(35)} width={width}>
          <BackdropText size={SIZE.XSMALL} fontFamily={FONT_FAMILY.SEMI_BOLD} color={color.navyBlue}>
            {backdropText}
          </BackdropText>
          {showNotification && <NotificationIcon source={notificationImage} resizeMode="cover" />}
        </TabsView>
      </InnerView>
    );
  };

  return <TabsOutterView>{isSelected ? renderSelectedBox() : renderUnselectedBox()}</TabsOutterView>;
};

Tabs.propTypes = {
  backdropText: PropTypes.string,
  isSelected: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  showNotification: PropTypes.bool,
  notificationImage: PropTypes.string
};

Tabs.defaultProps = {
  backdropText: '',
  notificationImage: null,
  showNotification: false,
  onPress: () => {}
};

export default Tabs;
