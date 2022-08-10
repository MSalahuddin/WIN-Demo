//
//  GetSocialActionBuilder.h
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>

@class GetSocialAction;

NS_ASSUME_NONNULL_BEGIN

/*!
 * @abstract Builder class to create GetSocialAction instances.
 */
@interface GetSocialActionBuilder : NSObject

/*!
 * @abstract Init method, should not be called
 */
- (instancetype)init NS_UNAVAILABLE;

/*!
 * @abstract Initializes the instance using the provided action type.
 * @param type action type.
 */
- (instancetype)initWithType:(GetSocialActionType)type NS_DESIGNATED_INITIALIZER;

/*!
 * @abstract Adds action data.
 * @param value action data value.
 * @param key action data key.
 */
- (void)addActionDataValue:(NSString *)value withKey:(NSString *)key;

/*!
 * @abstract Adds action data.
 * @param actionData action data.
 */
- (void)addActionData:(NSDictionary *)actionData;

/*!
 * @abstract Builds GetSocialAction instance.
 */
- (GetSocialAction *)build;

@end

NS_ASSUME_NONNULL_END
