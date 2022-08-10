//
//  GetSocial
//
//  Copyright (c) 2019 GetSocial BV. All rights reserved.
//

#import <GetSocial/GetSocialConstants.h>
#import <GetSocial/GetSocialNotification.h>

@class GetSocialUserUpdate;
@class GetSocialAuthIdentity;
@class UIImage;
@class GetSocialNotificationsQuery;
@class GetSocialNotificationsCountQuery;
@class GetSocialNotificationContent;

/*!
 * @abstract Defines interface for managing user.
 */
@interface GetSocialUser : NSObject

NS_ASSUME_NONNULL_BEGIN

#pragma mark - User Details

/** @name Update Properties */

/*!
 * @abstract Set the public property with specified key and value for the authenticated user.
 * If you pass empty string as value, it will remove the property. Nil values are not allowed.
 * @param propertyValue The property value (Maximum length 1024 characters).
 * @param propertyKey The property key (Maximum length 64 characters).
 * @param success Success block.
 * @param failure Failure block.
 */
+ (void)setPublicPropertyValue:(NSString *)propertyValue
                        forKey:(NSString *)propertyKey
                       success:(GetSocialSuccessCallback)success
                       failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Set the private property with specified key and value for the authenticated user.
 * If you pass empty string as value, it will remove the property. Nil values are not allowed.
 * @param propertyValue The property value (Maximum length 1024 characters).
 * @param propertyKey The property key (Maximum length 64 characters).
 * @param success Success block.
 * @param failure Failure block.
 */
+ (void)setPrivatePropertyValue:(NSString *)propertyValue
                         forKey:(NSString *)propertyKey
                        success:(GetSocialSuccessCallback)success
                        failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Remove one of the public properties of the authenticated user.
 * @param propertyKey The property key (Maximum length 64 characters).
 * @param success Success block.
 * @param failure Failure block.
 */
