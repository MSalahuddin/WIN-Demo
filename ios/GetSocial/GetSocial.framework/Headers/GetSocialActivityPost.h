//
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GetSocial/GetSocialConstants.h>

@class GetSocialAction;
@class GetSocialPostAuthor;
@class GetSocialMention;

/*!
 * @abstract Model for GetSocial Activity Feed post or comment content and metadata like id, author, etc.
 */
@interface GetSocialActivityPost : NSObject

NS_ASSUME_NONNULL_BEGIN

/*!
 * @abstract Id of activity post.
 */
@property(nonatomic, readonly) GetSocialId activityId;

/*!
 * @abstract Text content of activity post.
 */
@property(nonatomic, copy, readonly, nullable) NSString *text;

/*!
 * @abstract Title of button in activity post.
 */
@property(nonatomic, copy, readonly, nullable) NSString *buttonTitle;

/*!
 * @abstract Action of button in activity post.
 * @deprecated Use action property.
 */
@property(nonatomic, copy, readonly, nullable) NSString *buttonAction DEPRECATED_ATTRIBUTE;

/*!
 * @abstract Image's url in activity post.
 */
@property(nonatomic, copy, readonly, nullable) NSString *imageUrl;

/*!
 * @abstract Video's url in activity post.
 */
@property(nonatomic, copy, readonly, nullable) NSString *videoUrl;

/**
 * @abstract UNIX-timestamp of date in seconds when the post was created.
 */
@property(nonatomic, readonly) NSUInteger createdAt;

/**
 * @abstract UNIX-timestamp of date in seconds when sticky period starts.
 */
@property(nonatomic, readonly) NSUInteger stickyStart;
/**
 * @abstract UNIX-timestamp of date in seconds when sticky period ends.
 */
@property(nonatomic, readonly) NSUInteger stickyEnd;

/*!
 * @abstract Author of the post
 */
@property(nonatomic, strong, readonly) GetSocialPostAuthor *author;

/*!
 * @abstract Returns if the current user liked the post or not.
 */
@property(nonatomic, readonly) BOOL isLikedByMe;

/*!
 * @abstract Returns number of likes.
 */
@property(nonatomic, readonly) NSInteger likesCount;

/*!
 * @abstract Returns number of comments.
 */
@property(nonatomic, readonly) NSInteger commentsCount;

/*!
 * @abstract Returns a feed in which activity or comment was posted.
 */
@property(nonatomic, strong, readonly) NSString *feedId;

/*!
 * @abstract Returns mentions that are present in contentText.
 */
@property(nonatomic, strong, readonly) NSArray<GetSocialMention *> *mentions;

/*!
 * @abstract Action to perform on button click.
 */
@property(nonatomic, strong, readonly) GetSocialAction *action;

/*!
 * @abstract Checks if post is sticky at the provided date.
 *
 * @param date date to check.
 * @result YES, if post is sticky, NO if not.
 */
- (BOOL)isStickyAt:(NSDate *)date;

NS_ASSUME_NONNULL_END

@end
