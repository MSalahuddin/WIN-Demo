//
//  GetSocialPromoCode.h
//  GetSocial
//
//  Created by Orest Savchak on 5/7/19.
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>

@class GetSocialUserReference;

NS_ASSUME_NONNULL_BEGIN

@interface GetSocialPromoCode : NSObject

/*!
 * @abstract Promo code.
 */
@property (nonatomic, strong, readonly) NSString *code;

/*!
 * @abstract Attached custom data.
 */
@property (nonatomic, strong, readonly) NSDictionary *data;

/*!
 * @abstract Maximum number of claims. If `0` then no limits.
 */
@property (nonatomic, readonly) uint maxClaimCount;

/*!
 * @abstract Date when Promo Code becomes active.
 */
@property (nonatomic, strong, readonly) NSDate *startDate;

/*!
 * @abstract Date when Promo Code is not active anymore. Null if Promo Code is available forever until manually disabled on the Dashboard.
 */
@property (nonatomic, strong, nullable, readonly) NSDate *endDate;

/*!
 * @abstract Creator basic info.
 */
@property (nonatomic, strong, readonly) GetSocialUserReference *creator;

/*!
 * @abstract Current number of claims.
 */
@property (nonatomic, readonly) uint claimCount;

/*!
 * @abstract Is enabled on the Dashboard.
 */
@property (nonatomic, readonly, getter=isEnabled) BOOL enabled;

/*!
 * @abstract Is claimable. True only if Promo Code is enabled and active in the current time.
 */
@property (nonatomic, readonly, getter=isClaimable) BOOL claimable;

@end

NS_ASSUME_NONNULL_END
