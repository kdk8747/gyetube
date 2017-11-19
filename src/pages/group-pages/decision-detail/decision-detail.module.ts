import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DecisionDetailPage } from './decision-detail';
import { PipesModule } from '../../../pipes/pipes.module';
import { StateLabelComponentModule } from '../../../components/state-label/state-label.module';

@NgModule({
  declarations: [
    DecisionDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DecisionDetailPage),
    TranslateModule.forChild(),
    PipesModule,
    StateLabelComponentModule
  ],
})
export class DecisionDetailPageModule {}
