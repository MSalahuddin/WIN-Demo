//
//  GetSocialPromoCodeBuilder.h
//  GetSocial
//
//  Created by Orest Savchak on 5/7/19.
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface GetSocialPromoCodeBuilder : NSObject

/*!
 * @abstract Create a Promo Code with a random code.
 * 
 * @return new builder instance.
 */
+ (instancetype)withRandomCode;

/*!
 * @abstract Create a Promo Code with defined code.
 * 
 * @param code code to be used as promo code.
 * @return new builder instance.
 */
+ (instancetype)withCode:(NSString *)code;

/*!
 * @abstract Attach some custom data to the promo code.
 * 
 * @param value Data value.
 * @param key   Data key.
 */
- (void)addDataValue:(NSString *)value forKey:(NSString *)key;

/*!
 * @abstract Attach some custom data to the promo code.
 * 
 * @param data Custom data.
 */
- (void)addData:(NSDictionary<NSString *, NSString *> *)data;

/*!
 * @abstract Set the time range when this Promo Code is available.
 * If not set - will be available from the creation moment and until manually disabled on the Dashboard.
 * 
 * @param startDate Date when the Promo Code should become available.
 * @param endDate   Date when the Promo Code should not be available anymore.
 */
- (void)setTimeLimitWithStartDate:(NSDate *)startDate endDate:(NSDate *)endDate;

/*!
 * @abstract The maximum number of times this code can be claimed.
 * All the next attempts will receive an error.
 * If `0` then no limits.
 * 
 * @param maxClaimCount Maximum claim times.
 */
- (void)setMaxClaimCount:(uint)maxClaimCount;

@end

NS_ASSUME_NONNULL_END
