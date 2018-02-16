import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReglagesPage } from './reglages';

@NgModule({
  declarations: [
    ReglagesPage,
  ],
  imports: [
    IonicPageModule.forChild(ReglagesPage),
  ],
  exports: [
    ReglagesPage
  ]
})
export class ReglagesPageModule {}
