import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { PoiPage } from '../poi/poi';
import { Storage } from '@ionic/storage';

@IonicPage({
  name: 'CategPoiPage'
})
@Component({
  selector: 'page-categ-poi',
  templateUrl: 'categ-poi.html',
})
export class CategPoiPage {
  icons: Array<{title: string, iconName: string, txtIntro: string, activeCateg: boolean}>;
  active: boolean = false;
  categories: any;
  progress: number = 0;
  dataPois: any;
  info_icon: boolean = false;
  icon_title: any;
  icon_short: any;
  icon_categTxt: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _sanitizer: DomSanitizer, public storage: Storage) {
    // Icones des catégories de POI
    this.icons = [
      { title: 'Activité', iconName: 'activities', txtIntro: 'Je suis passionné par...', activeCateg: false},
      { title: 'Langue', iconName: 'lang', txtIntro: 'Je parle le...', activeCateg: false},
      { title: 'Musique', iconName: 'music', txtIntro: 'J\'écoute...', activeCateg: false},
      { title: 'Sport', iconName: 'sport', txtIntro: 'Je pratique le...', activeCateg: false }
    ];
  }

  ionViewWillEnter() {
    this.storage.get('userData').then((userPrefs) => {
      if (userPrefs) {
        this.dataPois = JSON.parse(userPrefs);
        // Create array of iconName
        var pop = (this.icons.map(function(elem){ return elem.iconName }));
        for(var i = 0; i < (pop.length); i++) {
          var b = pop[i];
          if(Object.keys(this.dataPois[b]).length > 0) {
            this.icons[i]['activeCateg'] = true;
          } else {
            this.icons[i]['activeCateg'] = false;
          }
        }
      }
    });
  }

  getImg(imgName: string) {
    return this._sanitizer.bypassSecurityTrustResourceUrl('./assets/img/logo_'+imgName+'.svg');
  }

  savePoi() {
    this.storage.get('profilClosed').then((result) => {
      if(result) {
        this.navCtrl.pop();
      } else {
        this.navCtrl.setRoot('HomePage', {
          profilFull: true
        });
        this.storage.set('profilClosed', true);
      }
    });
  }

  itemTapped(icon) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(PoiPage, {
      category: icon['iconName'],
      categIntroTxt: icon['txtIntro'],
      categoryTxt: icon['title']
    });
  }
}
