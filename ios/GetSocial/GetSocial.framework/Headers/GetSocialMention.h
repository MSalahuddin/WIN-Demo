//
//
// Copyright (c) 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "GetSocialConstants.h"

/*!
 * @abstract Mention object.
 */
@interface GetSocialMention : NSObject

/*!
 * @abstract Id of user that is mentioned.
 */
@property (nonatomic, strong, readonly) GetSocialId userId;

/*!
 * Start position in text where the user is mentioned.
 */
@property (nonatomic, readonly) uint startIndex;

/*!
 * End position in text where the user is mentioned.
 */
@property (nonatomic, readonly) uint endIndex;

/*!
 * Type of mention, one of constants prefixed with GetSocial_MentionType_ in GetSocialConstants file.
 */
@property (nonatomic, readonly) NSString *type;

@end

