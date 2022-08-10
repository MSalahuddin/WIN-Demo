//
//
// Copyright (c) 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "GetSocialConstants.h"

/*!
 * Lightweight representation of {@link GetSocialPublicUser}.
 * It can be used if you need basic user properties: ID, Display Name and Avatar URL.
 */
@interface GetSocialUserReference : NSObject

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

NS_ASSUME_NONNULL_END

@end


