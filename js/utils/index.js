import { Linking, Alert, Platform } from 'react-native';
import moment from 'moment';

import { getLocales } from 'react-native-localize';
import { commonStrings } from '../stringConstants';
import { PATHS, SCREENS, WC_FILTER_OPTION_TYPE } from '../constants';
import axios from 'axios';
import Config from 'react-native-config';


export const formatTimeString = time => {
  if (time === 0) return '00:00';
  if (!time || Number.isNaN(parseInt(time, 10))) {
    return null;
  }
  const minute = parseInt(time / 60, 10);
  const minuteString = minute < 10 ? `0${minute}` : minute.toString();
  const seconds = time % 60;
  const secondsString = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${minuteString}:${secondsString}`;
};

export const parseDatetime = dateString => {
  const dateObj = new Date(dateString);
  const date = dateObj.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const time = dateObj.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
  return { date, time };
};

export const displayError = (error, onPress = () => { }) => {
  Alert.alert(commonStrings.error, error, [{ text: commonStrings.ok, onPress }], { cancelable: false });
};


export const convertNumberToStringWithComma = value =>
  Platform.OS === 'android' ?
    Number(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") :
    Number(value).toLocaleString();

// Counter scaling rules (tokens):
// 0 - 9,999 = 0 - 9,999
// 10,000 - 99,999 = 10k - 99.9k
// 100,000 + = 100k (no decimals in amounts over 100,000)
export const formatTokensLabel = value => {
  if (value < 10000) {
    return Platform.OS === 'android' ?
    Number(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") :
    Number(value).toLocaleString();
  }
  if (value >= 10000 && value < 100000) {
    return `${Number(value / 1000).toFixed(1)}K`;
  }
  if (value >= 100000) {
    return `${Number(value / 1000).toFixed(0)}K`;
  }
  return 'NaN';
};

// Counter scaling rules (tickets):
// 0 - 99,999 = 0 - 99,999
// 100,000+ = 100K+
// 105,000 = 105K
// 115,500 = 115.5K
// 999,900 = 999.9K
export const formatTicketsLabel = value => {
  if (value < 100000) {
  return Platform.OS === 'android' ?
    Number(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 
    Number(value).toLocaleString();
  }
  if (value >= 100000) {
    return `${Number(value / 1000).toFixed(1)}K`;
  }

  return 'NaN';
};

/**
 * capitalize every word in the string
 * @param string (e.g. token pack)
 * @returns capitalized string (e.g. Token Pack)
 */
export const capitalize = string => string && string.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());

export const openUrl = async url => {
  try {
    await Linking.openURL(url);
  } catch (error) {
    // TODO: fail silently
  }
};

export const getRouteNameForPath = path => {
  switch (path) {
    case PATHS.GAME_ROOM:
      return SCREENS.GAME_ROOM;
    case PATHS.PRIZE_VAULT:
      return SCREENS.PRIZE_VAULT;
    case PATHS.TOKEN_STORE:
      return SCREENS.GAME_CARD_RELOAD;
    case PATHS.WINNERS_CIRCLE:
      return SCREENS.WINNERS_CIRCLE;
    case PATHS.WALLET:
      return SCREENS.MY_WALLET;
      case PATHS.ACCOUNT_PROFILE:
        return SCREENS.ACCOUNT_PROFILE;
    default:
      return SCREENS.GAME_ROOM;
  }
};

/**
 * insert promo card info in every 6th element of machine data array
 * @params promo card data and machine data
 * @returns new array which every 6th data should be promo card info
 */
export const insertPromoCard = (promoCardData, watchAdCardData, machineData) => {
  if (promoCardData === null  || (Array.isArray(machineData) && machineData.length < 6)) {
    return machineData;
  }
  
  const newPromoCardData = { isPromoCard: true, ...promoCardData };
  const newWatchAdCardData = { watchAd: true, ...watchAdCardData }

  return machineData.reduce((accumulator, machine, index) => {
    if (accumulator.length !== 0 && index % 5 === 0) {
      accumulator.push(newPromoCardData);
    } else if (watchAdCardData && accumulator.length !== 0 && index % 7 === 0) {
      accumulator.push(newWatchAdCardData);
    }
    return [...accumulator, machine];
  }, []);
};

/**
 * remove dollar sign $ from a string
 * @params a string that may contain a dollar sign
 * @returns new string that does not contain dollar sign
 */
export const removeDollarSign = price => {
  if (typeof price !== 'string') {
    return price;
  }
  return +price.replace('$', '');
};

/**
 * change an array of strings to objects for filters
 * @params an array of strings
 * @returns an array of objects with 'value' and 'label' for filters
 */
export const changeDataFormatForPicker = (data, type = '') => {
  if (!Array.isArray(data)) {
    return null;
  }
  const filterData = data.filter(n => n != null);
  return filterData.map(item => {
    if (item.toLocaleLowerCase() === 'all') {
      const label = type === WC_FILTER_OPTION_TYPE.CATEGORY ? commonStrings.sortingCategory : commonStrings.allTickets;
      return { label, value: commonStrings.all };
    }
    // Adding comma's in prize cost
    if (type === WC_FILTER_OPTION_TYPE.COST) {
      if (item.indexOf('-') > -1) {
        const [minTicketsCost, maxTicketsCost] = item.split('-');
        const minCost = minTicketsCost.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const maxCost = maxTicketsCost.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const prizeCost = `${minCost}-${maxCost}`;
        return { label: prizeCost.toString(), value: item };
      }
      const [maxTicketsCost] = item.split('+');
      const maxCost = maxTicketsCost.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      const prizeCost = `${maxCost}+`;
      return { label: prizeCost.toString(), value: item };
    }

    return { label: item, value: item };
  });
};

/**
 * Get minTicketsCost and maxTicketsCost from string
 * @params a string "0 - 5000" or "5000+"
 * @returns any object minTicketsCost and maxTicketsCost
 */
export const getMinMaxTicketsCost = ticketOptionString => {
  if (ticketOptionString.indexOf('-') > -1) {
    const [minTicketsCost, maxTicketsCost] = ticketOptionString.split('-');
    return {
      minTicketsCost: minTicketsCost.replace(/ /g, ''),
      maxTicketsCost: maxTicketsCost.replace(/ /g, '')
    };
  }

  if (ticketOptionString.indexOf('+') > -1) {
    return { minTicketsCost: ticketOptionString.replace(/[+ ]/g, '') };
  }

  return null;
};

/**
 * Convert timestamp to date format for display
 * @param timestamp e.g: '2019-11-29T23:55:12.123493'
 * @returns date in displayed format e.g: 'Nov. 29, 2019' or 'May 29, 2019'
 */
export const getDisplayDate = timestamp => {
  const utcString = moment.utc().format(timestamp);
  const dateTime = moment.utc(utcString).local();
  const year = dateTime.year();
  const monthThreeCharacters = dateTime.format('MMM');
  const monthAllCharacters = dateTime.format('MMMM');
  const date = dateTime.date();
  const monthDisplay = monthThreeCharacters === monthAllCharacters ? monthThreeCharacters : `${monthThreeCharacters}.`;

  return `${monthDisplay} ${date}, ${year}`;
};

/**
 * Convert timestamp to time format for display
 * @param timestamp e.g '2019-11-29T23:55:12.123493'
 * @returns time in displayed format dependant on user region e.g '11:55 PM' or '23:55'
 */
export const getDisplayTime = timestamp => {
  const locales = getLocales();
  const region = locales.length > 1 ? getLocales()[0].languageTag : [];
  const dateObject = new Date(timestamp);
  const time = dateObject.toLocaleTimeString(region, { hour: '2-digit', minute: '2-digit' });
  return time;
};

/**
 * Calculate displaying time since timestamp param until current time
 * @param timestamp e.g '2020-04-28T00:00:00+00:00'
 * @returns time difference displayed in truncated format (ie. 30m or 1h or 1d)
 */
export const getDisplayTimeSince = timestamp => {
  const dateObject = new Date(timestamp);
  const currentDateTime = new Date(Date.now());
  const timeDiff = currentDateTime.getTime() / 1000 - dateObject.getTime() / 1000;

  if (timeDiff < 3600) {
    const minutes = Math.trunc(timeDiff / 60);
    return `${minutes}m`;
  }
  if (timeDiff < 86400) {
    const hours = Math.trunc(timeDiff / 3600);
    return `${hours}h`;
  }
  const days = Math.trunc(timeDiff / 86400);
  return `${days}d`;
};

/**
 * Calculate displaying time since timestamp param until current time
 * @param timestamp e.g '2020-04-28T00:00:00+00:00'
 * @returns time difference displayed in truncated format (ie. 30m or 1h or 1d)
 */
export const SplitTime = timestamp => {
const firstColon = timestamp.indexOf(":");
const secondColon = timestamp.indexOf(":",firstColon+1);
const thirdColon = timestamp.indexOf(":",secondColon+1);
// eslint-disable-next-line radix
const day = parseInt(timestamp.slice(0,firstColon))*86400;
// eslint-disable-next-line radix
const hour =parseInt(timestamp.slice(firstColon+1,secondColon))*3600;
// eslint-disable-next-line radix
const minute =parseInt(timestamp.slice(secondColon+1,thirdColon))*60;
// eslint-disable-next-line radix
const second =parseInt(timestamp.slice(thirdColon+1,timestamp.length))
const timeDiff = day + hour+minute+second

if (timeDiff < 3600) {
  const minutes = Math.trunc(timeDiff / 60);
  return `${minutes}m`;
}
if (timeDiff < 86400) {
  const hours = Math.trunc(timeDiff / 3600);
  return `${hours}h`;
}
const days = Math.trunc(timeDiff / 86400);
return `${days}d`;


};


export const GetRemainingTime = (remainingTime,showDays) => {
 if(showDays){
   if(remainingTime?.resetDays > 0){
     if(remainingTime?.resetDays > 1)
     return `${remainingTime?.resetDays} days`
    
     return `${remainingTime?.resetDays} day`
   }
   if(remainingTime?.resetHours > 0){
    return `${remainingTime?.resetHours} h ${remainingTime?.resetMinutes} m`
  }
  if(remainingTime?.resetHours <= 0  && remainingTime?.resetMinutes > 0){
    return `${remainingTime?.resetMinutes} m`
  }

 }
  if(!showDays){
    if(remainingTime?.resetHours > 0){
      return `${remainingTime?.resetHours} h ${remainingTime?.resetMinutes} m`
    }
    if(remainingTime?.resetHours <= 0 && remainingTime?.resetMinutes > 0){
      return `${remainingTime?.resetMinutes} m`
    }
  }
  return 0
  };

/**
 * Calculate percentage
 * @params currentNumber totalNumber e.g (3, 10)
 * @returns percentage of currentNumber with respect to totalNumber
 */
export const getPercentage = (currentNumber, totalNumber) => {
  if (totalNumber === 0) return null;

  return 100 * (currentNumber / totalNumber);
};

export const getDateTime =  async () => {
  const date = new Date()
  return date
};

export const numberWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const PrizeNameZapier = (prizeName,userName,email) => {
  const date = new Date()
  const [day,month,year] = [date.getDate(),date.getMonth(),date.getFullYear()]
  axios.post(Config.ZAPIER_URL,{
    prizeName:prizeName,
    userName:userName,
    email:email,
    submitDate:`${day}-${month+1}-${year}`
  })
};

export const convertToSeconds = (days, hours, minutes, seconds) => {
  return Number(days) * 24 * 60 * 60 + Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
}