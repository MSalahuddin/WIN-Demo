import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Platform, FlatList } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import api from '../../api';
import BottomIconButton from '../common/BottomIconButton';
import { scaleHeight, scale } from '../../platformUtils';
import { topPlayerIcon, allMachinesIcon, categoriesIcon, ExitCircle, iconSearch, newSearchGameroom, newCategories, newExplore, newLeaderboard } from '../../../assets/images';
import { color, fontFamily } from '../../styles';
import { PopupContext } from '../../context/Popup.context';
import { gameRoomStrings } from '../../stringConstants';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator } from 'react-native';
const TopbarContainer = styled.View`
  background-color: ${color.governorBay};
  flex-direction: column;
  align-items: center;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  margin-vertical: ${scaleHeight(8)};
  width: 100%;
  justify-content: center;
`;
const IconButtonView = styled.View`
  justify-content: center;
`;
const CrosIconButtonView = styled.View`
  justify-content: center;
`;

const SelectedContainer = styled.View`
  flex: 1;
  border-radius: ${scale(25)};
  background-color:${color.white}
`;
const NormalContainer = styled.View`
  flex: 1;
`;
const CrossIconButtonWrapper = styled(BottomIconButton)`
  margin-top: 0;
`;

const IconButtonWrapper = styled(BottomIconButton)`
  margin-top: 0;
  background-color: ${color.transparent};
  border-radius: ${scale(25)};
  padding-horizontal: ${scale(0)};
  padding-vertical: ${scale(0)};
`;

const AllMachinesIconButton = styled(BottomIconButton)`
  margin-top: 0;
  background-color: ${color.transparent};
  border-radius: ${scale(25)};
  padding-horizontal: ${scale(0)};
  padding-vertical: ${scale(0)};
`;

const InputBox = styled.TextInput`
  color: ${color.white};
  font-size: ${scale(14)};
  border-radius: ${scale(25)};
  height: ${Platform.OS === 'android' ? scaleHeight(35) : scaleHeight(35)};
  width: 65%;
  padding-top: ${Platform.OS === 'android' ? scaleHeight(10) : scaleHeight(5)};
  padding-bottom: ${Platform.OS === 'android' ? scaleHeight(10) : scaleHeight(5)};
  padding-left: ${scale(15)};
  background-color: ${color.havelockBlue};
`;

const CarouselContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  padding-vertical: 10;
`;

const ItemContainer = styled.TouchableOpacity`
padding-horizontal:${scale(20)}
padding-vertical: ${scale(0)};
align-items: center;

justifyContent: center;
margin-horizontal:${scale(5)};
`;
const ItemLabel = styled.Text`
  font-size: 15;
  color: ${color.grayWhite};
`;
const SelectedLabel = styled.Text`
  font-size: 15;
  font-weight: bold;
  padding-vertical: ${scale(2)};
  color: ${color.searchCategoryText};
