//
//  BlueshiftBridge.swift
//  Win_demo
//
//  Created by Masology on 17/12/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//
import UIKit
import Foundation
@objc(BlueshiftBridge)
class BlueshiftBridge: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {return true}
  let screenViewed = "screen_viewed"
  // MARK: Track Events
  @objc func identifyWithDetails(_ details: Dictionary<AnyHashable, Any>) {
    BlueShift.sharedInstance()?.identifyUser(withDetails: details, canBatchThisEvent: false)
  }
  @objc func trackCustomEvent(_ eventName: String, details: Dictionary<AnyHashable, Any> ,canBatchThisEvent: Bool) {
      BlueShift.sharedInstance()?.trackEvent(forEventName: eventName, andParameters: details, canBatchThisEvent: canBatchThisEvent)
  }
  @objc func trackScreenView(_ screenName: String, details: Dictionary<AnyHashable, Any> ,canBatchThisEvent: Bool) {
      var params = details
      params[screenViewed] = screenName
      BlueShift.sharedInstance()?.trackEvent(forEventName: kEventPageLoad, andParameters: params, canBatchThisEvent: canBatchThisEvent)
  }
  // MARK: Set user info
  @objc func setUserInfoEmailId(_ emailId: String) {
    BlueShiftUserInfo.sharedInstance()?.email = emailId
    BlueShiftUserInfo.sharedInstance()?.save()
    BlueShift.sharedInstance()?.identifyUser(withEmail: emailId, andDetails: nil, canBatchThisEvent: false)
  }
  @objc func setUserInfoCustomerId(_ customerId: String) {
    BlueShiftUserInfo.sharedInstance()?.retailerCustomerID = customerId
    BlueShiftUserInfo.sharedInstance()?.save()
    BlueShift.sharedInstance()?.identifyUser(withDetails:nil, canBatchThisEvent: false)
  }
  @objc func removeUserInfo() {
    BlueShiftUserInfo.removeCurrentUserInfo()
  }
  // MARK: Push notifications
  @objc func registerForRemoteNotification() {
    BlueShift.sharedInstance()?.appDelegate?.registerForNotification()
  }
  @objc func setEnablePush(_ isEnabled: Bool) {
    BlueShiftAppData.current()?.enablePush = isEnabled
  }
  // MARK: Set location for tracking
  @objc func setCurrentLocation(_ lat: Double, long:Double) {
    let location = CLLocation(latitude: lat, longitude: long)
    BlueShiftDeviceData.current()?.currentLocation = location
  }
  //MARK: In-app notificatins
  @objc func fetchInAppNotification() {
    BlueShift.sharedInstance()?.fetchInAppNotification(fromAPI: (() -> Void)? {}!, failure: ((Error?) -> Void)?{_ in
    }!)
  }
  @objc func displayInAppNotification() {
    DispatchQueue.main.async {
      BlueShift.sharedInstance()?.displayInAppNotification()
    }
  }
}
