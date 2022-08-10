//
//  GetSocialUI
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GetSocial/GetSocialMutableInviteContent.h>
#import "GetSocialUIView.h"

/**
 *  Defines GetSocialUIInvitesView class
 */
@interface GetSocialUIInvitesView : GetSocialUIView

NS_ASSUME_NONNULL_BEGIN

/** @name Methods */

/*!
 *  @abstract Sets custom invite content to send.
 *  If not set the content configured in the GetSocial Dashboard will be used.
 *
 *  @param customInviteContent Invite Content to send
 */
- (void)setCustomInviteContent:(GetSocialMutableInviteContent *)customInviteContent;

/*!
 *  @abstract Sets custom referral data to send.
 *
 *  @deprecated Use setLinkParams instead.
 *  @param customReferralData Custom referral data to send
 */
- (void)setCustomReferralData:(NSDictionary *)customReferralData DEPRECATED_ATTRIBUTE;

/*!
 *  @abstract Sets link parameters to send.
 *
 *  @param linkParams Link parameters to send
 */
- (void)setLinkParams:(NSDictionary *)linkParams;

/*!
 *  @abstract Registers a handler to be notified about different events.
 *
 *  @param success Called if invites sent successfully
 *  @param cancel  Called if invite sending is cancelled
 *  @param failure Called if invite sending failed
 */
- (void)setHandlerForInvitesSent:(void (^)(NSString *channelId))success
                          cancel:(void (^)(NSString *channelId))cancel
                         failure:(void (^)(NSString *channelId, NSError *error))failure;

NS_ASSUME_NONNULL_END

@end
