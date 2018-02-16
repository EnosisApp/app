import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage({
  name: 'HandicapPage'
})
@Component({
  selector: 'page-handicap',
  templateUrl: 'handicap.html',
})
export class HandicapPage {
  handicapSelect: any;
  dataInfoUser: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.storage.get('userData').then((userPrefs) => {
        this.dataInfoUser = JSON.parse(userPrefs);
        this.handicapSelect = this.dataInfoUser['handicap'];
    });
  }

  actionHandicap() {
    this.dataInfoUser['handicap'] = this.handicapSelect;
  }

  public saveUserHandicap(): void {
    this.storage.set('userData', JSON.stringify(this.dataInfoUser));
    // Check state
    this.storage.get('profilClosed').then((result) => {
      if(result) {
        this.navCtrl.pop();
      } else {
        this.navCtrl.push('CategPoiPage');
      }
    });
  }

}
