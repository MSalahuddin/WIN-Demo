//
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GetSocial/GetSocial.h>

/*!
 * @abstract Builder object to create activity post object.
 */
@interface GetSocialActivityPostBuilder : NSObject

NS_ASSUME_NONNULL_BEGIN

/*!
 * @abstract Id of activity post.
 */
@property(nonatomic) GetSocialId activityId;

/*!
 * @abstract Text content of activity post.
 */
@property(nonatomic, copy, nullable) NSString *text;

/*!
 * @abstract Title of button in activity post.
 */
@property(nonatomic, copy, nullable) NSString *buttonTitle;

/*!
 * @abstract Action of button in activity post.
 * @deprecated Use action instead.
 */
@property(nonatomic, copy, nullable) NSString *buttonAction DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Image's url in activity post.
 */
@property(nonatomic, copy, nullable) NSString *imageUrl;

/*!
 * @abstract Video's url in activity post.
 */
@property(nonatomic, copy, nullable) NSString *videoUrl;

/*!
 * @abstract Feed ID.
 */
@property(nonatomic, copy, nullable) NSString *feedId;

/**
 * @abstract UNIX-timestamp of date in seconds when the post was created.
 */
@property(nonatomic) NSUInteger createdAt;

/**
 * @abstract UNIX-timestamp of date in seconds when sticky period starts.
 */
@property(nonatomic) NSUInteger stickyStart;
/**
 * @abstract UNIX-timestamp of date in seconds when sticky period ends.
 */
@property(nonatomic) NSUInteger stickyEnd;

/*!
 * @abstract Author of the post
 */
@property(nonatomic, strong) GetSocialPostAuthor *author;

/*!
 * @abstract if the current user liked the post or not.
 */
@property(nonatomic) BOOL isLikedByMe;

/*!
 * @abstract number of likes.
 */
@property(nonatomic) int likesCount;

/*!
 * @abstract number of comments.
 */
@property(nonatomic) int commentsCount;

/*!
 * @abstract mentions that are present in contentText.
 */
@property(nonatomic, strong) NSArray<GetSocialMention *> *mentions;

/*!
 * @abstract action perform on button click.
 */
@property(nonatomic, strong) GetSocialAction *action;

/**
 * Creates GetSocialActivityPost instance.
 * @return new object
 */
- (GetSocialActivityPost *)build;

NS_ASSUME_NONNULL_END

@end
