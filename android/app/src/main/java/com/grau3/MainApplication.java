package com.grau3;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.brentvatne.react.ReactVideoPackage;
import com.chirag.RNMail.RNMail;
import com.rnfs.RNFSPackage;
import dk.madslee.imageSequence.RCTImageSequencePackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactVideoPackage(),
            new RNMail(),
            new RNFSPackage(),
            new RCTImageSequencePackage(),
            new RNViewShotPackage(),
            new RNSoundPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
