//
//  GetSocialAction.h
//  GetSocial
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/*!
 * Describes possible actions.
 */
typedef NSString *GetSocialActionType NS_EXTENSIBLE_STRING_ENUM;

/*!
 * Custom action.
 */
static const GetSocialActionType GetSocialActionCustom = @"custom";

/*!
 * Open user's profile action.
 */
static const GetSocialActionType GetSocialActionOpenProfile = @"open_profile";

/*!
 * Open an activity action.
 */
static const GetSocialActionType GetSocialActionOpenActivity = @"open_activity";

/*!
 * Open invites UI action.
 */
static const GetSocialActionType GetSocialActionOpenInvites = @"open_invites";

/*!
 * Open an url action.
 */
static const GetSocialActionType GetSocialActionOpenUrl = @"open_url";

/*!
 * Add a friend action.
 */
static const GetSocialActionType GetSocialActionAddFriend = @"add_friend";

/*!
 * Claim Promo Code action.
 */
static const GetSocialActionType GetSocialActionClaimPromoCode = @"claim_promo_code";

#pragma mark - GetSocial Action Data Key

/*!
 * Defines possible action keys.
 */
typedef NSString *GetSocialActionDataKey NS_EXTENSIBLE_STRING_ENUM;

#pragma mark - GetSocial OpenActivity Action Data Keys

/*!
 * GetSocialActionDataKey_OpenActivity_ActivityId and GetSocialActionDataKey_OpenActivity_FeedName are mutually exclusive.
 */
static const GetSocialActionDataKey GetSocialActionDataKey_OpenActivity_ActivityId = @"$activity_id";

/*!
 * Optional. Can be present with GetSocialActionDataKey_OpenActivity_ActivityId only.
 */
static const GetSocialActionDataKey GetSocialActionDataKey_OpenActivity_CommentId = @"$comment_id";

/*!
 * GetSocialActionDataKey_OpenActivity_ActivityId and GetSocialActionDataKey_OpenActivity_FeedName are mutually exclusive.
 */
static const GetSocialActionDataKey GetSocialActionDataKey_OpenActivity_FeedName = @"$feed_name";

#pragma mark - GetSocial OpenProfile Action Data Keys

/*!
 * ID of user to be opened.
 */
static const GetSocialActionDataKey GetSocialActionDataKey_OpenProfile_UserId = @"$user_id";

/*!
 * ID of user who wants to add as friend
 */
static const GetSocialActionDataKey GetSocialActionDataKey_AddFriend_UserId = @"$user_id";

#pragma mark - GetSocial OpenUrl Action Data Keys

/*!
 * URL to be opened.
 */
static const GetSocialActionDataKey GetSocialActionDataKey_OpenUrl_Url = @"$url";

#pragma mark - GetSocial OpenUrl Action Data Keys

/*!
 * Promo Code to claim.
 */
static const GetSocialActionDataKey GetSocialActionDataKey_ClaimPromoCode_PromoCode = @"$promo_code";

#pragma mark - Entity

/*!
 * Describes an action.
 */
@interface GetSocialAction : NSObject

/*!
 * Action to perform.
 * @return one of {@link GetSocialActionTypes}.
 */
@property (nonatomic, readonly) GetSocialActionType type;

/*!
 * Action data.
 * @return action data.
 */
@property (nonatomic, readonly) NSDictionary<GetSocialActionDataKey, NSString *> *data;

@end

NS_ASSUME_NONNULL_END
