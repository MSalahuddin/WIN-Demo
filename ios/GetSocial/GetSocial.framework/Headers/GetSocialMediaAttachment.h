//
//  GetSocialMediaAttachment.h
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/*!
 * Media attachment class.
 */
@interface GetSocialMediaAttachment : NSObject

/*!
 * @abstract Create an attachment with an image url.
 * @param imageUrl image url.
 * @return created attachment or nil, if image url is nil.
 */
+ (GetSocialMediaAttachment *)imageUrl:(NSString *)imageUrl;

/*!
 * @abstract Create an attachment with an image instance.
 * @param image image.
 * @return created attachment or nil, if image is nil.
 */
+ (GetSocialMediaAttachment *)image:(UIImage *)image;

/*!
 * @abstract Create an attachment with a video url.
 * @param videoUrl video url.
 * @return created attachment or nil, if video url is nil.
 */
+ (GetSocialMediaAttachment *)videoUrl:(NSString *)videoUrl;

/*!
 * @abstract Create an attachment with video content.
 * @param video video content.
 * @return created attachment or nil, if video is nil.
 */
+ (GetSocialMediaAttachment *)video:(NSData *)video;

@end

NS_ASSUME_NONNULL_END
