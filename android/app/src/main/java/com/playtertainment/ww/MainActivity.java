package com.playtertainment.ww;

//import com.blueshift.Blueshift;
//import com.blueshift.BlueshiftLogger;
//import com.blueshift.model.Configuration;
import com.facebook.react.ReactActivity;
import android.os.Bundle;
import io.branch.rnbranch.*; 
import android.content.Intent;
import android.util.Log;


public class MainActivity extends ReactActivity {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected String getMainComponentName() {
        return "Win_demo";
    }
        @Override
    protected void onStart() {
            super.onStart();
        RNBranchModule.initSession(getIntent().getData(), this);
    }
 
    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }
   }
