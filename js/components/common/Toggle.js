import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import Text, { SIZE, FONT_FAMILY } from './Text';
import { scale, scaleHeight } from '../../platformUtils';
import { color } from '../../styles';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const radius = 35;
const backgroundRadius = radius + 4;

const ToggleBorder = styled.View`
  align-items: center;
  justify-content: center;
  background-color: ${color.green};
  border-radius: ${scale(backgroundRadius)};
  width: ${scale(57)};
  height: ${scale(38)};
`;

const ToggleBackground = styled.View`
  align-items: center;
  background-color: ${({ enabled }) => (enabled ? color.profileNavigationSecondary3 : color.silver)};
  border-radius: ${scale(backgroundRadius)};
  flex-direction: row;
  justify-content: ${({ enabled }) => (enabled ? 'flex-end' : 'flex-start')};
  margin-horizontal: ${scale(10)};
  padding-horizontal: ${scale(1)};
  padding-vertical: ${scale(1)};
  width: ${scale(51)};
  height: ${scale(32)};
`;

const ToggleSwitch = styled.View`
  width: ${scale(28)};
  height: ${scale(28)};
  background-color: ${color.white};
  border-width: 0;
  border-radius: ${scale(14)};
`;

const TextWrapper = styled(Text)`
  margin-top: ${scaleHeight(8)};
`;

const Toggle = ({ enabled, onToggle, label }) => {
  return (
    <Container>
      <TouchableWithoutFeedback onPress={onToggle}>
        <ToggleBorder>
          <ToggleBackground enabled={enabled}>
            <ToggleSwitch />
          </ToggleBackground>
        </ToggleBorder>
      </TouchableWithoutFeedback>
      <TextWrapper size={SIZE.XXSMALL} fontFamily={FONT_FAMILY.SEMI_BOLD}>
        {label}
      </TextWrapper>
    </Container>
  );
};

Toggle.defaultProps = {
  label: ''
};

Toggle.propTypes = {
  onToggle: PropTypes.func.isRequired,
  enabled: PropTypes.bool.isRequired,
  label: PropTypes.string
};

export default Toggle;
