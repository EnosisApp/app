import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

@IonicPage({
  name: 'PoiPage'
})
@Component({
  selector: 'page-poi',
  templateUrl: 'poi.html',
})
export class PoiPage {
  categPoi: any;
  categPoiTxt: any;
  categIntroTxt: any;
  active: boolean = false;
  pois: any
  index: number = 0;
  activeItem: boolean = false;
  userData: Array<{title: string, icon: any, activePoi: any}> = [];
  dataPois: any;
  lengthData: number;
  toSave: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private _sanitizer: DomSanitizer, public http: Http, public storage: Storage) {
    this.http = http;
    // On récupère la paramètre de la catégorie sélectionnée
    this.categPoi = navParams.get('category');
    this.categIntroTxt = navParams.get('categIntroTxt');
    this.categPoiTxt = navParams.get('categoryTxt');
    this.pois = [];
  }

    ionViewDidLoad() {
      this.http.get('./assets/data.json').subscribe(data => {
          this.pois = data.json();
          this.pois = this.pois[this.categPoi];

          this.storage.get('userData').then((data) => {
            this.dataPois = JSON.parse(data);
            // Initialisation des POI actifs
            for(var i in this.pois) {
              var number = Object.keys(this.dataPois[this.categPoi]).length;
              for (let y = 0; y < number; y++) {
                if(Object.keys(this.pois)[this.index] == this.dataPois[this.categPoi][y]) {
                  this.active = true;
                  break;
                } else {
                  this.active = false;
                }
              }
              if(this.categPoi == 'lang') {
                this.userData.push({
                    title: this.pois[i]['text'],
                    icon: this.pois[i]['abrev'],
                    activePoi: this.active
                });
              } else {
                this.userData.push({
                    title: this.pois[i]['text'],
                    icon: Object.keys(this.pois)[this.index],
                    activePoi: this.active
                });
              }
              this.index = this.index + 1;
            }
          });
        });
    }

    ionViewWillLeave() {
      this.storage.set('userData', JSON.stringify(this.dataPois));
    }

    actionPoi(poiAction: string, x: number, $event) {
      $event.stopPropagation();
      var test = Object.keys(this.dataPois[this.categPoi]).length;
      for (let i = 0; i < test; i++) {
        if(this.dataPois[this.categPoi][i] == poiAction) {
          return this.remove(poiAction, x);
        }
      }
      return this.add(poiAction, x);
    }

    remove(poiAction, x) {
      this.dataPois[this.categPoi].splice( this.dataPois[this.categPoi].indexOf(poiAction), 1);
      this.userData[x]['activePoi'] = false;
    }

    add(poiAction, x) {
      this.dataPois[this.categPoi].push(poiAction);
      this.userData[x]['activePoi'] = true;
    }

    save() {
      this.storage.set('userData', JSON.stringify(this.dataPois));
      this.navCtrl.pop();
    }

    getImg(imgName: string) {
      return this._sanitizer.bypassSecurityTrustResourceUrl('./assets/img/logo_'+imgName+'.svg');
    }

}
