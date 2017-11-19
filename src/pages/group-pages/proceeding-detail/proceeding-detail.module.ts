import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProceedingDetailPage } from './proceeding-detail';
import { PipesModule } from '../../../pipes/pipes.module';
import { StateLabelComponentModule } from '../../../components/state-label/state-label.module';

@NgModule({
  declarations: [
    ProceedingDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ProceedingDetailPage),
    TranslateModule.forChild(),
    PipesModule,
    StateLabelComponentModule
  ],
})
export class ProceedingDetailPageModule {}
