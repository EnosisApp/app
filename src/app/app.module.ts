import { Session } from './../Session';
import { BackgroundTaskService } from './../BackgroundTaskService';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomeModule } from '../pages/home/home.module';
import { CategPoiPageModule } from '../pages/categ-poi/categ-poi.module';
import { AgePageModule } from '../pages/age/age.module';
import { HandicapPageModule } from '../pages/handicap/handicap.module';
import { ReglagesPageModule } from '../pages/reglages/reglages.module';
import { CreditsPageModule } from '../pages/credits/credits.module';
import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';

import { PoiPage } from '../pages/poi/poi';
import { SlidesPage } from '../pages/slides/slides';

import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonProvider } from '../providers/common/common';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { BackgroundMode } from '@ionic-native/background-mode';
import { BLE } from '@ionic-native/ble';

import { LocalNotifications } from '@ionic-native/local-notifications';

@NgModule({
  declarations: [
    MyApp,
    PoiPage,
    SlidesPage
  ],
  imports: [
    BrowserModule,
    HomeModule,
    CategPoiPageModule,
    AgePageModule,
    HandicapPageModule,
    ReglagesPageModule,
    CreditsPageModule,
    HttpModule,
    AngularSvgIconModule,
    IonicModule.forRoot(MyApp, {
          backButtonText: 'Retour',
          iconMode: 'ios',
          modalEnter: 'modal-slide-in',
          modalLeave: 'modal-slide-out',
          tabsPlacement: 'bottom',
          pageTransition: 'ios'
        },
    ),
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PoiPage,
    SlidesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonProvider,
    BackgroundTaskService,
    BackgroundMode,
    BLE,
    LocalNotifications,
    Session
  ]
})
export class AppModule {}
