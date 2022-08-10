//
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GetSocial/GetSocialConstants.h>

/*!
 * @abstract Immutable properties for a public user.
 */
@interface GetSocialPublicUser : NSObject

NS_ASSUME_NONNULL_BEGIN

/*!
 * @abstract GetSocial User id.
 */
@property(nonatomic, readonly, assign) GetSocialId userId;

/*!
 * @abstract Display name.
 */
@property(nonatomic, readonly, copy) NSString *displayName;

/*!
 * @abstract Avatar url.
 */
@property(nonatomic, readonly, copy, nullable) NSString *avatarUrl;

/*!
 * @abstract Returns all identities added to the user.
 * The key is the provider Id and the value is the userId used internally by that provider for this user.
 * You can add or remove identities using [GetSocialUser addAuthIdentity:success:conflict:failure:] and [GetSocialUser
 * removeAuthIdentityWithProviderId:success:conflict:failure:]. The key(providerId) is the one you've passed as a first parameter to
 * [GetSocialAuthIdentity customIdentityForProvider:userId:accessToken:] or "facebook" constant if you've created Facebook identity with
 * [GetSocialAuthIdentity facebookIdentityWithAccessToken:].
 *
 * The value(userId) is the second parameter in [GetSocialAuthIdentity customIdentityForProvider:userId:accessToken]
 * or automatically obtained by GetSocial if you've used Facebook identity.
 *
 * Read more about identities in the documentation: https://docs.getsocial.im/guides/user-management/ios/managing-user-identities/
 *
 * @result All auth identities added to the user.
 */
@property(nonatomic, readonly) NSDictionary<NSString *, NSString *> *authIdentities;

/*!
 * @abstract All public properties of user.
 * The dictionary is an unmodifiable copy of origin user properties.
 */
@property(nonatomic, readonly) NSDictionary<NSString *, NSString *> *allPublicProperties;

/*!
 * @abstract Returns public property value for the specified key.
 *
 * @param propertyKey key of property.
 * @result property value or nil if property does not exist.
 */
- (nullable NSString *)publicPropertyForKey:(NSString *)propertyKey;

/*!
 * @abstract Checks if public property exists for the specified property key.
 *
 * @param  propertyKey key of property.
 * @return YES if property exists, NO if it does not exist.
 */
- (BOOL)hasPublicPropertyForKey:(NSString *)propertyKey;

/*!
 * @abstract Method to check is this an account of normal user or application.
 *
 * @return YES if account belongs to application, NO otherwise.
 */
- (BOOL)isApp;

NS_ASSUME_NONNULL_END

@end