+ (void)removePublicPropertyForKey:(NSString *)propertyKey success:(GetSocialSuccessCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Remove one of the private properties of the authenticated user.
 * @param propertyKey The property key (Maximum length 64 characters).
 * @param success Success block.
 * @param failure Failure block.
 */
+ (void)removePrivatePropertyForKey:(NSString *)propertyKey success:(GetSocialSuccessCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Checks if public property exists for the specified key.
 * @param propertyKey Property Key.
 * @return YES if exists, NO if not.
 */
+ (BOOL)hasPublicPropertyForKey:(NSString *)propertyKey;

/*!
 * @abstract Checks if private property exists for the specified key.
 * @param propertyKey Property Key.
 * @return YES if exists, NO if not.
 */
+ (BOOL)hasPrivatePropertyForKey:(NSString *)propertyKey;

/*!
 * @abstract Returns public property for a key.
 * @param propertyKey The property key (Maximum length 64 characters).
 * @return The property value or nil if not set or sdk not initialised.
 * If this returns null you must check if the sdk is initialised to
 * validate the result.
 */
+ (nullable NSString *)publicPropertyValueForKey:(NSString *)propertyKey;

/*!
 * @abstract Returns private property for a key.
 * @param propertyKey The property key (Maximum length 64 characters).
 * @return The property value or nil if not set or sdk not initialised.
 * If this returns null you must check if the sdk is initialised to
 * validate the result.
 */
+ (nullable NSString *)privatePropertyValueForKey:(NSString *)propertyKey;

/*!
 * Get all public properties of current user.
 * The dictionary is a copy of origin user properties.
 * To update properties use setPublicPropertyValue:forKey:success:failure: and
 * removePublicPropertyForKey:success:failure:.
 *
 * @return NSDictionary contains all public properties.
 */
+ (NSDictionary *)allPublicProperties;

/*!
 * Get all private properties of current user.
 * The dictionary is a copy of origin user properties.
 * To update properties use setPrivatePropertyValue:forKey:success:failure: and
 * removePrivatePropertyForKey:success:failure:.
 *
 * @return NSDictionary contains all private properties.
 */
+ (NSDictionary *)allPrivateProperties;

/** @name Update Change Handlers */

/*!
 * @abstract Set block to be called when user has been changed.
 * The action is executed on the main thread, so be careful with operations,
 * that you put inside block.
 * Handler will be called when:
 * - SDK initialization is finished;
 * - switchUserWithProviderId: method was called and user was successfully changed.
 *
 * @param handler Block to be called if user has been changed
 *
 * @result YES if the operation was successful, otherwise NO.
 */
+ (BOOL)setOnUserChangedHandler:(GetSocialUserChangedHandler)handler;

/*!
 * @abstract Remove current handler.
 *
 * @result YES if the operation was successful, otherwise NO.
 */
+ (BOOL)removeOnUserChangedHandler;

/** @name Update Details */

/*!
 * @abstract Update user details.
 *
 * @param updateDetails New user update
 * @param success Block called if user is updated.
 * @param failure Block called if operation fails.
 */
+ (void)updateDetails:(GetSocialUserUpdate *)updateDetails success:(GetSocialSuccessCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Update user display name.
 *
 * @param newDisplayName Display name to set
 * @param success Block called if display name was updated
 * @param failure Block called if operation fails.
 */
+ (void)setDisplayName:(NSString *)newDisplayName success:(GetSocialSuccessCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Returns the display name of current user.
 *
 * @result Display Name of current user.
 */
+ (nullable NSString *)displayName;

/*!
 * @abstract Update user avatar URL.
 *
 * @param newAvatarUrl Avatar URL to set
 * @param success Block called if avatar URL was updated
 * @param failure Block called if operation fails.
 */
+ (void)setAvatarUrl:(NSString *)newAvatarUrl success:(GetSocialSuccessCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Update user avatar image.
 *
 * @param newAvatarImage Avatar image to set
 * @param success Block called if avatar image was updated
 * @param failure Block called if operation fails.
 */
+ (void)setAvatar:(UIImage *)newAvatarImage success:(GetSocialSuccessCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Returns the avatar URL of current user.
 *
 * @result Avatar URL of current user.
 */
+ (nullable NSString *)avatarUrl;

/*!
 * @abstract Returns the id of current user.
 *
 * @result Id of current user.
 */
+ (GetSocialId)userId;

#pragma mark - Identities
/** @name Identities */

/*!
 * @abstract Indicates if the user has at least one auth identity available.
 *
 * @result YES, if user is anonymous or framework is not initalized, NO, if user has at least one auth identities added.
 */
+ (BOOL)isAnonymous;

/*!
 * @abstract Adds AuthIdentity for the specified provider.
 *
 * @param identity Identity to be added.
 * @param success Block called if identity is added.
 * @param conflict Block called if identity cannot be added due to a conflict with other user.
 * @param failure Block called if operation fails.
 */
+ (void)addAuthIdentity:(GetSocialAuthIdentity *)identity
                success:(GetSocialSuccessCallback)success
               conflict:(GetSocialAddIdentityConflictCallback)conflict
                failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Removes auth identity from current user for the specific provider.
 *
 * @param providerId The provider connected to an auth identity on the current user to remove.
 * @discussion Valid providerIds are "facebook","googleplus","googleplay" and custom providers.
 * @param success Block called if identity is removed.
 * @param failure Block called if operation fails.
 */
+ (void)removeAuthIdentityWithProviderId:(NSString *)providerId success:(GetSocialSuccessCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Switches the current user with the PublicUser corresponding to the details provided.
 *
 * @param identity Identity that current user should be switched to.
 * @param success Block called if user is switched.
 * @param failure Block called if operation fails.
 */
+ (void)switchUserToIdentity:(GetSocialAuthIdentity *)identity success:(GetSocialSuccessCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Returns all identities added to the user.
 * The key is the provider Id and the value is the userId used internally by that provider for this user.
 * You can add or remove identities using addAuthIdentity:success:conflict:failure: and removeAuthIdentityWithProviderId:success:conflict:failure:.
 * The key(providerId) is the one you've passed as a first parameter to [GetSocialAuthIdentity customIdentityForProvider:userId:accessToken:]
 * or "facebook" constant if you've created Facebook identity with [GetSocialAuthIdentity facebookIdentityWithAccessToken:].
 *
 * The value(userId) is the second parameter in [GetSocialAuthIdentity customIdentityForProvider:userId:accessToken]
 * or automatically obtained by GetSocial if you've used Facebook identity.
 *
 * Read more about identities in the documentation: https://docs.getsocial.im/guides/user-management/ios/managing-user-identities/
 *
 * @result All auth identities added to the user.
 */
+ (NSDictionary<NSString *, NSString *> *)authIdentities;

/*!
 * @abstract Reset current user and create new anonymous one.
 * @param success called if successfully reset.
 * @param failure called if failed to reset.
 */
+ (void)resetWithSuccess:(GetSocialSuccessCallback)success failure:(GetSocialFailureCallback)failure;

#pragma mark - Friends
/** @name Friends */

/*!
 * @abstract Add a friend for current user, if operation succeed - they both became friends.
 * If you're trying to add a user, that already is your friend, success callback will be called,
 * but user will be added to your friends list only once and your friends count won't be increased.
 *
 * @param userId 	Unique user identifier you want to become friend with.
 * @param success   Block called if friend was added successfully.
 * @param failure   Block called if operation fails.
 */
+ (void)addFriend:(GetSocialId)userId success:(GetSocialIntegerCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Add a list of users to the list of current user friends.
 * This method can be used to import external social graph data to GetSocial.Add a list friends for current user.
 *
 * @param providerUserIds 	A list of user ids on the selected identity provider that need to be added to the current user's friends list.
 * @param providerId 	    A auth identity provider id for which user ids will be provided. Can be "facebook", or any custom value.
 * @param success   Block called if friend was added successfully.
 * @param failure   Block called if operation fails.
 */
+ (void)addFriendsWithIds:(NSArray<NSString *> *)providerUserIds
              forProvider:(NSString *)providerId
                  success:(GetSocialIntegerCallback)success
                  failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Remove a user from friends list.
 * If you're trying to remove a user, that is not your friend, success callback will be called,
 * and your friends count won't be decreased.
 *
 * @param userId 	Unique user identifier you don't want to be friends anymore.
 * @param success   Block called if friend was removed successfully.
 * @param failure   Block called if operation fails.
 */
+ (void)removeFriend:(GetSocialId)userId success:(GetSocialIntegerCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Remove a list of users to the list from current user friends.
 *
 * @param providerUserIds 	A list of user ids on the selected identity provider that need to be added to the current user's friends list.
 * @param providerId 	    A auth identity provider id for which user ids will be provided. Can be "facebook", or any custom value.
 * @param success   Block called if friend was added successfully.
 * @param failure   Block called if operation fails.
 */
+ (void)removeFriendsWithIds:(NSArray<NSString *> *)providerUserIds
                 forProvider:(NSString *)providerId
                     success:(GetSocialIntegerCallback)success
                     failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Sets the users friends. Existing friends will be removed.
 *
 * @param userIds   List of unique user identifiers.
 * @param success   Block called if friend was added successfully.
 * @param failure   Block called if operation fails.
 */
+ (void)setFriendsWithIds:(NSArray<NSString *> *)userIds success:(GetSocialSuccessCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * Sets the users friends. Existing friends will be removed.
 *
 * @param providerId      A auth identity provider id for which user ids will be provided. Can be "facebook", or any custom value.
 * @param providerUserIds A list of user ids on the selected identity provider that will be set as the current user's friends list.
 * @param success   Block called if friend was added successfully.
 * @param failure   Block called if operation fails.
 */
+ (void)setFriendsWithIds:(NSArray<NSString *> *)providerUserIds
              forProvider:(NSString *)providerId
                  success:(GetSocialSuccessCallback)success
                  failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Check if user is your friend.
 *
 * @param userId 	Unique user identifier.
 * @param success   Block called with result if user is your friend or not.
 * @param failure   Block called if operation fails.
 */
+ (void)isFriend:(GetSocialId)userId success:(GetSocialResultCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Remove a user from friends list.
 *
 * @param success   Block called with count of friends.
 * @param failure   Block called if operation fails.
 */
+ (void)friendsCountWithSuccess:(GetSocialIntegerCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Get a list of friends for current user.
 *
 * @param offset    Limit of users.
 * @param limit     Offset position.
 * @param success   Block called with list of users that are friends of current user.
 * @param failure   Block called if operation fails.
 */
+ (void)friendsWithOffset:(int)offset limit:(int)limit success:(GetSocialUsersResultCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Get a list of suggested friends for current user.
 * Read more in <a href="http://docs.getsocial.im/guides/social-graph/ios/querying-social-graph/#suggested-friends">documentation</a>.
 *
 * @param offset    Limit of users.
 * @param limit     Offset position.
 * @param success   Block called with list of users that are suggested friends for current user.
 * @param failure   Block called if operation fails.
 */
+ (void)suggestedFriendsWithOffset:(int)offset
                             limit:(int)limit
                           success:(GetSocialSuggestedFriendsResultCallback)success
                           failure:(GetSocialFailureCallback)failure;

/*!
 * @abstract Get a list of friends references for current user. GetSocialUserReference is lightweight version of GetSocialPublicUser class.
 * @param success   Block called with list of users that are friends for current user.
 * @param failure   Block called if operation fails.
 */
+ (void)friendsReferencesWithSuccess:(GetSocialUserReferencesResultCallback)success failure:(GetSocialFailureCallback)failure;

#pragma mark - Notifications
/** @name Notifications */

/*!
 * Get the list of notifications for current user.
 * @param query 	Notifications query.
 * @param success   Block called with list of notifications for current user.
 * @param failure   Block called if operation fails.
 */
+ (void)notificationsWithQuery:(GetSocialNotificationsQuery *)query
                       success:(GetSocialNotificationsResultCallback)success
                       failure:(GetSocialFailureCallback)failure;

/*!
 * Get a number of notifications for current user.
 * @param query 	Notifications count query.
 * @param success   Block called with number of notifications for current user.
 * @param failure   Block called if operation fails.
 */
+ (void)notificationsCountWithQuery:(GetSocialNotificationsCountQuery *)query
                            success:(GetSocialIntegerCallback)success
                            failure:(GetSocialFailureCallback)failure;

/*!
 * Set notifications read or unread.
 * @param notificationsIds 	List of notifications IDs to change the read status.
 * @param isRead 			Read or unread.
 * @param success           Block called if operation succeeded.
 * @param failure           Block called if operation fails.
 * @deprecated Use setNotificationsStatus instead.
 */
+ (void)setNotificationsRead:(NSArray<GetSocialId> *)notificationsIds
                        read:(BOOL)isRead
                     success:(GetSocialSuccessCallback)success
                     failure:(GetSocialFailureCallback)failure DEPRECATED_ATTRIBUTE;

/*!
 * Set notifications status.
 * @param notificationsIds 	List of notifications IDs to change the read status.
 * @param status 			New status.
 * @param success           Block called if operation succeeded.
 * @param failure           Block called if operation fails.
 */
+ (void)setNotificationsStatus:(NSArray<GetSocialId> *)notificationsIds
                        status:(GetSocialNotificationStatus)status
                       success:(GetSocialSuccessCallback)success
                       failure:(GetSocialFailureCallback)failure;

/*!
 * If set to `NO` - current user won't receive GetSocial notifications anymore, until called with `YES`.
 *
 * @param isEnabled Should enable or disable PNs.
 * @param success   Block called if operation succeeded.
 * @param failure   Block called if operation fails.
 */
+ (void)setPushNotificationsEnabled:(BOOL)isEnabled success:(GetSocialSuccessCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * Check if PNs are enabled for current user.
 *
 * @param success Called with `YES` if is enabled, with `NO` otherwise.
 * @param failure Block called if operation fails.
 */
+ (void)isPushNotificationsEnabledWithSuccess:(GetSocialResultCallback)success failure:(GetSocialFailureCallback)failure;

/*!
 * Send notification to any GetSocial user.
 * @param userIds List of users to send Push Notification.
 * @param content Push Notification content to send.
 * @param success Called with numbers of successfully delivered Push Notifications.
 * @param failure Called if operation fails.
 */
+ (void)sendNotification:(NSArray<GetSocialId> *)userIds
             withContent:(GetSocialNotificationContent *)content
                 success:(GetSocialSendNotificationCallback)success
                 failure:(GetSocialFailureCallback)failure;

NS_ASSUME_NONNULL_END

@end
