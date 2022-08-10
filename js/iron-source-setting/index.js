/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable no-fallthrough */
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { BUNDLE_ID } from '../constants'

const wwStagingIOS = { appKey : 'e30e0079' }
const wwStagingAndroid = { appKey : 'e6365c61' }
const wwReleaseIOS = { appKey : 'ccecdbf5' }
const wwReleaseAndroid = { appKey : 'cceca26d' }


// eslint-disable-next-line import/prefer-default-export
export const getAppInitKeys = async () => {
    const bundleId = DeviceInfo.getBundleId()
    const platform = Platform.OS
    const { BUNDLE_ID_DEVELOP, BUNDLE_ID_STAGING, BUNDLE_ID_RELEASE } =  BUNDLE_ID
    switch(bundleId){
        case BUNDLE_ID_DEVELOP:
            switch(platform){
            case "ios" :
            return wwStagingIOS
            case "android" :
            return wwStagingAndroid
            } 
        case BUNDLE_ID_STAGING:
            switch(platform){
            case "ios" :
            return wwStagingIOS
            case "android" :
            return wwStagingAndroid
            }
        case BUNDLE_ID_RELEASE :
            switch(platform){
            case "ios" :
            return wwReleaseIOS
            case "android" :
            return wwReleaseAndroid
        }
    }
}

