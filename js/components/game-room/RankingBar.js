import React, { useState, useEffect, useContext, useCallback } from 'react';
import { FlatList, ActivityIndicator, Platform, TouchableOpacity, View, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import api from '../../api';
import { ExitCircle, AlternateImage, rank_view_all, header_top_players } from '../../../assets/images/index';
import { scaleHeight, scaleWidth } from '../../platformUtils';
import { color } from '../../styles';
import { SCREENS } from '../../constants';
import IconButton from '../common/IconButton';
import Text, { SIZE } from '../common/Text';
import { gameRoomStrings, leaderboardStrings } from '../../stringConstants';
import { PopupContext } from '../../context/Popup.context';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment'

const RankingBar = styled.View`
  flex-direction: column;
  padding-bottom: ${scaleHeight(10)};
  align-items: center;
`;
const TextIconWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: ${scaleHeight(10)};
  justify-content: center;
`;

const CancelIcon = styled(IconButton)`
  margin-top: ${scaleHeight(0)};
  position: absolute;
  right: ${scaleWidth(20)};
`;

const ImageIconNew = styled.Image`
  border-color: ${color.white};
  border-radius: ${scaleHeight(34)};
  border-width: 1;
  height: ${scaleHeight(35)};
  width: ${scaleHeight(35)};
`;

const ViewAllImageIcon = styled.Image`
  border-radius: ${scaleHeight(34)};
  margin: -1px;
  height: ${scaleHeight(38)};
  width: ${scaleHeight(38)};
`;

const ImageHeader = styled.Image`
  height: ${scaleHeight(20)};
  width: ${scaleHeight(200)};
`;

const WinnersContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  padding-horizontal:${scaleHeight(4)};
`;

const TextWrapper = styled(Text)`
margin-top:${Platform.OS === 'android' ? scaleHeight(0) : scaleHeight(3)}
`

const TopRankingBar = ({ navigation, setOpenRankingBar }) => {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const { displayRequestError } = useContext(PopupContext);
  const { navigate } = navigation;
  const viewAllData = {
    viewAll: rank_view_all,
    userName: gameRoomStrings.ViewAll,
    onPress: () => navigate(SCREENS.LEADERBOARD, { filterParam: 2 })
  }

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const res = await api.getLeaderboard(leaderboardStrings.weekly);
        if (res.status === 200 && res.data) {
          const { top10 } = res.data;
          setLeaderboardData(top10);
        }
      } catch (error) {
        displayRequestError(error.message);
      }
    };
    fetchLeaderboardData();
  }, []);

  const handleClose = () => {
    AsyncStorage.setItem("SHOW_RANK", moment().format("DD"))
    setOpenRankingBar(false)
  }

  const handleColor = (position) => {
    if (position == 1) return "#ffda00"
    if (position == 2) return "#00f1fc"
    if (position == 3) return "#fb42ff"
    return ""
  }

  const renderPostionDot = (position) => (
    <View style={[styles.rankDot, { backgroundColor: handleColor(position) }]}>
      <TextWrapper size={SIZE.XXXXSMALL} color={"#5419BF"}>
        {`${position}`}
      </TextWrapper>
    </View>
  )

  const renderIcon = useCallback(({item}) => {
    const { position, playerProfileImageUrl, userName, viewAll, onPress } = item;
    return (
      <View style={styles.userRankMain}>
        <TouchableOpacity disabled={!onPress} onPress={onPress} style={styles.userRankProfileMain}>
          {!!position && renderPostionDot(position)}
          {!viewAll && <ImageIconNew source={playerProfileImageUrl ? { uri: playerProfileImageUrl } : AlternateImage} resideMode="contain" />}
          {!!viewAll && <ViewAllImageIcon source={viewAll} resideMode="contain" />}
        </TouchableOpacity>

        <TextWrapper size={SIZE.XXXXSMALL} color={color.white}>
          {`${userName}`.substring(0, 8)}
        </TextWrapper>
      </View>
    )
  }, []);

  const KeyExtractor = useCallback(( item, index ) => `${item.userName}-${index}`, []);

  return (
    <RankingBar>
      <TextIconWrapper>
        <ImageHeader source={header_top_players} resideMode="contain" />
        <CancelIcon testID="cancel-button" onPress={handleClose} icon={ExitCircle} size={30} />
      </TextIconWrapper>
      {leaderboardData && (
        <WinnersContainer>
          <FlatList
            data={[...leaderboardData.slice(0, 3), viewAllData]}
            renderItem={renderIcon}
            keyExtractor={KeyExtractor}
            horizontal
            scrollEnabled={false}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            initialNumToRender={3}
          />
        </WinnersContainer>
      )}
      {!leaderboardData && <ActivityIndicator size="large" color={color.white} />}
    </RankingBar>
  );
};

const styles = StyleSheet.create({
  userRankMain: {
    alignItems: 'center',
    marginHorizontal: 8
  },
  rankDot: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 18,
    width: 18,
    borderRadius: 20,
    position: 'absolute',
    zIndex: 2, left: -3
  },
  userRankProfileMain: {
    backgroundColor: '#5419BF',
    borderRadius: 15,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

})

TopRankingBar.propTypes = {
  setOpenRankingBar: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  }).isRequired
};

export default TopRankingBar;
