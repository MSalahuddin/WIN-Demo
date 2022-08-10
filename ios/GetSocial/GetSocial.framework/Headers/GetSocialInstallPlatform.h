//
//
// Copyright (c) 2019 GetSocial BV. All rights reserved.
//

#import <Foundation/Foundation.h>

/*!
 * May contains not currently available platforms for the future compatibility.
 */
typedef NSString *GetSocialInstallPlatform NS_EXTENSIBLE_STRING_ENUM;

/*!
 * Install was performed via GetSocial Android or Android/Unity SDK.
 */
static const GetSocialInstallPlatform GetSocialInstallPlatform_Android = @"Android";

/*!
 * Install was performed via GetSocial iOS or iOS/Unity SDK.
 */
static const GetSocialInstallPlatform GetSocialInstallPlatform_iOS = @"iOS";

/*!
 * Install was performed via GetSocial HTTP API.
 */
static const GetSocialInstallPlatform GetSocialInstallPlatform_API = @"API";

/*!
 * Install was performed via GetSocial Web SDK on Android device.
 */
static const GetSocialInstallPlatform GetSocialInstallPlatform_Web_Android = @"Web_Android";

/*!
 * Install was performed via GetSocial Web SDK on iOS device.
 */
static const GetSocialInstallPlatform GetSocialInstallPlatform_Web_iOS = @"Web_iOS";

/*!
 * Install was performed via GetSocial Web SDK on desktop(Mac, Windows, Linux).
 */
static const GetSocialInstallPlatform GetSocialInstallPlatform_Web_Desktop = @"Web_Desktop";

/*!
 * Install was performed via GetSocial Unity SDK on Windows.
 */
static const GetSocialInstallPlatform GetSocialInstallPlatform_Desktop_Windows = @"Desktop_Windows";

/*!
 * Install was performed via GetSocial Unity SDK on Mac.
 */
static const GetSocialInstallPlatform GetSocialInstallPlatform_Desktop_Mac = @"Desktop_Mac";

/*!
 * Install was performed via GetSocial Unity SDK on Linux.
 */
static const GetSocialInstallPlatform GetSocialInstallPlatform_Desktop_Linux = @"Desktop_Linux";

/*!
 * Install was done by something not currently supported by GetSocial.
 */
static const GetSocialInstallPlatform GetSocialInstallPlatform_Other = @"Other";

