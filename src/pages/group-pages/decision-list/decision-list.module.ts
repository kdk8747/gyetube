import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DecisionListPage } from './decision-list';
import { PipesModule } from '../../../pipes/pipes.module';
import { StateLabelComponentModule } from '../../../components/state-label/state-label.module';

@NgModule({
  declarations: [
    DecisionListPage,
  ],
  imports: [
    IonicPageModule.forChild(DecisionListPage),
    TranslateModule.forChild(),
    PipesModule,
    StateLabelComponentModule
  ],
})
export class DecisionListPageModule {}
