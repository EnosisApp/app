import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    AngularSvgIconModule,
  ],
  exports: [
    HomePage,
  ]
})
export class HomeModule {}
