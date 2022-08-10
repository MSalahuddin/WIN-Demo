import { requestTrackingPermission, getTrackingStatus } from 'react-native-tracking-transparency';
import branch from 'react-native-branch';
import FBSDKTrackingSetting  from  './facebook'


export const trackingStatus = async () => {
    const status = await getTrackingStatus()
    return status
}

export const trackingPermission = async () => {
    await requestTrackingPermission()
}

export const trackable = async () => {
    try {
        const trackingStatus = await getTrackingStatus();
        //  tracking API is not available on the current device. that's the case on Android devices and iPhones below iOS 14.
        if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
             // enable tracking features
            branch.disableTracking(false)
            await FBSDKTrackingSetting.setAdvertiserTrackingEnabled(true)
            FBSDKTrackingSetting.setAutoLogAppEventsEnabled(true)
            FBSDKTrackingSetting.setAdvertiserIDCollectionEnabled(true)
        }
        else {
            // default value of AutoLogAppEvents an AdvertiserIDCollection is enable
            branch.disableTracking(true)
            FBSDKTrackingSetting.setAdvertiserIDCollectionEnabled(false)
        }
    } catch (error) {
        // fail silently
    }

}

