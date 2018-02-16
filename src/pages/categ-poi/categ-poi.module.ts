import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategPoiPage } from './categ-poi';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    CategPoiPage,
  ],
  imports: [
    AngularSvgIconModule,
    IonicPageModule.forChild(CategPoiPage),
  ],
  exports: [
    CategPoiPage
  ]
})
export class CategPoiPageModule {}
