//
//
// Copyright (c) 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GetSocial/GetSocialPublicUser.h>

/*!
 * @abstract Suggested friend object.
 */
@interface GetSocialSuggestedFriend : GetSocialPublicUser

/*!
 * @abstract Number of mutual friends for you and this user.
 */
@property (nonatomic, readonly) int mutualFriendsCount;

@end