`;

const sort = items => {
  return items.sort((a, b) => {
    const labelA = a;
    const labelB = b;
    if (labelA < labelB) {
      return -1;
    }
    if (labelA > labelB) {
      return 1;
    }
    return 0;
  });
};

const TopSearchBar = ({ shouldRefreshGameRoom, onSearch, onSelect, categoryIndex, onExploreTap, setOpenRankingBar, openRankingBar, setCurrentSectionIndex, onMachineSearchClose }) => {
  const [data, setData] = useState(null);
  const [showFilter, setShowFilter] = useState(true);
  const [viewItemIndex, setViewItemIndex] = useState(categoryIndex || 0);
  const [searchData, setSearchData] = useState(null);
  const { displayRequestError } = useContext(PopupContext);
  const [showCategories, setShowCategories] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchFilters = async () => {
    setIsLoading(true);
    try {
      const res = await api.getWinnersCircleFilters();
      if (res.status === 200 && res.data) {
        setIsLoading(false);
        const filters = res.data;
        filters.categories.push(gameRoomStrings.myFavoritePrize);
        const index = filters.categories.indexOf('test');
        if (index > -1) {
          filters.categories.splice(index, 1);
        }
        setData(sort(filters.categories));
      }
    } catch (error) {
      setIsLoading(false);
      displayRequestError(error.message);
    }
  };
  useEffect(() => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setViewItemIndex(categoryIndex || 0);
  }, [categoryIndex]);

  useEffect(() => {
    if(shouldRefreshGameRoom){
      showCategories ? setShowCategories(false) : onSelect(null);
      setSearchData(null);
      setShowFilter(true);
      onMachineSearchClose();
    };
  }, [shouldRefreshGameRoom]);

  const handleOpenRank = () => {
    AsyncStorage.setItem("SHOW_RANK", "---")
    setOpenRankingBar(true)
  }

  const renderItem = useCallback(({ item, index }) => {
    return viewItemIndex === index ? (
      <SelectedContainer>
        <ItemContainer
          onPress={() => {
            setViewItemIndex(index);
            onSelect(item === 'ALL' ? null : item, index);
          }}
          backgroundColor={viewItemIndex === index ? color.blue : color.governorBay}
        >
          {viewItemIndex === index ? (
            <SelectedLabel>{item === 'ALL' ? 'All' : item}</SelectedLabel>
          ) : (
            <ItemLabel>{item === 'ALL' ? 'All' : item}</ItemLabel>
          )}
        </ItemContainer>
      </SelectedContainer>
    ) : (
      <NormalContainer>
        <ItemContainer
          onPress={() => {
            setViewItemIndex(index);
            onSelect(item === 'ALL' ? null : item, index);
          }}
        >
          {viewItemIndex === index ? (
            <SelectedLabel>{item === 'ALL' ? 'All' : item}</SelectedLabel>
          ) : (
            <ItemLabel>{item === 'ALL' ? 'All' : item}</ItemLabel>
          )}
        </ItemContainer>
      </NormalContainer>
    );
  }, [viewItemIndex, onSelect]);
  const KeyExtractor = useCallback((item) => item, []);
  return (
    <TopbarContainer>
      <SearchContainer>
        {!showCategories && (
          <IconButtonView>
            <IconButtonWrapper
              size={36}
              icon={newSearchGameroom}
              testID="search-button"
              onPress={() => {
                // eslint-disable-next-line no-unused-expressions
                showFilter ? setShowFilter(false) : onSearch(searchData);
              }}
            />
          </IconButtonView>
        )}
        {showFilter && (
          <IconButtonView>
            <AllMachinesIconButton
              size={36}
              icon={newCategories}
              testID="category-button"
              onPress={() => {
                if (!data) {
                  fetchFilters();
                }
                setShowCategories(true);
                setCurrentSectionIndex()
              }}
            />
          </IconButtonView>
        )}
        {showCategories && (
          isLoading ? <ActivityIndicator size="large" color={color.white} /> : <CarouselContainer>
            <FlatList
              data={data}
              renderItem={renderItem}
              numColumns={1}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={KeyExtractor}
              initialNumToRender={1}
            />
          </CarouselContainer>
        )}

        {showFilter && !showCategories && (
          <IconButtonView>
            <AllMachinesIconButton
              size={36}
              icon={newExplore}
              testID="machine-button"
              onPress={() => {
                // eslint-disable-next-line no-unused-expressions
                showFilter && onExploreTap();
              }}
            />
          </IconButtonView>
        )}

        {!openRankingBar && !showCategories && showFilter && (
          <IconButtonView>
            <AllMachinesIconButton
              size={36}
              icon={newLeaderboard}
              testID="machine-button"
              onPress={handleOpenRank}
            />
          </IconButtonView>
        )}

        {!showFilter && (
          <InputBox
            allowFontScaling={false}
            testID="input-box"
            placeholder={gameRoomStrings.bottomSearchPlaceHolder}
            placeholderTextColor={color.grayPlaceholder}
            onChangeText={value => setSearchData(value)}
            value={searchData}
            fontFamily={fontFamily.reg}
            autoCorrect={false}
            onSubmitEditing={() => {
              onSearch(searchData);
            }}
          />
        )}
        {(!showFilter || showCategories) && (
          !isLoading && <CrosIconButtonView>
            <CrossIconButtonWrapper
              size={24}
              icon={ExitCircle}
              testID="close-button-search"
              onPress={() => {
                // eslint-disable-next-line no-unused-expressions
                showCategories ? setShowCategories(false) : onSelect(null);
                setSearchData(null);
                setShowFilter(true);
                onMachineSearchClose();
              }}
            />
          </CrosIconButtonView>
        )}
      </SearchContainer>
    </TopbarContainer>
  );
};

TopSearchBar.propTypes = {
  categoryIndex: PropTypes.number.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onExploreTap: PropTypes.func.isRequired,
  setOpenRankingBar: PropTypes.func.isRequired,
  setCurrentSectionIndex: PropTypes.func.isRequired,
  onMachineSearchClose: PropTypes.func,
  openRankingBar: PropTypes.bool.isRequired
};

export default TopSearchBar;
