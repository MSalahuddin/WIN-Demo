//
//  GetSocialUI
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import "GetSocialUIView.h"

NS_ASSUME_NONNULL_BEGIN

/*!
 *  @abstract Defines GetSocialUIActivityFeedView class.
 */
@interface GetSocialUIActivityFeedView : GetSocialUIView

/*!
 *  @abstract Creates GetSocialUIActivityFeedView using the provided feed id.
 *
 *  @param feed id of activity feed.
 */
+ (instancetype)viewForFeed:(NSString *)feed;

/*!
 *  @abstract Sets an action handler, that will be called if button on Activity Feed is pressed.
 *
 *  @param buttonActionHandler block that will be called.
 *  @deprecated Use setActionHandler.
 */
- (void)setActionButtonHandler:(ActivityButtonActionHandler)buttonActionHandler DEPRECATED_ATTRIBUTE;

/*!
 *  @abstract set action handler to be invoked on button clicked.
 *
 *  @param handler block to be called.
 */
- (void)setActionHandler:(GetSocialActionHandler)handler;

/*!
 *  @abstract Sets a handler, that will be called if user clicks on any user avatar.
 *
 *  @param avatarClickHandler block that will be called.
 */
- (void)setAvatarClickHandler:(AvatarClickHandler)avatarClickHandler;

/*!
 *  @abstract Sets a handler, that will be called if user clicks on any user mention.
 *
 *  @param mentionClickHandler block that will be called
 */
- (void)setMentionClickHandler:(MentionClickHandler)mentionClickHandler;

/*!
 *  @abstract Sets a handler, that will be called if user clicks on any tag.
 *
 *  @param tagClickHandler block that will be called
 */
- (void)setTagClickHandler:(TagClickHandler)tagClickHandler;

/*!
 * @abstract Set this to valid user id if you want to display feed of only one user.
 * If is not set, normal feed will be shown.
 *
 * @param userId identifier of user.
 */
- (void)setFilterByUser:(GetSocialId)userId;

/*!
 * @abstract Display feed with posts, that contains at least one tag from the list.
 * @param tags tags to filter by.
 */
- (void)setFilterByTags:(NSArray *)tags;

/*!
 * @abstract Make the feed read-only. UI elements, that allows to post, comment or like are hidden.
 *
 * @param readOnly should feed be read-only.
 */
- (void)setReadOnly:(BOOL)readOnly;

/*!
 * @abstract Show only yours and friends posts.
 * @param showFriendsFeed show friends feed or not.
 */
- (void)setShowFriendsFeed:(BOOL)showFriendsFeed;

NS_ASSUME_NONNULL_END

@end
