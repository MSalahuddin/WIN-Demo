//
//  FBSDKTrackingSetting.m
//  Win_demo
//
//  Created by winner weinner on 17/09/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "FBSDKTrackingSetting.h"
#import <React/RCTConvert.h>


@implementation FBSDKTrackingSetting

RCT_EXPORT_MODULE(FBSDKTrackingSetting);

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

#pragma mark - React Native Methods

RCT_EXPORT_METHOD(getAdvertiserTrackingEnabled:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject)
{
  BOOL ATE = [FBSDKSettings isAdvertiserTrackingEnabled];
  resolve(@(ATE));
}

RCT_EXPORT_METHOD(isAutoLogAppEventsEnabled:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject)
{
  BOOL AAEE = [FBSDKSettings isAutoLogAppEventsEnabled];
  resolve(@(AAEE));
}

RCT_EXPORT_METHOD(isAdvertiserIDCollectionEnabled:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject)
{
  BOOL AICE = [FBSDKSettings isAdvertiserIDCollectionEnabled];
  resolve(@(AICE));
}

RCT_EXPORT_METHOD(setAdvertiserTrackingEnabled:(BOOL)ATE resolver:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject)
{
  BOOL result = [FBSDKSettings setAdvertiserTrackingEnabled:ATE];
  resolve(@(result));
}

RCT_EXPORT_METHOD(setAutoLogAppEventsEnabled:(BOOL)AAEE)
{
  [FBSDKSettings setAutoLogAppEventsEnabled:AAEE];
}

RCT_EXPORT_METHOD(setAdvertiserIDCollectionEnabled:(BOOL)AICE)
{
  [FBSDKSettings setAdvertiserIDCollectionEnabled:AICE];

}


@end

