import branch, { BranchEvent } from 'react-native-branch';

export const setUserIdentity = async (userId) => {
    branch.setIdentity(userId);
}
export const logBranchCustomEvent = async (eventName, eventProperties = null) => {
    new BranchEvent(eventName, null, eventProperties).logEvent();
}   
export const logBranchStandardEvent = async (eventName, eventProperties = null) => {
  const event =  new BranchEvent(eventName, null, eventProperties);
  event.logEvent();
 }