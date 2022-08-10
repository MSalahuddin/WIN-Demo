//
//  GetSocial
//
//  Copyright (c) 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/NSObject.h>

@class GetSocialConflictUser;
@class GetSocialPublicUser;
@class GetSocialActivityPost;
@class GetSocialReferralData;
@class GetSocialSuggestedFriend;
@class GetSocialUserReference;
@class GetSocialReferredUser;
@class GetSocialReferralUser;
@class GetSocialNotification;
@class GetSocialNotificationsSummary;
@class GetSocialAction;
@class GetSocialPromoCode;

#ifndef GetSocialLibrary_GetSocialConstants_h
#define GetSocialLibrary_GetSocialConstants_h

NS_ASSUME_NONNULL_BEGIN

/*!
 * @abstract Enumeration represents possible actions to be executed if application was started with clicking on GetSocial push notification.
 */
typedef NS_ENUM(NSInteger, GetSocialNotificationActionType) {
    /*!
     * @abstract Custom action.
     */
    GetSocialNotificationActionCustom = 0,
    /*!
     * @abstract Open user profile action.
     */
    GetSocialNotificationActionOpenProfile = 1,
    /*!
     * @abstract Open activity action.
     */
    GetSocialNotificationActionOpenActivity = 2,
    /*!
     * @abstract Open Smart Invites action.
     */
    GetSocialNotificationActionOpenInvites = 3,
    /*!
     * @abstract Open URL.
     */
    GetSocialNotificationActionOpenUrl = 4
};

/*!
 * @abstract Enumeration of possible reasons of content reporting.
 */
typedef NS_ENUM(NSInteger, GetSocialReportingReason) {
    /*!
     * @abstract Report because of inappropriate content.
     */
    GetSocialReportingReasonInappropriateContent,
    /*!
     * @abstract Report because of spam.
     */
    GetSocialReportingReasonSpam
};

/*!
 * @typedef BOOL (^GetSocialNotificationHandler)(GetSocialNotification *notification, BOOL wasClicked)
 * @abstract The typedef defines the block that is called if application was started with clicking on a GetSocial notification.
 * @param notification received push notification
 * @param wasClicked is YES, if notification was clicked by user in notification center, NO if received while application was in foreground.
 * @return YES, if action is handled by user, NO if action should be handled by GetSocial.
 */
typedef BOOL (^GetSocialNotificationHandler)(GetSocialNotification *notification, BOOL wasClicked);

/*!
 * @typedef void (^GetSocialPushTokenHandler)(NSString *deviceToken)
 * @abstract Called when GetSocial get the Push Notification device token. Not invoked if Push Notifications are not configured properly.
 *
 * @param deviceToken Push Notification device token.
 */
typedef void (^GetSocialPushTokenHandler)(NSString *deviceToken);

/*!
 * @typedef void (^GetSocialActionHandler)(GetSocialAction *error)
 * @abstract The typedef defines the signature of a block that is called when an action will be executed.
 * @param action action to be executed
 * @return YES, if action is handled by user, NO if action should be handled by GetSocial.
 */
typedef BOOL (^GetSocialActionHandler)(GetSocialAction *action);

/*!
 * @typedef void (^GetSocialGlobalErrorHandler)(NSError *error)
 * @abstract The typedef defines the signature of a block that is called when any exception happens in the framework.
 */
typedef void (^GetSocialGlobalErrorHandler)(NSError *error);

/*!
 * @typedef void (^GetSocialUserChangedHandler)()
 * @abstract The typedef defines the signature of a block that is called when an GetSocial user
 * was changed.
 */
typedef void (^GetSocialUserChangedHandler)(void);

/*!
 * @typedef void (^GetSocialSuccessCallback)()
 * @abstract The typedef defines the signature of a block that is called when an operation
 * completes.
 */
typedef void (^GetSocialSuccessCallback)(void);

/*!
 * @typedef void (^GetSocialFailureCallback)(NSError *error)
 * @abstract The typedef defines the signature of a block that is called when an operation fails.
 * @param error is the error that caused the failure.
 */
typedef void (^GetSocialFailureCallback)(NSError *error);

