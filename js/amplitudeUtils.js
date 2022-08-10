import RNAmplitude from 'react-native-amplitude-analytics';
import Config from 'react-native-config';

export const amplitude = new RNAmplitude(Config.AMPLITUDE_API_KEY);
export const logEvent = (eventName, eventProperties = null) => amplitude.logEvent(eventName, eventProperties);
export const setUserId = userId => amplitude.setUserId(userId);
export const setUserProperties = userProperties => amplitude.setUserProperties(userProperties);
export const increaseUserProperty = (property, amount = 1) => amplitude.addToUserProperty(property, amount);
export const logRevenueV2 = (revenueProperties) => amplitude.logRevenueV2(revenueProperties);