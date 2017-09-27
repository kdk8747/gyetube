import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DecisionDetailPage } from './decision-detail';
import { DecisionService } from '../../providers';

@NgModule({
  declarations: [
    DecisionDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DecisionDetailPage),
    TranslateModule.forChild()
  ],
  providers: [
    DecisionService
  ]
})
export class DecisionDetailPageModule {}
