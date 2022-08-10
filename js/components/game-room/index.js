/* eslint-disable no-use-before-define */
import React, { } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Games from './Games';
import PopUpWrapper from '../common/PopUpWrapper';
import GeoRestrictedModal from '../common/GeoRestrictedModal';
import { ScatteredCircleBackGround } from '../../../assets/images';
import { SafeAreaContainer } from '../../styles';

const Background = styled.ImageBackground`
height: 100%;
  width: 100%;
  `;




const GameRoom = ({ navigation }) => {
  return (
    <PopUpWrapper>
      <GeoRestrictedModal>
        <Background source={ScatteredCircleBackGround} resizeMode="stretch">
         <SafeAreaContainer>
    <Games navigation={navigation}/>
         </SafeAreaContainer>
         </Background>
      </GeoRestrictedModal>
  
    </PopUpWrapper>
  );
};

GameRoom.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.bool
  }).isRequired
};

export default GameRoom;
