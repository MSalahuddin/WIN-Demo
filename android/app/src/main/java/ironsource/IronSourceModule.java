package ironsource;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.ironsource.mediationsdk.IronSource;
import com.ironsource.mediationsdk.impressionData.ImpressionDataListener;
import com.ironsource.mediationsdk.impressionData.ImpressionData;
// import com.google.gson.Gson;
// import com.google.gson.GsonBuilder;
import androidx.annotation.Nullable;
import android.util.Log;
// import org.json.JSONObject;

public class IronSourceModule extends ReactContextBaseJavaModule {
    private static final String TAG = "IronSourceBridge";
    private ReactApplicationContext applicationContext;
    private boolean initialized;

    IronSourceModule(ReactApplicationContext applicationContext) {
        super(applicationContext);
        this.applicationContext = applicationContext;
    }

    @Override
    public String getName() {
        return TAG;
    }

    @ReactMethod
    public void initializeImpressionData() {
        if (!initialized) {
            initialized = true;
            Log.d(TAG, "IronSource ImpressionData Initialized");
            IronSource.addImpressionDataListener(new ImpressionDataListener() {
                @Override
                public void onImpressionSuccess(ImpressionData impressionData) {
                    if (impressionData != null) { 
                        Double revenue = impressionData.getRevenue();
                        String adNetwork = impressionData.getAdNetwork();
                        String adUnit = impressionData.getAdUnit();
                        String instanceName = impressionData.getInstanceName();
                        Double lifetimeRevenue = impressionData.getLifetimeRevenue();
                        // JSONObject allData = impressionData.getAllData();
                        // Gson gson = new GsonBuilder().setPrettyPrinting().create();
                        // String allDataJson = gson.toJson(allData);

                        // Log.d(TAG, "onImpressionSuccess() called! " + revenue + " " + adNetwork + " " + adUnit + " " + instanceName + " " + lifetimeRevenue);

                        WritableMap map = Arguments.createMap();
                        map.putDouble("revenue", revenue);
                        map.putString("adNetwork", adNetwork);
                        map.putString("adUnit", adUnit);
                        map.putString("instanceName", instanceName);
                        map.putDouble("lifetimeRevenue", lifetimeRevenue);

                        sendEvent("ironSourceImpressionData", map);
                    }
                }
            });
        }
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}