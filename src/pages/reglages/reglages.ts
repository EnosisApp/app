import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SlidesPage } from '../slides/slides';
import { CreditsPage } from '../credits/credits';

 @IonicPage({
   name: 'ReglagesPage'
 })
@Component({
  selector: 'page-reglages',
  templateUrl: 'reglages.html',
})
export class ReglagesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReglagesPage');
  }

  helpPage() {
    this.navCtrl.push(SlidesPage);
  }

  creditsPage() {
    this.navCtrl.push(CreditsPage);
  }
}
