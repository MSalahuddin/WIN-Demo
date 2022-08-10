//
//
// Copyright (c) 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>

/*!
 * @abstract Class to create user queries.
 */
@interface GetSocialUsersQuery : NSObject

NS_ASSUME_NONNULL_BEGIN

/*!
 * Create a query to find users, that has query string in their Display Name.
 * @param query part of display name.
 * @return new instance.
 */
+ (instancetype)usersByDisplayName:(NSString *)query;

/*!
 * Set a limit.
 * @param limit max number of users to be loaded, should be between 1 and 20.
 */
- (void)setLimit:(int)limit;

NS_ASSUME_NONNULL_END

@end
