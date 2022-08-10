//
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
/*!
 * @abstract Defines ReferralData class.
 */
@interface GetSocialReferralData : NSObject

NS_ASSUME_NONNULL_BEGIN
/** @name Properties */

/*!
 * @abstract Unique Smart Invite link token. There is unique association between
 * token and attached referral data.
 */
@property(nonatomic, strong, readonly) NSString *token;

/*!
 * @abstract The GetSocial user id of the user that created the referral data.
 */
@property(nonatomic, strong, readonly) NSString *referrerUserId;

/*!
 * @abstract The id of the channel that was used for the invite.
 */
@property(nonatomic, strong, readonly) NSString *referrerChannelId;

/*!
 * @abstract Returns true if the app is installed for the first time on this device.
 *
 * @returns true if the app is installed on this device for the first time, otherwise false.
 */
@property(nonatomic, readonly) bool isFirstMatch;

/*!
 * @abstract If GetSocial is able to retrieve extra meta information (e.g. from Facebook or depplink) we provide 100% guarantee
 * that received data corresponds to the user. In other cases we use fingerprinting to find a best match.
 *
 * @returns true if GetSocial can give 100% guarantee that received referral data corresponds to the user, false in case of the best match.
 */
@property(nonatomic, readonly) bool isGuaranteedMatch;

/*!
 * @abstract Returns true if the app is reinstalled on this device.
 *
 * @returns true if the app is reinstalled on this device, otherwise false.
 */
@property(nonatomic, readonly) bool isReinstall;

/*!
 * @abstract Returns true if the app is opened for this link the first time on this device.
 *
 * @returns true if the app is opened for this link the first time on this device, otherwise false.
 */
@property(nonatomic, readonly) bool isFirstMatchLink;

/*!
 * @abstract Custom data that is assigned to this referral data. Includes value overrides from the Smart Link.
 * @deprecated Use linkParams property instead.
 */
@property(nonatomic, strong, readonly) NSDictionary *customData DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Link parameters that are assigned to this referral data. Includes value overrides from the Smart Link.
 * @deprecated Use referralLinkParams property instead.
 */
@property(nonatomic, strong, readonly) NSDictionary *linkParams DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Original Custom data that is assigned to this referral data. Contains original custom data
 * attached to the Smart Link without overrides.
 * @deprecated Use originalLinkParams property instead.
 */
@property(nonatomic, strong, readonly) NSDictionary *originalCustomData DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Original Link parameters that are assigned to this referral data. Contains original link parameters
 * attached to the Smart Link without overrides.
 * @deprecated Use originalReferralLinkParams property instead.
 */
@property(nonatomic, strong, readonly) NSDictionary *originalLinkParams DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Referral Link parameters that are assigned to this referral data. Includes value overrides from the Smart Link.
 */
@property(nonatomic, strong, readonly) NSDictionary *referralLinkParams;

/*!
 * @abstract Original Referral Link parameters that are assigned to this referral data. Contains original link parameters
 * attached to the Smart Link without overrides.
 */
@property(nonatomic, strong, readonly) NSDictionary *originalReferralLinkParams;

NS_ASSUME_NONNULL_END
@end
