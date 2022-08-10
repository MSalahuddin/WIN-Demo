//
//  GetSocialReferralUser.h
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//


#import <Foundation/Foundation.h>
#import <GetSocial/GetSocialPublicUser.h>

NS_ASSUME_NONNULL_BEGIN
@interface GetSocialReferralUser : GetSocialPublicUser

@property (nonatomic, readonly, strong) NSString *event;

/*!
 * @abstract UNIX-timestamp of date in seconds when user installed the application.
 */
@property (nonatomic, readonly) NSUInteger eventDate;

@property (nonatomic, readonly, strong) NSDictionary<NSString *, NSString *> *eventData;

@end
NS_ASSUME_NONNULL_END
