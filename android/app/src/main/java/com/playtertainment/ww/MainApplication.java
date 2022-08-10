package com.playtertainment.ww;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.sudoplz.reactnativeamplitudeanalytics.RNAmplitudeSDKPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import io.branch.rnbranch.RNBranchModule;
import blueshift.BlueshiftPackage;
import com.blueshift.Blueshift;
import com.blueshift.BlueshiftLogger;
import com.blueshift.model.Configuration;
import ironsource.IronSourcePackage;

public class MainApplication extends Application implements ReactApplication {

    private static final String BLUESHIFT_API_KEY_PRODUCTION = "3fa1980d9cbfaacdb36c71208194daf2";
    private static final String BLUESHIFT_API_KEY_STAGING = "ce87ca6ea23ec9d88eb16b025c682db6";
    private static final String APPLICATION_ID_PRODUCTION = "com.playtertainment.ww";

    private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
          public boolean getUseDeveloperSupport() {
              return BuildConfig.DEBUG;
          }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // packages.add(new MyReactNativePackage());
            //  packages.add(new RNAmplitudeSDKPackage(MainApplication.this));
            //  packages.add(new ReactNativeConfigPackage());
            packages.add(new BlueshiftPackage());
            packages.add(new IronSourcePackage());
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }
   
  @Override
  public void onCreate() {
    super.onCreate();
    RNBranchModule.getAutoInstance(this);
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
    this.initializeBlueshift();
  }
  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
  private void initializeBlueshift() {
      BlueshiftLogger.setLogLevel(BlueshiftLogger.VERBOSE);
      Configuration configuration = new Configuration();
      configuration.setAppIcon(R.mipmap.ic_launcher);
      if(APPLICATION_ID_PRODUCTION == BuildConfig.APPLICATION_ID){
        configuration.setApiKey(BLUESHIFT_API_KEY_PRODUCTION);
      }
      else{
        configuration.setApiKey(BLUESHIFT_API_KEY_STAGING);
      }
      // Following methods will let you set the large & small icons for Notification
      configuration.setLargeIconResId(R.mipmap.ic_launcher);
      configuration.setSmallIconResId(R.mipmap.ic_launcher);
      // Following methods will help you setup Notification channel for Android O and above.
      configuration.setDefaultNotificationChannelId("My-Notification-Channel-Id");
      configuration.setDefaultNotificationChannelName("My-Notification-Channel-Name");
      configuration.setDefaultNotificationChannelDescription("My-Notification-Channel-Description");
      // This method tells the sdk to fire an app_open event automatically when
      // user starts the application
      configuration.setEnableAutoAppOpenFiring(true);
      // This method allows you to disable push - default value is true
      configuration.setPushEnabled(true);
      // configuration.setBatchInterval(16 * 60 * 1000); // setting batch time as 16min
      // Following methods will help you set-up in-app messages
      configuration.setInAppEnabled(true);
      configuration.setJavaScriptForInAppWebViewEnabled(true);
      configuration.setInAppBackgroundFetchEnabled(true);;
      Blueshift.getInstance(this).initialize(configuration);
  }

}
