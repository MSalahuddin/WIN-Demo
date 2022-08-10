import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
// import { Platform } from 'react-native';
import { scale, getWindowWidth } from '../../platformUtils';
import { color } from '../../styles';
import { LostTag, WonTag, bannerExited, bannerWon, bannerLost } from '../../../assets/images';

const cardWidth = (getWindowWidth() - 3 * scale(16)) / 3;
const Container = styled.TouchableOpacity`
  background-color: ${color.white};
  border-radius: ${scale(10)};
  margin-top: ${scale(12)};
  margin-horizontal: ${scale(5)};
  shadow-color: ${color.blackShadow};
  shadow-offset: 4px 4px;
  shadow-opacity: ${1};
  shadow-radius: 2px;
  justify-content:center;
  align-items:center;
  width: ${cardWidth};
  height:${cardWidth};
  overflow: hidden;
  flex-direction: column;
`;
const EmptyContainer = styled.View`
width: ${cardWidth};
height:${cardWidth};
`;
const PrizeImage = styled.Image`
  width: ${cardWidth - 4};
  height: ${cardWidth - 4};
  border-radius: ${scale(8)};
`;

const WonImage = styled.Image`
position:absolute;
z-index:5;
top:-2;
left:-2;
`;


const HistoryCard = ({ imageUrl, onPress, isWon, checkIndex, index }) => {

    let gameStatus = null

    switch (isWon) {
        case true:
            gameStatus = bannerWon
            break;

        case false:
            gameStatus = bannerLost
            break;

        default:
            gameStatus = bannerExited
    }


    return (
        (checkIndex && index <= 7) ? <Container testID="prize-card-button" activeOpacity={1} onPress={onPress}>
            <WonImage source={gameStatus} />
            <PrizeImage source={{ uri: imageUrl }} resizeMode="cover" />
        </Container> : <><EmptyContainer /></>
    );
};

HistoryCard.defaultProps = {
    onPress: () => { },
    checkIndex: false
};

HistoryCard.propTypes = {
    isWon: PropTypes.bool.isRequired,
    imageUrl: PropTypes.string.isRequired,
    checkIndex: PropTypes.bool,
    index: PropTypes.number.isRequired,
    onPress: PropTypes.func
};

export default HistoryCard;
