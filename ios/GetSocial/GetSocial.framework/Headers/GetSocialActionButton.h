//
//  GetSocialActionButton.h
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/*!
 * Possible action ids to assign to a button.
 */
typedef NSString *GetSocialActionId NS_EXTENSIBLE_STRING_ENUM;

/*!
 * Consume action id.
 */
static const GetSocialActionId GetSocialActionIdConsume = @"consume";

/*!
 * Ignore action id.
 */
static const GetSocialActionId GetSocialActionIdIgnore = @"ignore";

/*!
 * Action button class.
 */
@interface GetSocialActionButton : NSObject

/*!
 * @abstract Button's title.
 */
@property(nonatomic, strong, readonly) NSString *title;

/*!
 * @abstract Button's action id.
 */
@property(nonatomic, strong, readonly) GetSocialActionId actionId;

/*!
 * @abstract Creates a new GetSocialActionButton instance using the provided parameters.
 * @param title button's title
 * @param actionId button's action
 */
+ (instancetype)createWithTitle:(NSString *)title andActionId:(GetSocialActionId)actionId;

@end

NS_ASSUME_NONNULL_END
