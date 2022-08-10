//
//  GetSocialPurchaseData.h
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/*!
 * @abstract Class describes in-app purchase data.
 */
@interface GetSocialPurchaseData : NSObject

/*!
 * @typedef NS_ENUM(NSUInteger, GetSocialProductType)
 * @abstract Defines purchase types.
 */
typedef NS_ENUM(NSUInteger, GetSocialProductType) {
    /*!
     * @abstract Consumable or non-consumable item.
     */
    Item = 0,
    /*!
     * @abstract Subscription.
     */
    Subscription
};

/*!
 * @abstract Product id.
 */
@property (nonatomic, copy) NSString* productId;

/*!
 * @abstract Type of product.
 */
@property (nonatomic) GetSocialProductType productType;

/*!
 * @abstract Product title.
 */
@property (nonatomic, copy) NSString* productTitle;

/*!
 * @abstract Product price, like 1.99.
 */
@property (nonatomic) float price;

/*!
 * @abstract Price currency, like USD.
 */
@property (nonatomic, copy) NSString* priceCurrency;

/*!
 * @abstract Date of purchase.
 */
@property (nonatomic) NSDate* purchaseDate;

/*!
 * @abstract Unique transaction identifier.
 */
@property (nonatomic) NSString* transactionIdentifier;

@end

NS_ASSUME_NONNULL_END
