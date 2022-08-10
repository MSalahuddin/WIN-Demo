import React from 'react';
import styled from 'styled-components/native';
import { color } from '../../styles';

const Loader = styled.ActivityIndicator`
  flex: 1;
  margin-top: 10;
`;


const FooterLoader = () => {
  return <Loader size="large"  color={color.white} />
};


export default FooterLoader;
