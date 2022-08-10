//
//
// Copyright (c) 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GetSocial/GetSocialActionButton.h>
#import <GetSocial/GetSocialAction.h>
#import <GetSocial/GetSocialConstants.h>
#import <GetSocial/GetSocialPostAuthor.h>
#import <GetSocial/GetSocialNotificationCustomization.h>

/*!
 * Type definition for different notification statuses.
 */
typedef NSString *GetSocialNotificationStatus NS_EXTENSIBLE_STRING_ENUM;

/*!
 * Notification is read.
 */
static const GetSocialNotificationStatus GetSocialNotificationStatusRead = @"read";

/*!
 * Notification is unread.
 */
static const GetSocialNotificationStatus GetSocialNotificationStatusUnread = @"unread";

/*!
 * Notification is consumed.
 */
static const GetSocialNotificationStatus GetSocialNotificationStatusConsumed = @"consumed";

/*!
 * Notification is ignored.
 */
static const GetSocialNotificationStatus GetSocialNotificationStatusIgnored = @"ignored";

/*!
 * @typedef GetSocialNotificationType
 * @abstract Enumeration represents possible notification types.
 */
typedef NSString *GetSocialNotificationType NS_EXTENSIBLE_STRING_ENUM;

/*!
 * Someone commented on your activity.
 */
static const GetSocialNotificationType GetSocialNotificationTypeComment = @"comment";

/*!
 * Someone liked your activity.
 */
static const GetSocialNotificationType GetSocialNotificationTypeLikeActivity = @"activity_like";

/*!
 * Someone liked your comment.
 */
static const GetSocialNotificationType GetSocialNotificationTypeLikeComment = @"comment_like";

/*!
 * Someone commented on the activity where you've commented before.
 */
static const GetSocialNotificationType GetSocialNotificationTypeRelatedComment = @"related_comment";

/*!
 * You became friends with another user.
 */
static const GetSocialNotificationType GetSocialNotificationTypeNewFriendship = @"friends_add";

/*!
 * Someone accepted your invite.
 */
static const GetSocialNotificationType GetSocialNotificationTypeInviteAccepted = @"invite_accept";

/*!
 * Someone mentioned you in comment.
 */
static const GetSocialNotificationType GetSocialNotificationTypeMentionInComment = @"comment_mention";

/*!
 * Someone mentioned you in activity.
 */
static const GetSocialNotificationType GetSocialNotificationTypeMentionInActivity = @"activity_mention";

/*!
 * Someone replied to your comment.
 */
static const GetSocialNotificationType GetSocialNotificationTypeReplyToComment = @"comment_reply";

/*!
 * Smart targeting Push Notifications.
 */
static const GetSocialNotificationType GetSocialNotificationTypeTargeting = @"targeting";

/*!
 * Notifications sent from the Dashboard when using "Test Push Notifications".
 */
static const GetSocialNotificationType GetSocialNotificationTypeDirect = @"direct";

/*!
 * Notification sent from SDK.
 */
static const GetSocialNotificationType GetSocialNotificationTypeSDK = @"custom";

#pragma mark - GetSocial Notification Key
/*!
 *
 */
typedef NSString *GetSocialNotificationKey NS_EXTENSIBLE_STRING_ENUM DEPRECATED_ATTRIBUTE;

#pragma mark - GetSocial OpenActivity Notification Keys

/*!
 * GetSocialNotificationKey_OpenActivity_ActivityId and GetSocialNotificationKey_OpenActivity_FeedName are mutually exclusive.
 */
extern GetSocialNotificationKey GetSocialNotificationKey_OpenActivity_ActivityId DEPRECATED_ATTRIBUTE;

/*!
 * Optional. Can be present with GetSocialNotificationKey_OpenActivity_ActivityId only.
 */
extern GetSocialNotificationKey GetSocialNotificationKey_OpenActivity_CommentId DEPRECATED_ATTRIBUTE;

/*!
 * GetSocialNotificationKey_OpenActivity_ActivityId and GetSocialNotificationKey_OpenActivity_FeedName are mutually exclusive.
 */
extern GetSocialNotificationKey GetSocialNotificationKey_OpenActivity_FeedName DEPRECATED_ATTRIBUTE;

#pragma mark - GetSocial OpenProfile Notification Keys

/*!
 * ID of user to be opened.
 */
extern GetSocialNotificationKey GetSocialNotificationKey_OpenProfile_UserId DEPRECATED_ATTRIBUTE;

#pragma mark - GetSocial OpenUrl Notification Keys

/*!
 * URL to be opened.
 */
extern GetSocialNotificationKey GetSocialNotificationKey_OpenUrl_Url DEPRECATED_ATTRIBUTE;

/*!
 * Describes notification object.
 */
@interface GetSocialNotification : NSObject

/*!
 * Returns an enum value of the type.
 */
@property(nonatomic, readonly) GetSocialNotificationType type;

/*!
 * Return notification status.
 */
@property(nonatomic, readonly) GetSocialNotificationStatus status;

/*!
 * Date of notification creation.
 * @return UNIX-timestamp of creation date in seconds.
 */
@property(nonatomic, readonly) NSUInteger createdAt;

/*!
 * Get the unique notification identifier.
 */
@property(nonatomic, copy, readonly) GetSocialId notificationId;

/*!
 * Message of Push Notification.
 */
@property(nonatomic, copy, readonly) NSString *text;

/*!
 * Title of Push Notification.
 */
@property(nonatomic, copy, readonly) NSString *title;

/*!
 * Image url in Push Notification.
 */
@property(nonatomic, copy, readonly) NSString *imageUrl;

/*!
 * Video url in Push Notification.
 */
@property(nonatomic, copy, readonly) NSString *videoUrl;

/*!
 * Action to perform on notification click.
 */
@property(nonatomic, strong, readonly) GetSocialAction *notificationAction;

/*!
 * Action buttons with notifications.
 */
@property(nonatomic, strong, readonly) NSArray<GetSocialActionButton *> *actionButtons;

/*!
 * Notification sender.
 */
@property(nonatomic, strong, readonly) GetSocialUserReference* sender;

/*!
 * Returns customization settings, like background image, title color, etc.
 * Settings used only on Android.
 */
@property(nonatomic, strong, readonly) GetSocialNotificationCustomization* customization;

/*!
 * Data passed with action.
 * @deprecated Use notificationAction property.
 */
@property(nonatomic, strong, readonly) NSDictionary<GetSocialNotificationKey, NSString *> *actionData DEPRECATED_ATTRIBUTE;

/*!
 * Return was notification read by user or not.
 * @return YES, if notification was clicked by user or marked as read by developer.
 * @deprecated Use status property.
 */
@property(nonatomic, readonly) BOOL wasRead DEPRECATED_ATTRIBUTE;
/*!
 * Returns an enum value of the action.
 * @deprecated Use notificationAction property.
 */
@property(nonatomic, readonly) GetSocialNotificationActionType action DEPRECATED_ATTRIBUTE;


@end
