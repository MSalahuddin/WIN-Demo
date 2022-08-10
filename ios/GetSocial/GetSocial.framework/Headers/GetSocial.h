//
//  GetSocial
//
//  Copyright @ 2019 GetSocial BV. All rights reserved.
//

#import <GetSocial/GetSocialAction.h>
#import <GetSocial/GetSocialActionBuilder.h>
#import <GetSocial/GetSocialActionButton.h>
#import <GetSocial/GetSocialActivitiesQuery.h>
#import <GetSocial/GetSocialActivityPost.h>
#import <GetSocial/GetSocialActivityPostBuilder.h>
#import <GetSocial/GetSocialActivityPostContent.h>
#import <GetSocial/GetSocialAuthIdentity.h>
#import <GetSocial/GetSocialConflictUser.h>
#import <GetSocial/GetSocialConstants.h>
#import <GetSocial/GetSocialInstallPlatform.h>
#import <GetSocial/GetSocialInviteChannel.h>
#import <GetSocial/GetSocialInviteChannelPlugin.h>
#import <GetSocial/GetSocialInvitePackage.h>
#import <GetSocial/GetSocialInviteProperties.h>
#import <GetSocial/GetSocialMediaAttachment.h>
#import <GetSocial/GetSocialMention.h>
#import <GetSocial/GetSocialMentionBuilder.h>
#import <GetSocial/GetSocialMutableInviteContent.h>
#import <GetSocial/GetSocialNotification.h>
#import <GetSocial/GetSocialNotificationBadge.h>
#import <GetSocial/GetSocialNotificationBuilder.h>
#import <GetSocial/GetSocialNotificationContent.h>
#import <GetSocial/GetSocialNotificationCustomization.h>
#import <GetSocial/GetSocialNotificationsCountQuery.h>
#import <GetSocial/GetSocialNotificationsQuery.h>
#import <GetSocial/GetSocialNotificationsSummary.h>
#import <GetSocial/GetSocialPostAuthor.h>
#import <GetSocial/GetSocialPromoCode.h>
#import <GetSocial/GetSocialPromoCodeBuilder.h>
#import <GetSocial/GetSocialPublicUser.h>
#import <GetSocial/GetSocialPurchaseData.h>
#import <GetSocial/GetSocialReferralData.h>
#import <GetSocial/GetSocialReferralUser.h>
#import <GetSocial/GetSocialReferralUsersQuery.h>
#import <GetSocial/GetSocialReferredUser.h>
#import <GetSocial/GetSocialSuggestedFriend.h>
#import <GetSocial/GetSocialTagsQuery.h>
#import <GetSocial/GetSocialUserReference.h>
#import <GetSocial/GetSocialUserUpdate.h>
#import <GetSocial/GetSocialUsersQuery.h>
#import <GetSocial/GetSocialUser.h>
#ifdef __IPHONE_10_0
#import <UserNotifications/UserNotifications.h>
#endif

/*!
 * @abstract Main interface of GetSocial.framework
 */
@interface GetSocial : NSObject

NS_ASSUME_NONNULL_BEGIN

/*!
 * @abstract Returns version of GetSocial Framework.
 *
 * @result String value of the framework version.
 */
+ (NSString *)sdkVersion;

#pragma mark - Initialization
/** @name Initialization */


/*!
 * @abstract Init the SDK with provided identity.
 * - If identity doesn't exist in GetSocial system - the new user is created with that identity attached.
 * - If user already exists - they is logged into this device.
 * @param identity identity to logged into.
 * @param onSuccess called when init finished successfully.
 * @param onFailure called when init failed.
 */
+ (void)initWithIdentity:(GetSocialAuthIdentity *)identity success:(void(^)(void))onSuccess failure:(GetSocialFailureCallback)onFailure;

/*!
 * @abstract Reset current user without creating a new anonymous user. SDK is uninitialized after this call.
 * @param success called if successfully reset.
 * @param failure called if failed to reset.
 */
