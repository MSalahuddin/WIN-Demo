//
//  GetSocialNotificationBuilder.h
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GetSocial/GetSocialAction.h>
#import <GetSocial/GetSocialActionButton.h>
#import <GetSocial/GetSocialConstants.h>
#import <GetSocial/GetSocialNotification.h>
#import <GetSocial/GetSocialUserReference.h>

NS_ASSUME_NONNULL_BEGIN

/*!
 * Builder to create GetSocialNotification instances.
 */
@interface GetSocialNotificationBuilder : NSObject

/*!
 * @abstract Creates a new builder instance with the specified notification id.
 * @param notificationId notification id.
 */
+ (instancetype)builderWithId:(GetSocialId)notificationId;

/*!
 * @abstract Sets the notification type.
 * @param type notification type.
 */
- (void)setNotificationType:(GetSocialNotificationType)type;

/*!
 * @abstract Sets creation date.
 * @param createdAt creation date.
 */
- (void)setCreatedAt:(NSUInteger)createdAt;

/*!
 * @abstract Sets status.
 * @param status notification status.
 */
- (void)setStatus:(GetSocialNotificationStatus)status;

/*!
 * @abstract Sets the notification text.
 * @param text notification text.
 */
- (void)setText:(NSString *)text;

/*!
 * @abstract Sets the notification title.
 * @param title notification title.
 */
- (void)setTitle:(NSString *)title;

/*!
 * @abstract Sets the notification image.
 * @param imageUrl notification image.
 */
- (void)setImageUrl:(NSString *)imageUrl;

/*!
 * @abstract Sets the notification video.
 * @param videoUrl notification video.
 */
- (void)setVideoUrl:(NSString *)videoUrl;

/*!
 * @abstract Sets the notification action.
 * @param action notification action.
 */
- (void)setAction:(GetSocialAction *)action;

/*!
 * @abstract Sets the notification sender.
 * @param sender notification sender.
 */
- (void)setSender:(GetSocialUserReference *)sender;

/*!
 * @abstract Adds action button.
 * @param actionButton button to add.
 */
- (void)addActionButton:(GetSocialActionButton *)actionButton;

/*!
 * @abstract Adds array of action buttons.
 * @param actionButtons actionButtons to add.
 */
- (void)addActionButtons:(NSArray<GetSocialActionButton *> *)actionButtons;

/**
 * @abstract Customize notification, like change background image, title and text color.
 * Supported only on Android.
 * @param customization GetSocialNotificationCustomization instance.
 */
- (void)setCustomization:(GetSocialNotificationCustomization *)customization;

/*!
 * @abstract Creates the notification instance.
 */
- (GetSocialNotification *)build;

@end

NS_ASSUME_NONNULL_END
