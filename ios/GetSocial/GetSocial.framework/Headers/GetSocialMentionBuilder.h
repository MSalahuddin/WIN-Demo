//
//
// Copyright (c) 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "GetSocialConstants.h"

@class GetSocialMention;

/*!
 * @abstract Builder class to create mentions.
 */
@interface GetSocialMentionBuilder : NSObject

/*!
 * @abstract Id of user that is mentioned.
 */
@property(nonatomic, strong) GetSocialId userId;

/*!
 * Start position in text where the user is mentioned.
 */
@property(nonatomic) uint startIndex;

/*!
 * End position in text where the user is mentioned.
 */
@property(nonatomic) uint endIndex;

/*!
 * Type of mention, one of constants prefixed with GetSocial_MentionType_ in GetSocialConstants file.
 */
@property(nonatomic, readonly) NSString *type;

/*!
 * Build a mention.
 * @return new mention instance.
 */
- (GetSocialMention *)build;

@end