/*!
 * @typedef void (^GetSocialResultCallback)(BOOL result)
 * @abstract The typedef defines the signature of a block that is called an operation completes with some boolean result
 * @param result is the boolean result of operation.
 */
typedef void (^GetSocialResultCallback)(BOOL result);

/*!
 * @typedef void (^GetSocialIntegerCallback)(int result)
 * @abstract The typedef defines the signature of a block that is called an operation completes with some integer result
 * @param result is the boolean result of operation.
 */
typedef void (^GetSocialIntegerCallback)(int result);

/*!
 * @typedef void (^GetSocialInviteSuccessCallback)()
 * @abstract The typedef defines the signature of a block that is call when invite operation succeeds.
 */
typedef void (^GetSocialInviteSuccessCallback)(void);

/*!
 * @typedef void (^GetSocialInviteCancelCallback)()
 * @abstract The typedef defines the signature of a block that is call when invite operation is cancelled.
 */
typedef void (^GetSocialInviteCancelCallback)(void);

/*!
 * @typedef void (^GetSocialReferralDataCallback)()
 * @abstract The typedef defines the signature of a block that is call when getting referral data.
 */
typedef void (^GetSocialReferralDataCallback)(GetSocialReferralData *_Nullable referralData);

/*!
 * @typedef void (^GetSocialPublicUserSuccessCallback)(id publicUser)
 * @abstract The typedef defines the signature of a block that is called user is retrieved.
 * @param publicUser GetSocialPublicUser instance.
 */
typedef void (^GetSocialPublicUserSuccessCallback)(GetSocialPublicUser *publicUser);

/*!
 * @typedef void (^GetSocialPublicUsersMapSuccessCallback)(id publicUsersDictionary)
 * @abstract The typedef defines the signature of a block that is called when dictionary of user ids - public users is retrieved.
 * @param publicUsersDictionary Dictionary of provider user ids and GetSocialPublicUsers instances.
 */
typedef void (^GetSocialPublicUsersDictionarySuccessCallback)(NSDictionary<NSString *, GetSocialPublicUser *> *publicUsersDictionary);

/*!
 * @typedef void (^GetSocialAddIdentityConflictCallback)(id conflictUser)
 * @abstract The typedef defines the signature of a block that is called if identity cannot be added due conflict.
 * @param conflictUser GetSocialConflictUser instance.
 */
typedef void (^GetSocialAddIdentityConflictCallback)(GetSocialConflictUser *conflictUser);

/*!
 * @typedef void (^GetSocialActivityResultCallback)(GetSocialActivityPost *post)
 * @abstract The typedef defines the signature of a block that is called when an operation completes.
 */
typedef void (^GetSocialActivityResultCallback)(GetSocialActivityPost *result);

/*!
 * @typedef void (^GetSocialActivitiesResultCallback)(NSArray<GetSocialActivityPost *> *posts)
 * @abstract The typedef defines the signature of a block that is called when an operation completes.
 */
typedef void (^GetSocialActivitiesResultCallback)(NSArray<GetSocialActivityPost *> *posts);

/*!
 * @typedef void(^GetSocialUsersResultCallback)(NSArray<GetSocialPublicUser *> *users)
 * @abstract The typedef defines the signature of a block that is called when an operation completes.
 */
typedef void (^GetSocialUsersResultCallback)(NSArray<GetSocialPublicUser *> *users);

/*!
 * @typedef void(^GetSocialSuggestedFriendsResultCallback)(NSArray<GetSocialSuggestedFriend *> *friends)
 * @abstract The typedef defines the signature of a block that is called when an operation completes.
 */
typedef void (^GetSocialSuggestedFriendsResultCallback)(NSArray<GetSocialSuggestedFriend *> *friends);

/*!
 * @typedef void(^GetSocialUserReferencesResultCallback)(NSArray<GetSocialUserReference *> *users)
 * @abstract The typedef defines the signature of a block that is called when an operation completes.
 */
typedef void (^GetSocialUserReferencesResultCallback)(NSArray<GetSocialUserReference *> *users);

/*!
 * @typedef void(^GetSocialNotificationsResultCallback)(NSArray<GetSocialNotification *> *notifications)
 * @abstract The typedef defines the signature of a block that is called when an operation completes.
 */
