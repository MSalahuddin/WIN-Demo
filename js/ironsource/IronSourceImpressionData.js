/* eslint-disable no-console */
import { NativeModules, NativeEventEmitter } from 'react-native';

const { IronSourceBridge } = NativeModules;
const IronSourceImpressionDataEventEmitter = new NativeEventEmitter(IronSourceBridge);

const eventHandlers = {
  ironSourceImpressionData: new Map()
};

const initializeImpressionData = () => IronSourceBridge.initializeImpressionData();

const addEventListener = (type, handler) => {
  switch (type) {
    case 'ironSourceImpressionData':
      eventHandlers[type].set(handler, IronSourceImpressionDataEventEmitter.addListener(type, handler));
      break;
    default:
  }
};

const removeEventListener = (type, handler) => {
  if (!eventHandlers[type].has(handler)) {
    return;
  }
  eventHandlers[type].get(handler).remove();
  eventHandlers[type].delete(handler);
};

const removeAllListeners = () => {
  IronSourceImpressionDataEventEmitter.removeAllListeners('ironSourceImpressionData');
};

export { initializeImpressionData, addEventListener, removeEventListener, removeAllListeners };
