//
//  GetSocialUI
//
//  Copyright © 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GetSocial/GetSocialActivityPost.h>
#import <GetSocial/GetSocialPublicUser.h>
#import <GetSocial/GetSocialNotification.h>

/*!
 * @typedef GetSocialUIAction
 * @abstract Enumeration represents possible actions user is going to perform., while using GetSocial UI.
 * @constant GetSocialUIActionOpenComments Open activity comments list.
 * @constant GetSocialUIActionPostActivity Post an activity.
 * @constant GetSocialUIActionLikeComment Post a comment.
 * @constant GetSocialUIActionLikeActivity Like an activity.
 * @constant GetSocialUIActionLikeComment Like a comment.
 */
typedef NS_ENUM(NSInteger, GetSocialUIActionType) {
    /*!
     * @abstract Open activity comments list 
     */
    GetSocialUIActionOpenComments = 0,
    /*!
     * @abstract Post an activity.
     */
    GetSocialUIActionPostActivity,
    /*!
     * @abstract Post a comment.
     */
    GetSocialUIActionPostComment,
    /*!
     * @abstract Like an activity.
     */
    GetSocialUIActionLikeActivity,
    /*!
     * @abstract Like a comment.
     */
    GetSocialUIActionLikeComment
};

/*!
 *  @typedef void(^OnOpen)()
 *  @abstract The typedef defines the signature of a block that is called when GetSocial View is opened.
 *
 */
typedef void (^OnOpen)(void);

/*!
 *  @typedef void(^OnClose)()
 *  @abstract The typedef defines the signature of a block that is called when GetSocial View is closed.
 *
 */
typedef void (^OnClose)(void);

/*!
 *  @typedef void(^ActivityButtonActionHandler)(NSString *action, GetSocialActivityPost *post)
 *  @abstract The typedef defines the signature of a block that is called when any
 *   action triggered on Activity Feeds view.
 *
 */
typedef void(^ActivityButtonActionHandler)(NSString *action, GetSocialActivityPost *post);

/*!
 *  @typedef void(^AvatarClickHandler)(GetSocialPublicUser *user)
 *  @abstract The typedef defines block that is called when user clicked on any user avatar.
 */
typedef void(^AvatarClickHandler)(GetSocialPublicUser *user);


/*!
 *  @typedef void(^MentionClickHandler)(GetSocialId mention)
 *  @abstract The typedef defines block that is called when user clicked on any user mention,
 *      where mention is one of constants prefixed GetSocialUI_Shortcut_, or GetSocial User ID.
 */
typedef void(^MentionClickHandler)(GetSocialId mention);

/*!
 *  @typedef void(^TagClickHandler)(NSString *tagName)
 *  @abstract The typedef defines block that is called when user clicked on any tag.
 */
typedef void(^TagClickHandler)(NSString *tagName);

/*!
 * @typedef void (^GetSocialUIPendingAction)()
 * @abstract the typedef defines block to be called if you want to perform UI action.
 */
typedef void (^GetSocialUIPendingAction)(void);

/*!
* @typedef void (^GetSocialUIActionHandler)(GetSocialUIAction actionType, GetSocialUIPendingAction pendingAction)
* @abstract The typedef defines the block that is called before execution of action. If you want to allow action, call
* pendingAction block. Otherwise, do nothing.
*/
typedef void (^GetSocialUIActionHandler)(GetSocialUIActionType actionType, GetSocialUIPendingAction pendingAction);

/*!
 * @abstract App mention shortcut.
 */
extern NSString *GetSocialUI_Shortcut_App;

/*!
 * @typedef void (^GetSocialUINotificationClickHandler)(GetSocialNotification* notification)
 * @abstract The typedef defines the block that is called when a notification is clicked on. Return YES,
 * if you handle the action, otherwise return NO.
 */
typedef BOOL (^GetSocialUINotificationClickHandler)(GetSocialNotification* notification);

/*!
 * @typedef void (^GetSocialUINotificationActionButtonHandler)(GetSocialNotification* notification, GetSocialActionButton* actionButton)
 * @abstract The typedef defines the block that is called when an action button is clicked on. Return YES,
 * if you handle the action, otherwise return NO.
 */
typedef BOOL (^GetSocialUINotificationActionButtonHandler)(GetSocialNotification* notification, GetSocialActionButton* actionButton);

/*!
* @typedef NSString* (^GetSocialUICustomErrorMessageProvider)(GetSocialErrorCode* errorCode, NSString* errorMessage)
* @abstract The typedef defines the block that is called before an error message will be shown on the UI. Return custom error message
* or return the original error message received in errorMessage.
*/
typedef NSString* (^GetSocialUICustomErrorMessageProvider)(NSInteger errorCode, NSString* errorMessage);