typedef void (^GetSocialNotificationsResultCallback)(NSArray<GetSocialNotification *> *notifications);

/*!
 * @typedef void (^GetSocialSendNotificationCallback)(NSArray<GetSocialSendNotificationError *> *errors)
 * @abstract The typedef defines the signature of a block that is called when an operation completes.
 */
typedef void (^GetSocialSendNotificationCallback)(GetSocialNotificationsSummary *summary);

/*!
 * @typedef void(^GetSocialTagsResultCallback)(NSArray<GetSocialTag *> *users)
 * @abstract The typedef defines the signature of a block that is called when an operation completes.
 */
typedef void (^GetSocialTagsResultCallback)(NSArray<NSString *> *tags);

/*!
 * @typedef NSString GetSocialId
 * @abstract The typedef defines SDK identifiers type.
 */
typedef NSString *GetSocialId;

/*!
 * @typedef void(^GetSocialReferredUsersResultCallback)(NSArray<GetSocialReferredUser *> *referredUsers)
 * @abstract The typedef defines the signature of a block that is called when an operation completes.
 */
typedef void (^GetSocialReferredUsersResultCallback)(NSArray<GetSocialReferredUser *> *referredUsers);

/*!
 * @typedef void(^GetSocialReferralUsersResultCallback)(NSArray<GetSocialReferralUser *> *referralUsers)
 * @abstract The typedef defines the signature of a block that is called when an operation completes.
 */
typedef void (^GetSocialReferralUsersResultCallback)(NSArray<GetSocialReferralUser *> *referralUsers);

/*!
 * @typedef void (^GetSocialStringCallback)(NSString* result)
 * @abstract The typedef defines the signature of a block that is called an operation completes with some string result
 * @param result is the string result of operation.
 */
typedef void (^GetSocialStringResultCallback)(NSString *result);

/*!
 * @typefed void (^GetSocialPromoCodeCallback)(GetSocialPromoCode *promoCode);
 * @abstract The typedef defines the signature of a block that is called on operation completes for promo codes operations.
 */
typedef void (^GetSocialPromoCodeCallback)(GetSocialPromoCode *promoCode);

#pragma mark - User management

/*!
 * @abstract AuthIdentityProviderId for Facebook
 */
extern NSString *GetSocial_AuthIdentityProviderId_Facebook;

#pragma mark - Meta Data Keys

/*!
 * Plist key for UI configuration.
 */
extern NSString *GetSocial_MetaDataKey_UiConfigurationFile;

#pragma mark - Mention Types

/*!
 * Mentioned by another user.
 */
extern NSString *GetSocial_MentionType_User;

/*!
 * Mentioned by app.
 */
extern NSString *GetSocial_MentionType_App;

#pragma mark - Landing page customization keys

/*!
 * Custom title to be shown on landing page.
 */
extern NSString *GetSocial_Custom_Title;

/*!
 * Custom description to be shown on landing page.
 */
extern NSString *GetSocial_Custom_Description;

/*!
 * Custom image to be shown on landing page.
 */
extern NSString *GetSocial_Custom_Image;

/*!
 * Custom video to be shown on landing page.
 */
extern NSString *GetSocial_Custom_YouTubeVideo;

/*!
 * Landing page promo code.
 */
extern NSString *GetSocial_PromoCode;

#pragma mark - Push Notifications placeholders

/*!
 * Placeholder to send notification to all friends.
 */
extern NSString *GetSocial_NotificationPlaceholder_Receivers_Friends;

/*!
 * Placeholder to send notification to referred users.
 */
extern NSString *GetSocial_NotificationPlaceholder_Receivers_ReferredUsers;

/*!
 * Placeholder to send notification to referrer.
 */
extern NSString *GetSocial_NotificationPlaceholder_Receivers_Referrer;

/*!
 * Placeholder to show sender's display name in notification.
 */
extern NSString *GetSocial_NotificationPlaceholder_CustomText_SenderDisplayName;

/*!
 * Placeholder to shows receiver's display name in notification.
 */
extern NSString *GetSocial_NotificationPlaceholder_CustomText_ReceiverDisplayName;

#pragma mark - Error codes

