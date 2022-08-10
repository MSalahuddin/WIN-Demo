//
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>

/*!
 * @abstract Contains properties of an invite.
 */
@interface GetSocialInviteProperties : NSObject

/** @name Properties */

/*!
 * @abstract Action to use.
 */
@property(nonatomic, readonly) NSString *action;

/*!
 * @abstract Type of content.
 */
@property(nonatomic, readonly) NSString *contentType;

/*!
 * @abstract Name of package.
 */
@property(nonatomic, readonly) NSString *packageName;

/*!
 * @abstract Url scheme.
 */
@property(nonatomic, readonly) NSString *urlScheme;

@end
