//
//  GetSocialNotificationCustomization.h
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface GetSocialNotificationCustomization : NSObject

/*!
 * @abstract It can contain a valid url, or a drawable, like 'drawable/notification_background'.
 * Supported only on Android.
 */
@property(nonatomic, strong, nullable) NSString *backgroundImageConfiguration;

/*!
 * @abstract Color of title text.
 * Supported only on Android.
 */
@property(nonatomic, strong, nullable) NSString *titleColor;

/*!
 * @abstract Color of text.
 * Supported only on Android.
 */
@property(nonatomic, strong, nullable) NSString *textColor;


@end

NS_ASSUME_NONNULL_END
