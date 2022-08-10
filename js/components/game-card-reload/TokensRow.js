import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import {Platform} from 'react-native';
import Text, { FONT_FAMILY, SIZE } from '../common/Text';
import { coin } from '../../../assets/images';
import { scaleHeight, scale } from '../../platformUtils';
import { gameCardReloadStrings } from '../../stringConstants';
import { color } from '../../styles';
import { convertNumberToStringWithComma, capitalize } from '../../utils';

const Container = styled.View`
  height: ${scaleHeight(88)};
  background-color: ${color.grayWhite};
`;

const RowContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

const TokenTextContainer = styled.View`
  align-items: center;
  margin-bottom: ${scaleHeight(8)};
  margin-top: ${scaleHeight(22)};
`;

const TokenSection = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const IconTextRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin-top: ${scaleHeight(5)};
`;

const StyledImage = styled.Image`
  width: ${scale(18)};
  height: ${scale(18)};
  margin-right: ${scale(5)};
`;

const StyledText = styled(Text)`
  margin-top: ${scaleHeight(Platform.OS==='android' ? 0 : 3)};
`;

const TokensRow = ({ oneTimeTokenAmount, monthlyTokenAmount, name }) => {
  const sectionData = [
    { title: gameCardReloadStrings.tokensToday, token: convertNumberToStringWithComma(oneTimeTokenAmount) },
    {
      title: gameCardReloadStrings.monthlyTokens,
      token: convertNumberToStringWithComma(monthlyTokenAmount)
    }
  ];
  return (
    <Container>
      <TokenTextContainer>
        <Text color={color.silver} fontFamily={FONT_FAMILY.REGULAR} size={SIZE.XXSMALL}>
          {`${capitalize(name)} ${gameCardReloadStrings.subscriptionPack}`}
        </Text>
      </TokenTextContainer>
      <RowContainer>
        {sectionData.map(({ title, token }, index) => (
          <TokenSection key={index}>
            <Text size={SIZE.XXSMALL}>{title}</Text>
            <IconTextRow>
              <StyledImage source={coin} resizeMode="contain" />
              <StyledText size={SIZE.XSMALL} fontFamily={FONT_FAMILY.REGULAR} color={color.lightGrey}>
                {token}
              </StyledText>
            </IconTextRow>
          </TokenSection>
        ))}
      </RowContainer>
    </Container>
  );
};

TokensRow.propTypes = {
  monthlyTokenAmount: PropTypes.number.isRequired,
  oneTimeTokenAmount: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};

export default TokensRow;
