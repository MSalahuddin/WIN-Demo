//
//  GetSocialReferredUser.h
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GetSocial/GetSocialConstants.h>
#import <GetSocial/GetSocialInstallPlatform.h>
#import <GetSocial/GetSocialPublicUser.h>

/*!
 * @abstract Defines ReferredUser class.
 */
@interface GetSocialReferredUser : GetSocialPublicUser
NS_ASSUME_NONNULL_BEGIN

/*!
 * @abstract UNIX-timestamp of date in seconds when user installed the application.
 */
@property (nonatomic, readonly) NSUInteger installationDate;

/*!
 * @abstract One of the constants prefixed with `GetSocial_InviteChannelPluginId_`.
 */
@property (nonatomic, readonly) NSString *installationChannel;

/*!
 * @abstract If that is not first install from this device.
 * `NO` if that is the first install on this device, `YES` otherwise.
 */
@property (nonatomic, readonly) BOOL isReinstall;

/*!
 * @abstract If the install was marked as suspicious.
 * `YES` if install was marked as suspicious by fraud detection system, `NO` otherwise.
 */
@property (nonatomic, readonly) BOOL isInstallSuspicious;

/*!
 * @abstract Which platform user used to install the app.
 */
@property (nonatomic, readonly) GetSocialInstallPlatform installationPlatform;

NS_ASSUME_NONNULL_END
@end
