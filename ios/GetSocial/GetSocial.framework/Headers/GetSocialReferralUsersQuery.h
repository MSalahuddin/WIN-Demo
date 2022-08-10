//
//  GetSocialReferralUsersQuery.h
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GetSocialReferralUsersQuery : NSObject

NS_ASSUME_NONNULL_BEGIN

@property (nonatomic, strong, readonly) NSString* event;
@property (nonatomic) int offset;
@property (nonatomic) int limit;

+ (instancetype) allUsers;
+ (instancetype) usersForEvent:(NSString*)event;

/*!
 * @abstract Init method, should not be called.
 */
- (instancetype)init NS_UNAVAILABLE;

NS_ASSUME_NONNULL_END

@end
