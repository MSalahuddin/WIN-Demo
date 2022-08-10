//
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIImage.h>
#import <GetSocial/GetSocialMediaAttachment.h>

@class GetSocialAction;

/*!
 * @abstract Describes a ActivityPost entity that should be posted to Activity Feeds.
 */
@interface GetSocialActivityPostContent : NSObject

NS_ASSUME_NONNULL_BEGIN

/*!
 * @abstract Post's text.
 */
@property (nonatomic, copy, nullable) NSString *text;

/*!
 * @abstract Title of button.
 */
@property (nonatomic, copy, nullable) NSString *buttonTitle;

/*!
 * @abstract Set the attachment.
 */
@property (nonatomic, strong, nullable) GetSocialMediaAttachment *mediaAttachment;

/*!
 * @abstract Action to perform on button click.
 */
@property(nonatomic, strong, nullable) GetSocialAction *action;

/*!
 * @abstract Action assigned to button.
 * @deprecated Use action field.
 */
@property (nonatomic, copy, nullable) NSString *buttonAction DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Post's image.
 * @deprecated Use mediaAttachment instead.
 */
@property (nonatomic, strong, nullable) UIImage *image DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Post's video.
 * @deprecated Use mediaAttachment instead.
 */
@property (nonatomic, strong, nullable) NSData *video DEPRECATED_ATTRIBUTE;




NS_ASSUME_NONNULL_END

@end
