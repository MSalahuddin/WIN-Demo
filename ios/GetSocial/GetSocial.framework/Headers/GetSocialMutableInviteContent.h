//
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import "GetSocialInviteContent.h"
#import <GetSocial/GetSocialMutableInviteContent.h>
#import <GetSocial/GetSocialMediaAttachment.h>

/*!
 * @abstract Contains mutable invite message content like attached image url, localized subject and text.
 */
@interface GetSocialMutableInviteContent : NSObject
/** @name Properties */

/*!
 * @abstract Image url to use. You can not use it with image.
 * @deprecated Use mediaAttachment.
 */
@property(nonatomic, readwrite) NSString *imageUrl DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Image to use. You can not use it with imageUrl.
 * @deprecated Use mediaAttachment.
 */
@property(nonatomic, readwrite) UIImage *image DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Video content to use.
 * @deprecated Use mediaAttachment.
 */
@property(nonatomic, readwrite) NSData *video DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Subject to use.
 */
@property(nonatomic, readwrite) NSString *subject;

/*!
 * @abstract Text to use.
 */
@property(nonatomic, readwrite) NSString *text;

/*!
 * @abstract Set media attachment.
 */
@property(nonatomic, strong) GetSocialMediaAttachment *mediaAttachment;

@end
