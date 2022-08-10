//
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

/*!
 * @abstract A collection of the data needed when sending an invite.
 */
@interface GetSocialInvitePackage : NSObject
/** @name Properties */

/*!
 * @abstract Invite subject.
 */
@property(nullable, nonatomic, copy) NSString *subject;

/*!
 * @abstract Invite text.
 */
@property(nullable, nonatomic, copy) NSString *text;

/*!
 * @abstract Name of user who sends the invite.
 */
@property(nullable, nonatomic, copy) NSString *userName;

/*!
 * @abstract Invite image url.
 */
@property(nullable, nonatomic, copy) NSString *imageUrl;

/*!
 * @abstract Invite image.
 */
@property(nullable, nonatomic) UIImage *image;

/*!
 * @abstract Invite gif url.
 */
@property(nullable, nonatomic) NSString *gifUrl;

/*!
 * @abstract Invite video url.
 */
@property(nullable, nonatomic) NSString *videoUrl;

/*!
 * @abstract Referral data url.
 */
@property(nullable, nonatomic, copy) NSString *referralUrl;

/*!
 * @abstract Link parameters.
 */
@property(nullable, nonatomic) NSDictionary<NSString *, NSString *> *linkParams;

@end
