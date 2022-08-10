import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import { color } from '../../styles';
import { scale, getWindowWidth, scaleHeight, scaleWidth } from '../../platformUtils';

const Container = styled.View`
  align-items: center;
  background-color: transparent;
`;

const innerBoxWidth = getWindowWidth() - scale(64);
const ContentContainer = styled.View`

  background-color: ${color.shippingBgColor};
  border-radius: ${scale(8)};
  padding-horizontal: ${scaleWidth(26)};
  width: ${innerBoxWidth};
`;

const BoxTitleContainer = styled.View`
  margin-top: ${scaleHeight(20)};
`;

const TextWrapper = styled(Text)`
  margin-vertical: ${scaleHeight(8)};
`;

const ShippingFormBox = ({ children, title, ...rest }) => {
  return (
    <Container {...rest}>
      <ContentContainer>
        <BoxTitleContainer>
          <TextWrapper size={SIZE.XLARGE} fontFamily={FONT_FAMILY.SEMI_BOLD} color={color.white}>
            {title}
          </TextWrapper>
        </BoxTitleContainer>
        {children}
      </ContentContainer>
    </Container>
  );
};

ShippingFormBox.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};

export default ShippingFormBox;
