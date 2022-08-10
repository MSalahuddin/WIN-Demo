//
//  IronSourceBridge.m
//  Win_demo
//
//  Created by winner weinner on 15/12/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "IronSourceBridge.h"
#import <React/RCTConvert.h>
#import <IronSource/IronSource.h>
#import <IronSource/ISImpressionDataDelegate.h>
#import <IronSource/ISImpressionData.h>

NSString *const kIronSourceImpressionData = @"ironSourceImpressionData";

@implementation IronSourceBridge {
    RCTResponseSenderBlock _requestIronSourceBridgeCallback;
    bool initialized;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
    return @[kIronSourceImpressionData];
}

RCT_EXPORT_METHOD(initializeImpressionData)
{
    if (!initialized) {
        NSLog(@"IronSource ImpressionData Initialized");
        [IronSource addImpressionDataDelegate:self];
        initialized = YES;
    }
}

- (void)impressionDataDidSucceed:(ISImpressionData *)impressionData {
    NSNumber *revenue = impressionData.revenue;
    NSString *adNetwork = impressionData.ad_network;
    NSString *adUnit = impressionData.ad_unit;
    NSString *instanceName = impressionData.instance_name;
    NSNumber *lifetimeRevenue = impressionData.lifetime_revenue;

    // NSLog(@"ImpressionData %@ Revenue AdNetwork AdUnit InstanceName %@", revenue, adNetwork, adUnit, instanceName);

    [self sendEventWithName:kIronSourceImpressionData body:@{
        @"revenue": revenue,
        @"adNetwork": adNetwork,
        @"adUnit": adUnit,
        @"instanceName": instanceName,
        @"lifetimeRevenue": lifetimeRevenue,
    }];
}

@end
