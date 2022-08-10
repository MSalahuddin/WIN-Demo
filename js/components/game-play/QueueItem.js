import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import {Platform} from 'react-native';
import Text, { SIZE } from '../common/Text';

import { scale, scaleHeight } from '../../platformUtils';
import { color as TextColor } from '../../styles';

const QueueItemContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: ${scaleHeight(40)};
  margin-horizontal: ${scale(5)};
`;

const PaddingView = styled.View`
  justify-content: center;
  align-items: center;
  padding-horizontal: ${scale(3)};
`;

const QueueIcon = styled.Image`
  width: ${scale(24)};
  height: ${scale(24)};
`;

const ItemText = styled(Text)`
  margin-top: ${Platform.OS==='android'?scaleHeight(0):scaleHeight(7)};
`;

const QueueItem = ({ icon, title, color }) => (
  <QueueItemContainer>
    <PaddingView>
      <QueueIcon source={icon} resizeMode="contain" />
    </PaddingView>
    <PaddingView>
      <ItemText size={SIZE.XSMALL} color={color}>
        {title}
      </ItemText>
    </PaddingView>
  </QueueItemContainer>
);

QueueItem.defaultProps = {
  color: TextColor.black
};

QueueItem.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]).isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default QueueItem;
