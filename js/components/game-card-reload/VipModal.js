import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import VipModalWrapper from '../common/VipModalWrapper';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import { scaleHeight, scale } from '../../platformUtils';
import { color } from '../../styles';
import { gameCardReloadStrings } from '../../stringConstants';

const TextWrapper = styled(Text)`
  line-height: ${scale(24)};
  padding-top: ${scaleHeight(8)};
`;

const VipModal = ({ isVisible, setVisible }) => {
  return (
    <VipModalWrapper isVisible={isVisible} setVisible={setVisible} showChicken>
      <Text fontFamily={FONT_FAMILY.MEDIUM} color={color.grayBlack} size={SIZE.SMALL}>
        {gameCardReloadStrings.congratulations}
      </Text>
      <TextWrapper alignCenter color={color.grayBlack} size={SIZE.XSMALL} fontFamily={FONT_FAMILY.REGULAR}>
        {gameCardReloadStrings.youAreVIPAnnouncement}
      </TextWrapper>
    </VipModalWrapper>
  );
};

VipModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired
};

export default VipModal;
