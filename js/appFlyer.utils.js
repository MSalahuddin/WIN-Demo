import { Platform } from 'react-native';
import appsFlyer from 'react-native-appsflyer';
import Config from 'react-native-config';
import { requestTrackingPermission } from 'react-native-tracking-transparency';

const config = {
    devKey: Config.APPSFLYER_DEV_KEY,
    isDebug: false,
    appId: Config.APP_STORE_ID,
    onInstallConversionDataListener: true,
    onDeepLinkListener: true,
    timeToWaitForATTUserAuthorization: 60
};

export const AFInit = async () => {
    try {
        await appsFlyer.initSdk(config);
        await requestTrackingPermission()
        return Promise.resolve()
    } catch (error) {
        return Promise.resolve()
    }
}

export function AFLogCustomEvent(name, values) {
    appsFlyer.logEvent(name, values, (res) => {
    }, (error) => {
    });
}

export function AFsetUserIdentityEvent(userId) {
    appsFlyer.setCustomerUserId(userId, (res) => {
    },(error) => {
    });
}

export const AFLogStandardEvent = async (eventName, eventProperties = null) => {
    appsFlyer.logEvent(eventName, eventProperties, (res) => {
    }, (error) => {
    });
}
