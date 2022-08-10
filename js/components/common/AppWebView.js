import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
`;

const AppWebView = ({ navigation }) => {
  const { url } = navigation.state.params;
  return (
    <StyledSafeAreaView>
      <WebView
        source={{
          uri: url
        }}
        testID="web-view"
        useWebKit
      />
    </StyledSafeAreaView>
  );
};

AppWebView.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        url: PropTypes.string
      })
    })
  }).isRequired
};

export default AppWebView;
