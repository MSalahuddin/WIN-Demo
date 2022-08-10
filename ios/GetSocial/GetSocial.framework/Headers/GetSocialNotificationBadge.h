//
//  GetSocialNotificationBadge.h
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface GetSocialNotificationBadge : NSObject

/**
 * @abstract Creates badge update which increase current badge value by a value passed as parameter.
 * If negative is passed, badge will be decreased.
 * @param value Badge will be increase by this value.
 */
+ (GetSocialNotificationBadge *)increaseBy:(int)value;

/**
 * @abstract Creates badge update which set badge to passed value. If value is zero or negative, badge is removed.
 * @param value Badge will be set to this value.
 */
+ (GetSocialNotificationBadge *)setTo:(int)value;

@end

NS_ASSUME_NONNULL_END