/*!
 * @abstract Unknown error
 */
extern NSInteger GetSocial_ErrorCode_Unknown;

/*!
 * @abstract Defines code for illegal argument error.
 */
extern NSInteger GetSocial_ErrorCode_IllegalArgument;

/*!
 * @abstract Defines code for illegal state error.
 */
extern NSInteger GetSocial_ErrorCode_IllegalState;

/*!
 * @abstract Defines code for not found error.
 */
extern NSInteger GetSocial_ErrorCode_NotFound;

/*!
 * @abstract Defines code for banned user error.
 */
extern NSInteger GetSocial_ErrorCode_UserIsBanned;

/*!
 * @abstract Defines code for not initialized error.
 */
extern NSInteger GetSocial_ErrorCode_NotInitialized;

/*!
 * @abstract Defines code for no internet connection.
 */
extern NSInteger GetSocial_ErrorCode_NoInternet;

/*!
 * @abstract Defines code for rejected activity.
 */
extern NSInteger GetSocial_ErrorCode_ActivityRejected;

/*!
 * @abstract Defines code for rate limiting when sending posts.
 */
extern NSInteger GetSocial_ErrorCode_ActivityRateLimited;

/*!
 * @abstract Defines code for rate limiting when sending comments.
 */
extern NSInteger GetSocial_ErrorCode_CommentRateLimited;

#pragma mark - Error keys

/*!
 * @abstract The corresponding value is an array containing the underlying errors.
 */
extern NSString *GetSocial_ErrorKey_ErrorsList;

/*!
 * @abstract The corresponding value is a dictionary containing context of the error.
 */
extern NSString *GetSocial_ErrorKey_Context;

#pragma mark - Invite Channel Plugin ids

/*!
 * @abstract Generic Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Generic;

/*!
 * @abstract Email Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Email;

/*!
 * @abstract Facebook Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Facebook;

/*!
 * @abstract Hangouts Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Hangouts;

/*!
 * @abstract Instagram Direct Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_InstagramDirect;

/*!
 * @abstract Kakao Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Kakao;

/*!
 * @abstract Kik Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Kik;

/*!
 * @abstract Line Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Line;

/*!
 * @abstract Facebook Messenger Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Facebook_Messenger;

/*!
 * @abstract Native share Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_NativeShare;

/*!
 * @abstract Snapchat Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Snapchat;

/*!
 * @abstract Sms Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Sms;

/*!
 * @abstract Twitter Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Twitter;

/*!
 * @abstract Telegram Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Telegram;

/*!
 * @abstract Viber Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Viber;

/*!
 * @abstract VK Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_VK;

/*!
 * @abstract WhatsApp Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_WhatsApp;

/*!
 * @abstract Google Plus Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_GooglePlus __deprecated;

/*!
 * @abstract Facebook Stories Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Facebook_Stories;

/*!
 * @abstract Instagram Stories Invite Channel.
 */
extern NSString *GetSocial_InviteChannelPluginId_Instagram_Stories;

#pragma mark - Invite Content Placeholder constants

/*!
 * @abstract Invite content placeholder for application invite url.
 */
extern NSString *GetSocial_InviteContentPlaceholder_App_Invite_Url;

/*!
 * @abstract Invite content placeholder is replaced with current user name.
 */
extern NSString *GetSocial_InviteContentPlaceholder_User_Name;

/*!
 * @abstract Invite content placeholder is replaced with promo code from LinkParams if any present.
 */
extern NSString *GetSocial_InviteContentPlaceholder_Promo_Code;

// TODO: add in the next release
//*!
// * @abstract Invite content placeholder for user display name.
// */
// extern NSString *GetSocial_InviteContentPlaceholder_User_Display_Name;

#pragma mark - Activity Feed Constants

/*!
 * @abstract Constant for Global Activity Feed.
 */
extern NSString *GetSocial_ActivityFeed_GlobalFeed;

/*!
 * @abstract Default limit for Activity feed.
 */
extern NSInteger GetSocial_ActivityFeed_DefaultLimit;

#pragma mark - Language Codes

/*!
 * Constant for Bengali language.
 */
extern NSString *GetSocial_Languages_Bengali;

/*!
 * Constant for Bhojpuri language.
 */
