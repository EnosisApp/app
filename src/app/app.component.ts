import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingController } from 'ionic-angular';

import { Http } from '@angular/http';
import { Config } from '../config';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { AgePage } from '../pages/age/age';
import { SlidesPage } from '../pages/slides/slides';
import { CategPoiPage } from '../pages/categ-poi/categ-poi';
import { HandicapPage } from '../pages/handicap/handicap';
import { ReglagesPage } from '../pages/reglages/reglages';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  loader: any;
  pages: Array<{title: string, component: any, icon: string}>;

  sessionId: any;
  dataPois: any;

  constructor(platform: Platform, private statusBar: StatusBar, splashScreen: SplashScreen, public loadingCtrl: LoadingController, public http: Http, public storage: Storage) {
    this.http = http;

    platform.ready().then(() => {
      this.storage.get('introShown').then((result) => {
        if(result){
          this.rootPage = HomePage;///////////////////////
        } else {
          this.rootPage = SlidesPage;
        }
        // this.loader.dismiss();
      });
      // Okay, so the platform is  ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      splashScreen.hide();
    });

    this.storage.get('userData').then((data) => {
      if(data) {
            this.dataPois = JSON.parse(data);
      } else {
          // Structure des données qui vont être envoyés à l'API et sauvegardé dans le localStorage
          this.dataPois = {
            handicap: false,
            age : "",
            activities: [],
            lang : [],
            music : [],
            sport: []
          }
          this.storage.set('userData', JSON.stringify(this.dataPois))
        }
      });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Centres d\'intérêts', component: CategPoiPage, icon: 'poi'},
      { title: 'Age', component: AgePage, icon: 'age' },
      { title: 'Handicap', component: HandicapPage, icon: 'access'},
      // { title: 'Aide', component: SlidesPage, icon: 'help'},
      { title: 'Réglages', component: ReglagesPage, icon :'settings'}
    ];
  }

   presentLoading() {
     this.statusBar.overlaysWebView(false);
     this.statusBar.styleLightContent();

     this.loader = this.loadingCtrl.create({
       content: "Authenticating..."
     });
     this.loader.present();
   }

   openPage(page) {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      this.nav.push(page.component);
    }

  // GESTION DES SESSIONS
  startSession() {
    // Le gars arrive au niveau du beacon : on envoie la data à l'API
    this.http.post(Config.API_ENDPOINT + 'api/v2/session/start', {
      prefs: this.dataPois,
      poi: 5
    }).subscribe(data => {
      var dataL = data.json();
      this.sessionId = dataL.id;
    });
  }

  sendSession() {
    // L'utilisateur reste au POI
    this.http.post(Config.API_ENDPOINT + 'api/v2/session/heartbeat', {
      session_id: this.sessionId
    }).subscribe(data => {
      console.log("continue");
    });
  }

  stopSession() {
    // L'utilisateur quitte le POI
    this.http.post(Config.API_ENDPOINT + 'api/v2/session/stop', {
      session_id: this.sessionId
    }).subscribe(data => {
      console.log("stop");
    });
  }
}
