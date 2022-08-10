//
//  GetSocialUINotificationCenterView.h
//  GetSocialUI
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <GetSocial/GetSocial.h>
#import "GetSocialUIView.h"

NS_ASSUME_NONNULL_BEGIN

/*!
 * Describes GetSocialUINotificationCenterView class.
 */
@interface GetSocialUINotificationCenterView : GetSocialUIView

/*!
 *  @abstract   Sets notification types to filter list of notifications.
 */
@property(nonatomic, copy) NSArray<NSString *> *filterTypes;

/*!
 *  @abstract   Sets notification action types to filter list of notifications.
 */
@property(nonatomic, copy) NSArray<NSString *> *filterActions;

/*!
 *  @abstract   Sets notification click handler.
 */
@property(nonatomic, copy) GetSocialUINotificationClickHandler clickHandler;

/*!
 *  @abstract   Sets notification action button click listener.
 */
@property(nonatomic, copy) GetSocialUINotificationActionButtonHandler actionButtonHandler;

@end

NS_ASSUME_NONNULL_END
