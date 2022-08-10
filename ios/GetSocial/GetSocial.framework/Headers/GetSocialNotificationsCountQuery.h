//
//
// Copyright (c) 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GetSocial/GetSocialNotification.h>

/*!
 * @abstract Class to create notification count queries.
 */
@interface GetSocialNotificationsCountQuery : NSObject

/*!
 * @abstract Query to get notifications with the provided statuses.
 * @param statuses statuses to find
 */
+ (instancetype)withStatuses:(NSArray<GetSocialNotificationStatus> *)statuses;

/*!
 * @abstract Query to get all notifications.
 */
+ (instancetype)withAllStatuses;

/*!
 * @abstract Query to get all notifications.
 * @deprecated Use withStatuses.
 */
+ (instancetype)readAndUnread DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Query to get all read notifications.
 * @deprecated Use withStatuses.
 */
+ (instancetype)read DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Query to get all unread notifications.
 * @deprecated Use withStatuses.
 */
+ (instancetype)unread DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Set notificaton types.
 *
 * @param types   notification types. Check @see GetSocialNotificationType enum for available notification types.
 */
- (void)setTypes:(NSArray<GetSocialNotificationType> *)types;

/*!
 * @abstract Sets all the available notification types.
 */
- (void)setAllTypes;

/*!
 * @abstract Filter by actions.
 * @param actions array of possible notification actions.
 */
- (void)setActions:(NSArray<GetSocialActionType> *)actions;

@end
