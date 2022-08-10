import { NativeModules } from 'react-native'

const { BlueshiftBridge } = NativeModules;


export const logBlushiftEvent = (eventName, eventProperties = null) => BlueshiftBridge.trackCustomEvent(eventName, eventProperties, false)
export const setBlueShiftCustomerInfo = (playerId) => BlueshiftBridge.setUserInfoCustomerId(playerId)
export const setBlueShiftCustomerEmailId = (email) => BlueshiftBridge.setUserInfoEmailId(email)
