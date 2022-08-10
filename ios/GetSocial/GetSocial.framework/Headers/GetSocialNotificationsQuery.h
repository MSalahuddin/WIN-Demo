//
//
// Copyright (c) 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GetSocial/GetSocialAction.h>
#import <GetSocial/GetSocialConstants.h>
#import <GetSocial/GetSocialNotification.h>

/*!
 * @typedef NS_ENUM(NSUInteger, GetSocialNotificationsFilter)
 * @abstract Defines query types.
 */
typedef NS_ENUM(NSUInteger, GetSocialNotificationsFilter) {
    /*!
     * @abstract No filter.
     */
    NotificationsNoFilter = 0,
    /*!
     * @abstract Notifications created before the specified activity.
     */
    NotificationsBefore,
    /*!
     * @abstract Notifications created after the specified activity.
     */
    NotificationsAfter
};

NS_ASSUME_NONNULL_BEGIN

/*!
 * @abstract Class to create notification queries.
 */
@interface GetSocialNotificationsQuery : NSObject

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
 * @abstract Sets filter.
 *
 * @param   filter          filter object
 * @param   notificationId  id of notification
 */
- (void)setFilter:(GetSocialNotificationsFilter)filter notificationId:(GetSocialId)notificationId;

/*!
 * @abstract Max. number of returned items.
 *
 * @param   limit   limit
 */
- (void)setLimit:(int)limit;

/*!
 * @abstract Filter by actions.
 *
 * @param actions array of possible notification actions.
 */
- (void)setActions:(NSArray<GetSocialActionType> *)actions;

@end

NS_ASSUME_NONNULL_END
