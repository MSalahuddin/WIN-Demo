//
//  GetSocialNotificationContent.h
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GetSocial/GetSocialAction.h>
#import <GetSocial/GetSocialActionButton.h>
#import <GetSocial/GetSocialConstants.h>
#import <GetSocial/GetSocialMediaAttachment.h>
#import <GetSocial/GetSocialNotificationBadge.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/*!
 * @abstract Class to define Push notification content.
 */
@interface GetSocialNotificationContent : NSObject

/*!
 * @abstract Init method, should not be called.
 */
- (instancetype)init NS_UNAVAILABLE;

/*!
 * Create notification with text.
 * @param text text to be displayed to receivers.
 * @return new notification content.
 */
+ (GetSocialNotificationContent *)withText:(NSString *)text;

/*!
 * Create notification from the template configured on the GetSocial Dashboard.
 * @param templateName name of the template on the GetSocial Dashboard. Case-sensitive.
 * @return new notification content.
 */
+ (GetSocialNotificationContent *)withTemplateName:(NSString *)templateName;

/*!
 * Set notification action to be performed on click.
 * @param action what should be done when user clicks on notification.
 */
- (void)setAction:(GetSocialAction *)action;

/*!
 * @abstract Add an action button to the content.
 * @param actionButton GetSocialActionButton instance.
 */
- (void)addActionButton:(GetSocialActionButton *)actionButton;

/*!
 * @abstract Add array of action buttons to the content.
 * @param actionButtons array of GetSocialActionButton instances.
 */
- (void)addActionButtons:(NSArray<GetSocialActionButton *> *)actionButtons;

/*!
 * Set notification text. If you use template, your text will be overriden by this.
 * @param text notification text.
 */
- (void)setText:(NSString *)text;

/*!
 * Set notification title. If you use template, your title will be overriden by this.
 * @param title notification title.
 */
- (void)setTitle:(NSString *)title;

/*!
 * Set template name. Notification will use values from the GetSocial Dashboard as title and text.
 * But [GetSocialNotificationContent setTitle:] or [GetSocialNotificationContent setText:] have higher priority and will override template values.
 * @param templateName name of the template on the dashboard. Case-sensitive.
 */
- (void)setTemplateName:(NSString *)templateName;

/*!
 * If you specified placeholders on the GetSocial Dashboard for your template title or text - you can replace it using this method.
 * For example, if your template text it "Hello,  [USERNAME].", call [notificationContent addTemplatePlaceholderValue:@"My actual name"
 * withKey:@"USERNAME"]. Brackets should be omitted in key. Won't make any effect without template name.
 * @param value actual text that should be used instead.
 * @param key placeholder on the GetSocial Dashboard.
 */
- (void)addTemplatePlaceholderValue:(NSString *)value forKey:(NSString *)key;

/*!
 * Add all keys and values from map to template placeholders.
 * @param templateData template placeholders map.
 */
- (void)addTemplatePlaceholders:(NSDictionary<NSString *, NSString *> *)templateData;

/*!
 * Attach the media to notification content.
 * @param mediaAttachment media attachment.
 */
- (void)setMediaAttachment:(GetSocialMediaAttachment *)mediaAttachment;

/**
 * @abstract Customize notification, like change background image, title and text color.
 * Supported only on Android.
 * @param customization GetSocialNotificationCustomization instance.
 */
- (void)setCustomization:(GetSocialNotificationCustomization *)customization;

/**
 * @abstract Set the badge change.
 * Supported only on iOS.
 * @param badge Badge changes/
 */
- (void)setBadge:(GetSocialNotificationBadge *)badge;

@end

NS_ASSUME_NONNULL_END