+ (void)resetWithSuccess:(GetSocialSuccessCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Init the SDK. Use executeWhenInitialized: to be notified when SDK is initialized.
 * GetSocial App Id will be taken from .plist metadata.
 * Check errors in logs or in GetSocialGlobalErrorHandler.
 */
+ (void)init;

/*!
 * @abstract Init the SDK. Use executeWhenInitialized: to be notified when SDK is initialized.
 * Check errors in logs or in GetSocialGlobalErrorHandler.
 * @param appId GetSocial App Id. You can find your App Id on the GetSocial Dashboard.
 */
+ (void)initWithAppId:(NSString *)appId;

/*!
 * @abstract Set an action, which should be executed after SDK initialized.
 * Executed immediately, if SDK is already initialized.
 * @param action Action to execute.
 */
+ (void)executeWhenInitialized:(void (^)(void))action;

/*!
 * @abstract Provides the status of GetSocial Framework initialization.
 *
 * @result YES if initialization completed successfully, otherwise NO.
 */
+ (BOOL)isInitialized;

/*!
 * @abstract Sets the global error handler block, that will we called after each internal crash in GetSocial Framework.
 *
 * @param errorHandler block to be called.
 * @result YES if the operation was successful, otherwise NO.
 */
+ (BOOL)setGlobalErrorHandler:(GetSocialGlobalErrorHandler)errorHandler;

/*!
 * @abstract Removes the global error handler.
 *
 * @result YES if operation was successful, otherwise NO.
 */
+ (BOOL)removeGlobalErrorHandler;

#pragma mark - Languages
/** @name Languages */

/*!
 * @abstract Sets the language of GetSocial Framework.
 * @discussion If provided value is incorrect, sets the default language.
 *
 * @param languageCode as defined in GetSocialConstants
 * @result YES if operation was successful, otherwise NO.
 */
+ (BOOL)setLanguage:(NSString *)languageCode;

/*!
 * @abstract Returns current language of GetSocial Framework.
 *
 * @result language code as defined in @see GetSocialConstants.h, or default language in case of failure.
 */
+ (NSString *)language;

#pragma mark - Invites
/** @name Invites */

/*!
 * @abstract Check if invite channel with specified id is available to sent invitations.
 *
 * @param channelId as defined in GetSocialConstants.
 * @result YES if channel is available for sending invites, NO otherwise.
 */
+ (BOOL)isInviteChannelAvailable:(NSString *)channelId;

/*!
 * @abstract Returns list of available invite channels.
 *
 * @result list of GetSocialInviteChannel classes.
 */
+ (NSArray<GetSocialInviteChannel *> *)inviteChannels;

/*!
 * @abstract Sends an invitation using the specified channel.
 *
 * @param channelId  Id of channel to use.
 * @param success    Called if invitation was sent successfully.
 * @param cancel     Called if invitation sending was canceled.
 * @param failure    Called if invitation could not be sent due to an error.
 */
+ (void)sendInviteWithChannelId:(NSString *)channelId
                        success:(GetSocialInviteSuccessCallback)success
                         cancel:(GetSocialInviteCancelCallback)cancel
                        failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Sends an invitation using the specified channel and invite content.
 *
 * @param channelId             Id of channel to use.
 * @param customInviteContent   Invite Content to send.
 * @param success               Called if invitation was sent successfully.
 * @param cancel                Called if invitation sending was canceled.
 * @param failure               Called if invitation could not be sent due to an error.
 */
+ (void)sendInviteWithChannelId:(NSString *)channelId
                  inviteContent:(GetSocialMutableInviteContent *_Nullable)customInviteContent
                        success:(GetSocialInviteSuccessCallback)success
                         cancel:(GetSocialInviteCancelCallback)cancel
                        failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Sends an invitation using the specified channel and invite content.
 *
 * @deprecated Use sendInviteWithChannelId:inviteContent:linkParams instead.
 *
 * @param channelId             Id of channel to use.
 * @param customInviteContent   Invite Content to send.
 * @param customReferralData    Custom referral data to send.
 * @param success               Called if invitation was sent successfully.
 * @param cancel                Called if invitation sending was canceled.
 * @param failure               Called if invitation could not be sent due to an error.
 */
+ (void)sendInviteWithChannelId:(NSString *)channelId
                  inviteContent:(GetSocialMutableInviteContent *_Nullable)customInviteContent
             customReferralData:(NSDictionary *_Nullable)customReferralData
                        success:(GetSocialInviteSuccessCallback)success
                         cancel:(GetSocialInviteCancelCallback)cancel
                        failure:(GetSocialFailureCallback)failure DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Sends an invitation using the specified channel and invite content.
 *
 * @param channelId             Id of channel to use.
 * @param customInviteContent   Invite Content to send.
 * @param linkParams            Custom link parameters to send.
 * @param success               Called if invitation was sent successfully.
 * @param cancel                Called if invitation sending was canceled.
 * @param failure               Called if invitation could not be sent due to an error.
 */
+ (void)sendInviteWithChannelId:(NSString *)channelId
                  inviteContent:(GetSocialMutableInviteContent *_Nullable)customInviteContent
                     linkParams:(NSDictionary *_Nullable)linkParams
                        success:(GetSocialInviteSuccessCallback)success
                         cancel:(GetSocialInviteCancelCallback)cancel
                        failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Registers an invite channel plugin for the specified channel id.
 *
 * @param inviteChannelPlugin  plugin to register.
 * @param channelId            channel id.
 * @result YES if the operation was successful, otherwise NO.
 */
+ (BOOL)registerInviteChannelPlugin:(__kindof GetSocialInviteChannelPlugin *)inviteChannelPlugin forChannelId:(NSString *)channelId;

/*!
 * @abstract Returns referral data received.
 *
 * @param success               Called if getting referral data finished. Referral data can be nil.
 * @param failure               Called if getting referral data failed.
 */
+ (void)referralDataWithSuccess:(GetSocialReferralDataCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Clears referral data.
 *
 */
+ (void)clearReferralData;

/*!
 * @abstract Returns list of users who installed the app by accepting invite of current user.
 *
 * @deprecated          Use referredUsersWithEvent:offset:limit:success:failure.
 *
 * @param success               Called if getting list of referred users finished. If there is no referred user, the list is empty.
 * @param failure               Called if getting list of referred users failed.
 */
+ (void)referredUsersWithSuccess:(GetSocialReferredUsersResultCallback)success failure:(GetSocialFailureCallback)failure DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Returns list of users who are referred by current user filtered by the query parameter.
 *
 * @param query                 GetSocialReferralUsersQuery instance.
 * @param success               Called if getting list of referred users finished. If there is no referred user, the list is empty.
 * @param failure               Called if getting list of referred users failed.
 */
+ (void)referredUsersWithQuery:(GetSocialReferralUsersQuery*)query success:(GetSocialReferralUsersResultCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Returns list of users who are referrers for current user filtered by the query parameter.
 *
 * @param query                 GetSocialReferralUsersQuery instance.
 * @param success               Called if getting list of referred users finished. If there is no referred user, the list is empty.
 * @param failure               Called if getting list of referred users failed.
 */
+ (void)referrerUsersWithQuery:(GetSocialReferralUsersQuery*)query success:(GetSocialReferralUsersResultCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Creates a Smart Link with user referral data attached used for Smart Invites.
 *
 * @param linkParams            Custom link parameters to send.
 * More info @see <a href="https://docs.getsocial.im/guides/smart-links/parameters/">here</a>
 * @param success               Called if creating invite url finished.
 * @param failure               Called if creating invite url failed.
 */
+ (void)createInviteLinkWithParams:(NSDictionary *_Nullable)linkParams
                           success:(GetSocialStringResultCallback)success
                           failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Sets referrer id for current user.
 *
 * @param referrerId            Id of referrer user.
 * @param event                 Referrer event.
 * @param customData            Custom key-value pairs.
 * @param success               Called if referrer setting finished.
 * @param failure               Called if referrer setting failed.
 */
+ (void)setReferrerWithId:(NSString*)referrerId
                    event:(NSString*)event
               customData:(NSDictionary<NSString*, NSString*>* _Nullable)customData
                  success:(GetSocialSuccessCallback)success
                  failure:(GetSocialFailureCallback)failure;

#pragma mark - Push notifications
/** @name Push notifications */

/*!
 * @abstract If im.getsocial.sdk.AutoRegisterForPush meta property is set to false in the Info.plist,
 * call this method to register for push notifications.
 * Register your application for a push notifications.
 */
+ (void)registerForPushNotifications;

/*!
 * @abstract Set a handler to be notified if application is started with clicking on GetSocial notification.
 * @param handler Called with action.
 */
+ (void)setNotificationHandler:(GetSocialNotificationHandler)handler;

/*!
 * @abstract Set a listener to be called when Push Notifications token obtained by GetSocial.
 * @param handler Called with Push Notification device token.
 */
+ (void)setPushNotificationTokenHandler:(GetSocialPushTokenHandler)handler;

#pragma mark - Actions

/*!
 * @abstract Process action with default GetSocial behaviour.
 * @param action action to be processed..
 */
+ (void)processAction:(GetSocialAction *)action;

#pragma mark - Activities
/** @name Activities */

/*!
 * @abstract Retrieve list of announcements for global feed.
 *
 * @param success  Called with resulting list of activities if call was successful.
 * @param failure  Called if operation can not be called due to an error.
 */
+ (void)announcementsForGlobalFeedWithSuccess:(GetSocialActivitiesResultCallback)success failure:(GetSocialFailureCallback)failure;

/**
 *  Retrieve list of announcements for feed.
 *
 *  @param feed     Feed name
 *  @param success  Called with resulting list of activities if call was successful
 *  @param failure  Called if operation can not be called due to an error
 */
+ (void)announcementsForFeed:(NSString *)feed success:(GetSocialActivitiesResultCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Retrieve list of activities.
 *
 * @param query    Filtering options.
 * @param success  Called with resulting list of activities if call was successful.
 * @param failure  Called if operation can not be called due to an error.
 */
+ (void)activitiesWithQuery:(GetSocialActivitiesQuery *)query
                    success:(GetSocialActivitiesResultCallback)success
                    failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Retrieve activity by id.
 *
 * @param activityId   Identifier of activity.
 * @param success      Called with resulting activity if call was successful.
 * @param failure      Called if operation can not be called due to an error.
 */
+ (void)activityWithId:(GetSocialId)activityId success:(GetSocialActivityResultCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Post activity to global activity feed.
 *
 * @param activity content of activity, that should be posted.
 * @param success  Called with resulting activity if activity was posted successfully.
 * @param failure  Called if operation can not be called due to an error.
 */
+ (void)postActivityToGlobalFeed:(GetSocialActivityPostContent *)activity
                         success:(GetSocialActivityResultCallback)success
                         failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Post activity to activity feed.
 *
 * @param activity content of activity, that should be posted.
 * @param feed     Name of feed.
 * @param success  Called with resulting activity if activity was posted successfully.
 * @param failure  Called if operation can not be called due to an error.
 */
+ (void)postActivity:(GetSocialActivityPostContent *)activity
              toFeed:(NSString *)feed
             success:(GetSocialActivityResultCallback)success
             failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Post comment to activity with specified id.
 *
 * @param activityId 	identifier of activity, that we want to comment.
 * @param comment       content of comment, that should be posted.
 * @param success       Called with resulting activity if activity was posted successfully.
 * @param failure       Called if operation can not be called due to an error.
 */
+ (void)postComment:(GetSocialActivityPostContent *)comment
    toActivityWithId:(GetSocialId)activityId
             success:(GetSocialActivityResultCallback)success
             failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Like or unlike activity.
 *
 * @param activityId 	identifier of activity, that we want to like or unlike.
 * @param isLiked       should activity be liked or not.
 * @param success       Called with resulting activity if activity was liked/unliked successfully.
 * @param failure       Called if operation can not be called due to an error.
 */
+ (void)likeActivityWithId:(GetSocialId)activityId
                   isLiked:(BOOL)isLiked
                   success:(GetSocialActivityResultCallback)success
                   failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Get a list of users, that liked activity.
 *
 * @param activityId    identifier of activity, that we want to get who liked it.
 * @param offset        Offset position.
 * @param limit         Maximum count of users.
 * @param success       Called with list of users, that liked activity.
 * @param failure       Called if operation can not be called due to an error.
 */
+ (void)activityLikers:(GetSocialId)activityId
                offset:(int)offset
                 limit:(int)limit
               success:(GetSocialUsersResultCallback)success
               failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Report activity because of its content.
 *
 * @param activityId        Id of activity to report.
 * @param reportingReason   Reason of reporting.
 * @param success           Called if operation succeed.
 * @param failure           Called if operation failed.
 */
+ (void)reportActivity:(GetSocialId)activityId
                reason:(GetSocialReportingReason)reportingReason
               success:(GetSocialSuccessCallback)success
               failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Delete your activity. Attempt to remove other user activities will result in failure.
 *
 * @deprecated Use removeActivities:success:failure instead.
 *
 * @param activityId        Id of activity to delete.
 * @param success           Called if operation succeed.
 * @param failure           Called if operation failed.
 */
+ (void)deleteActivity:(GetSocialId)activityId
               success:(GetSocialSuccessCallback)success
               failure:(GetSocialFailureCallback)failure DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Remove your activities. Attempt to remove other user activity will result in failure.
 *
 * @param activityIds       Id of activity to remove.
 * @param success           Called if operation succeed.
 * @param failure           Called if operation failed.
 */
+ (void)removeActivities:(NSArray<GetSocialId> *)activityIds success:(GetSocialSuccessCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Find all possible tags for query.
 *
 * @param query     Query.
 * @param success   Called with list of tags.
 * @param failure   Called if operation failed.
 */
+ (void)findTags:(GetSocialTagsQuery *)query success:(GetSocialTagsResultCallback)success failure:(GetSocialFailureCallback)failure;

#pragma mark - User management
/** @name User management */

/*!
 * @abstract Fetch user by user id.
 *
 * @param userId        id of user.
 * @param success       Called with public user or nil, if the user not found.
 * @param failure       Called if operation can not be called due to an error.
 */
+ (void)userWithId:(GetSocialId)userId success:(GetSocialPublicUserSuccessCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Fetch user by auth identity provider user id.
 *
 * @param providerUserId User id on the selected identity provider for which public user will be returned.
 * @param providerId    Auth identity provider id for which user id is provided.
 * @param success       Called with public user or nil, if the user not found.
 * @param failure       Called if operation can not be called due to an error.
 */
+ (void)userWithId:(NSString *)providerUserId
       forProvider:(NSString *)providerId
           success:(GetSocialPublicUserSuccessCallback)success
           failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Fetch list of users by auth identity provider user ids.
 *
 * @param providerUserIds User ids on the selected identity provider for which public users will be returned.
 * @param providerId    Auth identity provider id for which user id is provided.
 * @param success       Called with dictionary of user ids and public users for provided arguments. Please note, that not all requested user may be
 * returned.
 * @param failure       Called if operation can not be called due to an error.
 */
+ (void)usersWithIds:(NSArray *)providerUserIds
         forProvider:(NSString *)providerId
             success:(GetSocialPublicUsersDictionarySuccessCallback)success
             failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Find users matching query.
 *
 * @param query     Users query.
 * @param success   Success callback.
 * @param failure   Failure callback.
 */
+ (void)findUsers:(GetSocialUsersQuery *)query success:(GetSocialUserReferencesResultCallback)success failure:(GetSocialFailureCallback)failure;

#pragma mark - Promo Codes

/*!
 * @abstract Create a promo code.
 *
 * @param promoCodeBuilder  Promo code data.
 * @param success           Success callback.
 * @param failure           Failure callback.
 */
+ (void)createPromoCode:(GetSocialPromoCodeBuilder *)promoCodeBuilder
                success:(GetSocialPromoCodeCallback)success
                failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Get the promo code entity by its code.
 *
 * @param code              Promo code data.
 * @param success           Success callback.
 * @param failure           Failure callback. Called if operation failed or promo code doesn't exist.
 */
+ (void)getPromoCode:(NSString *)code success:(GetSocialPromoCodeCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Claim a promo code. Will return an error if promo code is not valid, expired or already claimed.
 *
 * @param code              Promo code data.
 * @param success           Success callback. Called if promo code was successfully claimed.
 * @param failure           Failure callback. Called if promo code is not valid, expired or already claimed.
 */
+ (void)claimPromoCode:(NSString *)code success:(GetSocialPromoCodeCallback)success failure:(GetSocialFailureCallback)failure;

#pragma mark - Analytics
/** @name Analytics */

/*!
 * @abstract Reports in-app purchase to Dashboard
 *
 * @param purchaseData  Data of purchase.
 * @result YES if operation was successful, otherwise NO.
 */
+ (BOOL)trackPurchaseEvent:(GetSocialPurchaseData *)purchaseData;

/*!
 * @abstract Reports custom event to Dashboard
 *
 * @param eventName         Name of custom event.
 * @param eventProperties   Properties of the event.
 * @result YES if operation was successful, otherwise NO.
 */
+ (BOOL)trackCustomEventWithName:(NSString *)eventName eventProperties:(NSDictionary<NSString *, NSString *> *)eventProperties;

#pragma mark - Device

/*!
 * @abstract If device was added to test devices list on the Dashboard.
 *
 * @result YES if device is a test device, NO otherwise or before session is initialized.
 */
+ (BOOL)isTestDevice;

/*!
 * @abstract Device IDFA.
 *
 * @result current device IDFA.
 */
+ (NSString *)deviceIdentifier;

NS_ASSUME_NONNULL_END

@end
