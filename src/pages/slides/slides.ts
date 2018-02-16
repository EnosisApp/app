import { Component, ViewChild, trigger, transition, style, state, animate, keyframes } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage({
  name: 'SlidesPage'
})
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
  animations: [
    trigger('bounce', [
      state('*', style({
        transform: 'translateX(0)'
      })),
      transition('* => rightSwipe', animate('700ms ease-out', keyframes([
        style({transform: 'translateX(0)', offset: 0}),
        style({transform: 'translateX(-65px)', offset: .3}),
        style({transform: 'translateX(0)', offset: 1})
      ]))),
      transition('* => leftSwipe', animate('700ms ease-out', keyframes([
        style({transform: 'translateX(0)', offset: 0}),
        style({transform: 'translateX(65px)', offset: .3}),
        style({transform: 'translateX(0)', offset: 1})
      ]))),
    ])
  ]
})
export class SlidesPage {
  @ViewChild(Slides) slides: Slides;
  state: string = 'x';
  slidesNav: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {}


  ionViewDidLoad() {
    this.storage.get('introShown').then((data) => {
      if(data == true) {
        this.slidesNav = true;
      }
    });
  }

  public goToHome(): void {
    this.navCtrl.setRoot('HomePage');
    this.introShown();
  }

  public goToProfil(): void {
    this.navCtrl.push('AgePage');
    this.introShown();
  }

  public introShown(): void {
    // l'intro vient d'être montré pour la 1ère fois
    this.storage.set('introShown', true);
  }

  // Determine if user swipe to left of right
  slideMoved() {
    if (this.slides.getActiveIndex() >= this.slides.getPreviousIndex()) {
      this.state = 'rightSwipe';
    } else {
      this.state = 'leftSwipe';
    }
  }

  nextSlide() {
    this.slides.slideNext();
  }

  animationDone() {
    this.state = 'x';
  }

}
