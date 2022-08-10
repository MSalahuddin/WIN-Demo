import React from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import { color } from '../../styles';

const SpinnerContainer = styled.View`
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: center;
`;

const LoadingSpinner = ({ isLoading ,spinnerColor}) => {
  return (
    isLoading && (
      <SpinnerContainer>
        <ActivityIndicator size="large" color={spinnerColor} />
      </SpinnerContainer>
    )
  );
};

LoadingSpinner.defaultProps = {
  isLoading: false,
  spinnerColor:color.white
};

LoadingSpinner.propTypes = {
  isLoading: PropTypes.bool,
  spinnerColor:PropTypes.string
};

export default LoadingSpinner;
