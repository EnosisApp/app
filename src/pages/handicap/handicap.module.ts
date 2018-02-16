import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HandicapPage } from './handicap';

@NgModule({
  declarations: [
    HandicapPage,
  ],
  imports: [
    IonicPageModule.forChild(HandicapPage),
  ],
  exports: [
    HandicapPage
  ]
})
export class HandicapPageModule {}
