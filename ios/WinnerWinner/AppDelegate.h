/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <BlueShift-iOS-SDK/BlueShift.h>
#import <UserNotifications/UserNotifications.h>
#import <GoogleMobileAds/GoogleMobileAds.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate,
UNUserNotificationCenterDelegate,RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;
@property(strong, nonatomic) GADAppOpenAd* appOpenAd;

- (void)requestAppOpenAd;

@end

