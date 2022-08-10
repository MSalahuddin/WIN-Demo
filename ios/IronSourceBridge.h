//
//  IronSourceBridge.h
//  Win_demo
//
//  Created by winner weinner on 15/12/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#if __has_include(<React/RCTEventEmitter.h>)
#import <React/RCTEventEmitter.h>
#else
#import "RCTEventEmitter.h"
#endif

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#else
#import "RCTBridgeModule.h"
#endif

#import <IronSource/IronSource.h>
#import <IronSource/ISImpressionDataDelegate.h>

@interface IronSourceBridge : RCTEventEmitter <RCTBridgeModule, ISImpressionDataDelegate>

@end
