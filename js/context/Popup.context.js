/* istanbul ignore file */
import React, { PureComponent } from 'react';
import { Platform } from 'react-native'
import PropTypes from 'prop-types';
import NetInfo from '@react-native-community/netinfo';
import { getVersion } from 'react-native-device-info';

import { NETWORK_ERROR } from '../constants';
import { withBackgroundMusic } from './BackgroundMusic.context';
import { displayError } from '../utils';
import api from '../api'

export const PopupContext = React.createContext();
let unsubscribe;
class PopupProvider extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isCreateAccountPopUpShown: false,
      isBecomeVipPopUpShown: false,
      isNetworkConnected: true,
      showNetworkAlert: false,
      showForceUpdate: false,
      isGamePlayScreen: false,
    };
  }

  async componentDidMount() {
    unsubscribe = NetInfo.addEventListener(({ isInternetReachable, isConnected }) => {
      const isNetworkConnected = isInternetReachable && isConnected;
      if (isNetworkConnected !== null) {
        this.setState({ isNetworkConnected, showNetworkAlert: !isNetworkConnected });
      }
    });
    await this.checkForceUpdate();
  }

  componentWillUnmount() {
    unsubscribe();
  }

  checkForceUpdate = async () => {
    const version = getVersion();
    try {
      const res = await api.getCheckForceUpdate(version, Platform.OS === 'ios' ? 2 : 1);
      if(res.status === 200 && res.data.isForceUpdate){
        this.setState({ showForceUpdate: true })
      }
    } catch (error) {
      // fail silently
    }
  }

  setIsCreateAccountPopUpShown = isCreateAccountPopUpShown => {
    this.setState({ isCreateAccountPopUpShown });
  };

  setIsBecomeVipPopUpShown = isBecomeVipPopUpShown => {
    this.setState({ isBecomeVipPopUpShown });
  };

  setShowNetworkAlert = showNetworkAlert => {
    this.setState({ showNetworkAlert });
  };

  setIsGamePlayScreen = isGamePlayScreen => {
    this.setState({ isGamePlayScreen });
  };

  displayRequestError = (error, onPress = () => {}) => {
    const { isNetworkConnected } = this.state;
    if (error.message !== NETWORK_ERROR && error !== NETWORK_ERROR && isNetworkConnected) {
      displayError(error, onPress);
    }
  };

  render() {
    const { children, backgroundMusicContextValue } = this.props;
    return (
      <PopupContext.Provider
        value={{
          ...this.state,
          setIsCreateAccountPopUpShown: this.setIsCreateAccountPopUpShown,
          setIsBecomeVipPopUpShown: this.setIsBecomeVipPopUpShown,
          setShowNetworkAlert: this.setShowNetworkAlert,
          displayRequestError: this.displayRequestError,
          setIsGamePlayScreen: this.setIsGamePlayScreen,
         backgroundMusicContextValue
        }}
      >
        {children}
      </PopupContext.Provider>
    );
  }
}

PopupProvider.propTypes = {
  children: PropTypes.node,
  backgroundMusicContextValue: PropTypes.shape({
    playMusic: PropTypes.func.isRequired,
    playSoundEffect: PropTypes.func.isRequired
  }).isRequired
};

PopupProvider.defaultProps = {
  children: null
};

export const withPopup = Wrapped => props => (
  <PopupContext.Consumer>{value => <Wrapped {...props} popupContextValue={value} />}</PopupContext.Consumer>
);

export default withBackgroundMusic(PopupProvider);
