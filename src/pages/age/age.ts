import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-age',
  templateUrl: 'age.html'
})
@IonicPage({
  name: 'AgePage'
})
export class AgePage {
  ages: Array<{text: string, value: number, activeAge: boolean}>;
  ageActive: boolean = false;
  ageSelect: number;
  dataInfoUser: any;

  constructor(public navCtrl: NavController, public storage: Storage) {
    this.ages = [
      { text: '16 - 20', value: 1, activeAge: false },
      { text: '21 - 30', value: 2, activeAge: false },
      { text: '31 - 40', value: 3, activeAge: false },
      { text: '41 - 50', value: 4, activeAge: false },
      { text: '51 - 60', value: 5, activeAge: false },
      { text: '> 61', value: 6, activeAge: false }
    ];
    this.storage.get('userData').then((data) => {
        this.dataInfoUser = JSON.parse(data);
        this.ageSelect = this.dataInfoUser['age'];
    });
  }

  ionViewDidLoad(): void {
    this.getUserAge();
  }

  public getUserAge(): void {
    for(let i = 0; i < Object.keys(this.ages).length; i++) {
      if (this.ageSelect == i) {
        this.ages[i]['activeAge'] = true;
      }
    }
  }

  // Enregistrement de l'age avant sauvegarde totale
  public saveAge(x) {
    this.ageSelect = x;
    this.dataInfoUser['age'] = x;
  }

  public saveUserAge(): void {
    this.storage.set('userData', JSON.stringify(this.dataInfoUser));
    // Check state
    this.storage.get('profilClosed').then((result) => {
      if(result) {
        this.navCtrl.pop();
      } else {
        this.navCtrl.push('HandicapPage');
      }
    });
  }
}
