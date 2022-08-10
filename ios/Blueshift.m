//
//  Blueshift.m
//  Win_demo
//
//  Created by Masology on 17/12/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(BlueshiftBridge, NSObject)
RCT_EXTERN_METHOD(identifyWithDetails:(NSDictionary *)details)
RCT_EXTERN_METHOD(trackCustomEvent:(NSString *)eventName details:(NSDictionary *) details canBatchThisEvent:(BOOL)canBatchThisEvent)
RCT_EXTERN_METHOD(trackScreenView:(NSString *)screenName details: (NSDictionary *)details canBatchThisEvent:(BOOL)canBatchThisEvent)
RCT_EXTERN_METHOD(setUserInfoEmailId:(NSString *)emailId)
RCT_EXTERN_METHOD(setUserInfoCustomerId:(NSString *)customerId)
RCT_EXTERN_METHOD(removeUserInfo)
RCT_EXTERN_METHOD(registerForRemoteNotification)
RCT_EXTERN_METHOD(setEnablePush:(BOOL)isEnabled)
RCT_EXTERN_METHOD(setCurrentLocation:(Double)lat long:(Double)long)
RCT_EXTERN_METHOD(fetchInAppNotification)
RCT_EXTERN_METHOD(displayInAppNotification)
@end