extern NSString *GetSocial_Languages_Bhojpuri;

/*!
 * Constant for Default language.
 */
extern NSString *GetSocial_Languages_Default;

/*!
 * Constant for Simplified Chinese language.
 */
extern NSString *GetSocial_Languages_ChineseSimplified;

/*!
 * Constant for Traditional Chinese language.
 */
extern NSString *GetSocial_Languages_ChineseTraditional;

/*!
 * Constant for Danish language.
 */
extern NSString *GetSocial_Languages_Danish;

/*!
 * Constant for Dutch language.
 */
extern NSString *GetSocial_Languages_Dutch;

/*!
 * Constant for English language.
 */
extern NSString *GetSocial_Languages_English;

/*!
 * Constant for French language.
 */
extern NSString *GetSocial_Languages_French;

/*!
 * Constant for German language.
 */
extern NSString *GetSocial_Languages_German;

/*!
 * Constant for Gujarati language.
 */
extern NSString *GetSocial_Languages_Gujarati;

/*!
 * Constant for Hindi language.
 */
extern NSString *GetSocial_Languages_Hindi;

/*!
 * Constant for Icelandic language.
 */
extern NSString *GetSocial_Languages_Icelandic;

/*!
 * Constant for Indonesian language.
 */
extern NSString *GetSocial_Languages_Indonesian;

/*!
 * Constant for Italian language.
 */
extern NSString *GetSocial_Languages_Italian;

/*!
 * Constant for Japenese language.
 */
extern NSString *GetSocial_Languages_Japanese;

/*!
 * Constant for Kannada language.
 */
extern NSString *GetSocial_Languages_Kannada;

/*!
 * Constant for Korean language.
 */
extern NSString *GetSocial_Languages_Korean;

/*!
 * Constant for Latin American Spanish language.
 */
extern NSString *GetSocial_Languages_LatinAmericanSpanish;

/*!
 * Constant for Malay language.
 */
extern NSString *GetSocial_Languages_Malay;

/*!
 * Constant for Malayalam language.
 */
extern NSString *GetSocial_Languages_Malayalam;

/*!
 * Constant for Marathi language.
 */
extern NSString *GetSocial_Languages_Marathi;

/*!
 * Constant for Norwegian language.
 */
extern NSString *GetSocial_Languages_Norwegian;

/*!
 * Constant for Polish language.
 */
extern NSString *GetSocial_Languages_Polish;

/*!
 * Constant for Portuguese language.
 */
extern NSString *GetSocial_Languages_Portuguese;

/*!
 * Constant for Brazillian Portuguese language.
 */
extern NSString *GetSocial_Languages_PortugueseBrazillian;

/*!
 * Constant for Punjabi language.
 */
extern NSString *GetSocial_Languages_Punjabi;

/*!
 * Constant for Russian language.
 */
extern NSString *GetSocial_Languages_Russian;

/*!
 * Constant for Spanish language.
 */
extern NSString *GetSocial_Languages_Spanish;

/*!
 * Constant for Swedish language.
 */
extern NSString *GetSocial_Languages_Swedish;

/*!
 * Constant for Tagalog language.
 */
extern NSString *GetSocial_Languages_Tagalog;

/*!
 * Constant for Tamil language.
 */
extern NSString *GetSocial_Languages_Tamil;

/*!
 * Constant for Telugu language.
 */
extern NSString *GetSocial_Languages_Telugu;

/*!
 * Constant for Thai language.
 */
extern NSString *GetSocial_Languages_Thai;

/*!
 * Constant for Turkish language.
 */
extern NSString *GetSocial_Languages_Turkish;

/*!
 * Constant for Ukrainian language.
 */
extern NSString *GetSocial_Languages_Ukrainian;

/*!
 * Constant for Viatnamese language.
 */
extern NSString *GetSocial_Languages_Vietnamese;

#endif

/*!
 * @abstract Defines constant for GetSocial Framework
 */
@interface GetSocialConstants : NSObject

/*!
 * @abstract Get the dictionary of all available languages.
 */
+ (NSDictionary<NSString *, NSString *> *)allLanguageCodes;
NS_ASSUME_NONNULL_END

@end
