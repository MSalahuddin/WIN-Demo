//
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "GetSocialConstants.h"

/*!
 * @typedef NS_ENUM(NSUInteger, GetSocialActivitiesFilter)
 * @abstract Defines query types.
 */
typedef NS_ENUM(NSUInteger, GetSocialActivitiesFilter) {
    /*!
     * @abstract No filter.
     */
    ActivitiesNoFilter = 0,
    /*!
     * @abstract Activities created before the specified activity.
     */
    ActivitiesBefore,
    /*!
     * @abstract Activities created after the specified activity.
     */
    ActivitiesAfter
};

/*!
 * @abstract Defines class to retrieve activity posts or comments.
 */
@interface GetSocialActivitiesQuery : NSObject

NS_ASSUME_NONNULL_BEGIN

/*!
 * @abstract Creates an GetSocialActivitiesQuery instance for retrieving post
 *      of global activity feed.
 * @result new instance.
 */
+ (instancetype)postsForGlobalFeed;

/*!
 * @abstract Creates an GetSocialActivitiesQuery instance for retrieving post
 *      of the specified activity feed.
 *
 * @param feed id of activity feed.
 * @result new instance.
 */
+ (instancetype)postsForFeed:(NSString *)feed;

/*!
 * @abstract Creates an GetSocialActivitiesQuery instance for retrieving comments
 *      posted for the specified activity post.
 *
 * @param activityId id of activity post.
 * @result new instance.
 */
+ (instancetype)commentsToPost:(GetSocialId)activityId;

/*!
 * @abstract Sets maximum size of the returned result.
 *
 * @param limit maximum size
 */
- (void)setLimit:(int)limit;

/*!
 * @abstract Sets filter for query.
 *
 * @param filter filter to use.
 * @param activityId activity id used by the filter.
 */
- (void)setFilter:(GetSocialActivitiesFilter)filter activityId:(GetSocialId)activityId;

/*!
 * @abstract Set filter by user ID.
 *
 * @param userId user identified
 */
- (void)setFilterByUser:(GetSocialId)userId;

/*!
 * @abstract Activities of your friends and your own.
 *
 * @param friendsFeed is only friends feed or not.
 */
- (void)setIsFriendsFeed:(BOOL)friendsFeed;

/*!
 * @abstract Activities that contains tags from list.
 *
 * @param tags tags to be filtered by.
 */
- (void)setTags:(NSArray *)tags;

/*!
 * @abstract Init method, should not be called.
 */
- (instancetype)init NS_UNAVAILABLE;

NS_ASSUME_NONNULL_END

@end
