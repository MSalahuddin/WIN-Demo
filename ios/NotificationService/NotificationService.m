//
//  NotificationService.m
//  NotificationService
//
//  Created by Masology on 07/06/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "NotificationService.h"
#import <BlueShift-iOS-Extension-SDK/BlueShiftPushNotification.h>


@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
  
  self.contentHandler = contentHandler;
  self.bestAttemptContent = [request.content mutableCopy];
  
  NSString * const BLUESHIFT_API_KEY_PRODUCTION = @"3fa1980d9cbfaacdb36c71208194daf2";
  NSString * const BLUESHIFT_API_KEY_STAGING = @"ce87ca6ea23ec9d88eb16b025c682db6";
  NSString * const APP_GROUP_ID_PRODUCTION = @"group.com.playtertainment.ww";
  NSString * const APP_GROUP_ID_STAGING = @"group.com.playtertainment.ww.stg";
  NSString * const APP_GROUP_ID_DEVELOPMENT = @"group.com.playtertainment.ww.beta";
  NSString * const BUNDLE_ID_PRODUCTION = @"com.playtertainment.ww.NotificationService";
  NSString * const BUNDLE_ID_STAGING = @"com.playtertainment.ww.stg.NotificationService";
  
  NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
  
  if([bundleIdentifier isEqualToString: BUNDLE_ID_PRODUCTION]) {
    [[BlueShiftPushNotification sharedInstance] setApiKey: BLUESHIFT_API_KEY_PRODUCTION];
  }
  else if([bundleIdentifier isEqualToString: BUNDLE_ID_STAGING]){
    [[BlueShiftPushNotification sharedInstance] setApiKey: BLUESHIFT_API_KEY_STAGING];
  }
  else{
    [[BlueShiftPushNotification sharedInstance] setApiKey: BLUESHIFT_API_KEY_STAGING];
  }
  
  
  // Modify the notification content here...
  if([[BlueShiftPushNotification sharedInstance] isBlueShiftPushNotification:request]) {
    if([bundleIdentifier isEqualToString: BUNDLE_ID_PRODUCTION]) {
      self.bestAttemptContent.attachments = [[BlueShiftPushNotification sharedInstance] integratePushNotificationWithMediaAttachementsForRequest:request andAppGroupID: APP_GROUP_ID_PRODUCTION];
    }
    else if([bundleIdentifier isEqualToString: BUNDLE_ID_STAGING]){
      self.bestAttemptContent.attachments = [[BlueShiftPushNotification sharedInstance] integratePushNotificationWithMediaAttachementsForRequest:request andAppGroupID: APP_GROUP_ID_STAGING];
    }
    else{
      self.bestAttemptContent.attachments = [[BlueShiftPushNotification sharedInstance] integratePushNotificationWithMediaAttachementsForRequest:request andAppGroupID: APP_GROUP_ID_DEVELOPMENT];
    }
  } else {
    // Your Custom code comes here
  }
  
  self.contentHandler(self.bestAttemptContent);
}

- (void)serviceExtensionTimeWillExpire {
  // Called just before the extension will be terminated by the system.
  // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
  if([[BlueShiftPushNotification sharedInstance] hasBlueShiftAttachments]) {
    self.bestAttemptContent.attachments = [BlueShiftPushNotification sharedInstance].attachments;
  }
  self.contentHandler(self.bestAttemptContent);
}

@end
