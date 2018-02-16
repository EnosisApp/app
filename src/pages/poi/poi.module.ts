import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PoiPage } from './poi';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    PoiPage,
  ],
  imports: [
    IonicPageModule.forChild(PoiPage),
    AngularSvgIconModule,
  ],
  exports: [
    PoiPage
  ]
})
export class PoiPageModule {}
