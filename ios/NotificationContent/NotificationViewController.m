//
//  NotificationViewController.m
//  NotificationContent
//
//  Created by Masology on 07/06/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "NotificationViewController.h"
#import <UserNotifications/UserNotifications.h>
#import <UserNotificationsUI/UserNotificationsUI.h>
#import <BlueShift-iOS-Extension-SDK/BlueShiftPushNotification.h>


@interface NotificationViewController () <UNNotificationContentExtension>


@end

@implementation NotificationViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  NSString * const APP_GROUP_ID_PRODUCTION = @"group.com.playtertainment.ww";
  NSString * const APP_GROUP_ID_STAGING = @"group.com.playtertainment.ww.stg";
  NSString * const APP_GROUP_ID_DEVELOPMENT = @"group.com.playtertainment.ww.beta";
  NSString * const BUNDLE_ID_PRODUCTION = @"com.playtertainment.ww.NotificationContent";
  NSString * const BUNDLE_ID_STAGING = @"com.playtertainment.ww.stg.NotificationContent";
  
  NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
  
  if([bundleIdentifier isEqualToString: BUNDLE_ID_PRODUCTION]) {
    self.appGroupID = APP_GROUP_ID_PRODUCTION;
  }
  else if([bundleIdentifier isEqualToString: BUNDLE_ID_STAGING]){
    self.appGroupID = APP_GROUP_ID_STAGING;
  }
  else{
    self.appGroupID = APP_GROUP_ID_DEVELOPMENT;
  }
}

- (void)viewDidAppear:(BOOL)animated {
  [super viewDidAppear:animated];
}

- (void)didReceiveNotification:(UNNotification *)notification {
  if([self isBlueShiftCarouselPushNotification:notification]) {
    [self showCarouselForNotfication:notification];
  } else {
    // Perform your codes here
  }
}

- (void)didReceiveNotificationResponse:(UNNotificationResponse *)response completionHandler:(void (^)(UNNotificationContentExtensionResponseOption))completion {
  //Place following codes after your code lines
  if([self isBlueShiftCarouselActions:response]) {
    [self setCarouselActionsForResponse:response completionHandler:^(UNNotificationContentExtensionResponseOption option) {
      completion(option);
    }];
  } else {
    
  }
}

@end
