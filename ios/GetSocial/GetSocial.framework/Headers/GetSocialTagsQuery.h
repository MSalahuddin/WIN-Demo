//
//
// Copyright (c) 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>

/*!
 * @abstract Class to create tags queries.
 */
@interface GetSocialTagsQuery : NSObject

/*!
 * @abstract Create a query to find all tags for global feed.
 * @return new query instance.
 */
+ (instancetype)tagsForGlobalFeed;

/*!
 * @abstract Create a query to find all tags for specific feed.
 * @param feedName name of the feed.
 * @return new query instance.
 */
+ (instancetype)tagsForFeed:(NSString *)feedName;

/*!
 * @abstract Create a query to find all tags that starts with name.
 * @param tagName query parameter.
 */
- (void)setName:(NSString *)tagName;

/*!
 * Set a limit for a query. Default is 5. Limit should be between 0 and 20.
 * @param limit max count of tags to retrieve.
 */
- (void)setLimit:(int)limit;

@end
