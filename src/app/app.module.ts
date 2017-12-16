import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { SqlProvider } from '../providers/sql/sql';
import { NetworkProvider } from '../providers/network/network';
import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { HttpModule } from '@angular/http';
import { CryptoInfoProvider } from '../providers/crypto-info/crypto-info';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { HeaderColor } from '@ionic-native/header-color';

@NgModule({
  declarations: [
    MyApp,
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    Network,
    SqlProvider,
    NetworkProvider,
    OpenNativeSettings,
    CryptoInfoProvider,
    HeaderColor
  ]
})
export class AppModule {}
