import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HeaderColor } from '@ionic-native/header-color';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string = "HomePage";

  constructor(headerColor:HeaderColor,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      
      // let status bar not overlay webview
      statusBar.overlaysWebView(false);
      //change headercolor
      headerColor.tint('#00112e');
      // set status bar to white
      statusBar.backgroundColorByHexString('#00112e');
      splashScreen.hide();
    });
  }
}

