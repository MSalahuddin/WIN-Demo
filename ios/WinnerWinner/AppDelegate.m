/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <AppCenterReactNativeShared/AppCenterReactNativeShared.h>
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeCrashes.h>
#import <React/RCTLinkingManager.h>
#import "Amplitude.h"
#import "ReactNativeConfig.h"
//#import <RNCPushNotificationIOS.h>
#import <RNBranch/RNBranch.h>
#import <Firebase.h>
#import "ReactNativeConfig.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <RNAppsFlyer.h>


@implementation AppDelegate

- (void)requestAppOpenAd {
  self.appOpenAd = nil;
  NSString* IOS_ADMOB_ID = [ReactNativeConfig envFor:@"ADMOB_APP_OPEN_AD_ID"];
  [GADAppOpenAd loadWithAdUnitID:IOS_ADMOB_ID
                         request:[GADRequest request]
                     orientation:UIInterfaceOrientationPortrait
               completionHandler:^(GADAppOpenAd *_Nullable appOpenAd, NSError *_Nullable error) {
                 if (error) {
                   NSLog(@"Failed to load app open ad: %@", error);
                   return;
                 }
                 self.appOpenAd = appOpenAd;
                if (self.appOpenAd) {
                  UIViewController *rootController = self.window.rootViewController;
                  [self.appOpenAd presentFromRootViewController:rootController];
                  self.appOpenAd = nil;
                }
               }];
}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSString * const BLUESHIFT_API_KEY_PRODUCTION = @"3fa1980d9cbfaacdb36c71208194daf2";
  NSString * const BLUESHIFT_API_KEY_STAGING = @"ce87ca6ea23ec9d88eb16b025c682db6";
  NSString * const APP_GROUP_ID_PRODUCTION = @"group.com.playtertainment.ww";
  NSString * const APP_GROUP_ID_STAGING = @"group.com.playtertainment.ww.stg";
  NSString * const APP_GROUP_ID_DEVELOPMENT = @"group.com.playtertainment.ww.beta";
  NSString * const BUNDLE_ID_PRODUCTION = @"com.playtertainment.ww";
  NSString * const BUNDLE_ID_STAGING = @"com.playtertainment.ww.stg";
  
  NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
  

  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];

  [FBSDKSettings enableLoggingBehavior:FBSDKLoggingBehaviorAppEvents];



  

  // Obtain an instance of BlueShiftConfig.
  BlueShiftConfig *config = [BlueShiftConfig config];
  
  if([bundleIdentifier isEqualToString: BUNDLE_ID_PRODUCTION]) {
    [config setApiKey: BLUESHIFT_API_KEY_PRODUCTION];
    // Set app group id for Carousel deep linking
    [config setAppGroupID: APP_GROUP_ID_PRODUCTION];
  }
  else if([bundleIdentifier isEqualToString: BUNDLE_ID_STAGING]){
    [config setApiKey: BLUESHIFT_API_KEY_STAGING];
    // Set app group id for Carousel deep linking
    [config setAppGroupID: APP_GROUP_ID_STAGING];
  }
  else{
    [config setApiKey: BLUESHIFT_API_KEY_STAGING];
    // Set app group id for Carousel deep linking
    [config setAppGroupID: APP_GROUP_ID_DEVELOPMENT];
  }
  
  //Enabled deug info logs
  [config setDebug:YES];
  
  // Enable BlueShift Push Notification. By Default Push notfications are enabled.
  [config setEnablePushNotification:NO];
  
  //Set userNotificationDelegate for push notificaitons
  [config setUserNotificationDelegate:self];
  
  //Enable Blueshift In-app notifications
  [config setEnableInAppNotification: YES];
  
  
  //Optional :Set batched events upload interval in seconds. By defult its 300 seconds.
  [[BlueShiftBatchUploadConfig sharedInstance] setBatchUploadTimer:60.0];
  
  //Optional :Set time interval in seconds between two cosecutive In-app message displays staying on same screen. By default its 60 seconds.
  [config setBlueshiftInAppNotificationTimeInterval:30.0];
  
  // Optional: SDK uses IDFV by default if you do not
  //include the following line of code.For more information, see:
  //Set deviceIDSource as custom
  [config setBlueshiftDeviceIdSource: BlueshiftDeviceIdSourceCustom];
  //Set the custom device id value
  [config setCustomDeviceId: [UIDevice currentDevice].identifierForVendor.UUIDString];
  
  
  
  // Optional: Set the applications launch Options for SDK to track.
  [config setApplicationLaunchOptions:launchOptions];
  
  // Optional: Set the Three Predefined DeepLinking URL's for category based push notifications
  //   [config setProductPageURL:[NSURL URLWithString:@"Product page URL here"]];
  //   [config setCartPageURL:[NSURL URLWithString:@"Cart page URL here"]];
  //   [config setOfferPageURL:[NSURL URLWithString:@"Offer page URL here"]];
  
  //Set universal links delegate to enable Blueshift Universal links
  [config setBlueshiftUniversalLinksDelegate:self];
  
  // Initialize the configuration
  [BlueShift initWithConfiguration:config];
  
  
  
  // Add me --- \/
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }
  // Add me --- /\
  // ...
  
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];  // Initialize AppCenter crashes
  [AppCenterReactNative register];  // Initialize AppCenter
  [[Amplitude instance] initializeApiKey: [ReactNativeConfig envFor:@"AMPLITUDE_API_KEY"]];
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Win_demo"
                                            initialProperties:nil];
  
  rootView.backgroundColor = [[UIColor alloc] initWithRed:0.65f green:0.76f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  //  #if DEBUG
  //    [RNBranch useTestInstance];
  //  #endif
  
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  


  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  
  
  if ([[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options]) {
     return YES;
   }
  [UIApplication.sharedApplication openURL:url options:@{} completionHandler:^(BOOL success) {
  }];
  
  if (![RNBranch.branch application:application openURL:url options:options]) {
    // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
    return [RCTLinkingManager application:application openURL:url options:options];
  }
  
  [[AppsFlyerAttribution shared] handleOpenUrl:url options:options];

  return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation {
    // version >= 6.2.10
    [[AppsFlyerAttribution shared] handleOpenUrl:url sourceApplication:sourceApplication annotation:annotation];
    return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler {
   [RNBranch continueUserActivity:userActivity];
   [[AppsFlyerAttribution shared] continueUserActivity:userActivity restorationHandler:restorationHandler];
  return YES;
}




- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(nonnull NSData *)deviceToken {
  [[BlueShift sharedInstance].appDelegate registerForRemoteNotification:deviceToken];
  // notify AppsFlyerLib
  [[AppsFlyerLib shared] registerUninstall:deviceToken];
}

- (void)application:(UIApplication*)application didFailToRegisterForRemoteNotificationsWithError:(NSError*)error {
  [[BlueShift sharedInstance].appDelegate failedToRegisterForRemoteNotificationWithError:error];
  
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))handler {
  [[BlueShift sharedInstance].appDelegate handleRemoteNotification:userInfo forApplication:application fetchCompletionHandler:handler];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo {
  [[BlueShift sharedInstance].appDelegate application:application handleRemoteNotification:userInfo];
  
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(nonnull UILocalNotification *)notification {
  [[BlueShift sharedInstance].appDelegate application:application handleLocalNotification:notification];
}

- (void)application:(UIApplication *) application handleActionWithIdentifier: (NSString *) identifier forRemoteNotification: (NSDictionary *) notification completionHandler: (void (^)()) completionHandler {
  [[BlueShift sharedInstance].appDelegate handleActionWithIdentifier:identifier forRemoteNotification:notification completionHandler:completionHandler];
  
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
  // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
  // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
  [[BlueShift sharedInstance].appDelegate appDidEnterBackground:application];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    [[BlueShift sharedInstance].appDelegate appDidBecomeActive:application];
  
  NSString *pastAdTime = [[NSUserDefaults standardUserDefaults] stringForKey:@"ADDMOB_TIME"];
  NSDate *today = [NSDate date];
  NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
  [dateFormat setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
  NSString *dateString = [dateFormat stringFromDate:today];
  
  if (pastAdTime == NULL) {
    [[NSUserDefaults standardUserDefaults] setObject:dateString forKey:@"ADDMOB_TIME"];
    [[NSUserDefaults standardUserDefaults] synchronize];
    [self requestAppOpenAd];
    
  } else {
    NSDateFormatter *df=[[NSDateFormatter alloc] init];
    [df setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    NSDate *date2 = [df dateFromString:dateString];
    NSDate *date1 = [df dateFromString:pastAdTime];
    NSTimeInterval diff = [date2 timeIntervalSinceDate:date1];
    NSLog(@"no of hours: %f", diff/60);
    
    if ((diff/3600) > 5.9){
      [[NSUserDefaults standardUserDefaults] setObject:dateString forKey:@"ADDMOB_TIME"];
      [[NSUserDefaults standardUserDefaults] synchronize];
      [self requestAppOpenAd];
    }
  }
  
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler{
  [[BlueShift sharedInstance].userNotificationDelegate handleUserNotificationCenter:center willPresentNotification:notification withCompletionHandler:^(UNNotificationPresentationOptions options) {
    completionHandler(options);
  }];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
  [[BlueShift sharedInstance].userNotificationDelegate handleUserNotification:center didReceiveNotificationResponse:response withCompletionHandler:^{
    completionHandler();
  }];
}

//- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
//{
//  [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
//}
// Required for the register event.
//- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
//{
//  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
//}
// Required for the notification event. You must call the completion handler after handling the remote notification.
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
//fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
//{
//  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
//}
// Required for the registrationError event.
//- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
//{
//  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
//}
// Required for the localNotification event.
//- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
//{
//  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
//}

@end
