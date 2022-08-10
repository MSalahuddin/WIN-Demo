//
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

/*!
 * @abstract Contains invite message content like attached image url, localized subject and text.
 */
@interface GetSocialInviteContent : NSObject
/** @name Properties */

/*!
 * @abstract Image url to use.
 */
@property(nonatomic, readonly) NSString *imageUrl;

/*!
 * @abstract Image to use.
 */
@property(nonatomic, readonly) UIImage *image;

/*!
 * @abstract Subject to use.
 */
@property(nonatomic, readonly) NSString *subject;

/*!
 * @abstract Text to use.
 */
@property(nonatomic, readonly) NSString *text;

/*!
 * @abstract Video url to use.
 */
@property(nonatomic, readonly) NSString *videoUrl;

/*!
 * @abstract Gif url to use.
 */
@property(nonatomic, readonly) NSString *gifUrl;

/*!
 * @abstract Invite link parameters.
 */
@property(nonatomic, readonly) NSDictionary<NSString *, NSString *> *linkParams;

@end
