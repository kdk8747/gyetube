import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProceedingDetailPage } from './proceeding-detail';
import { ProceedingService, DecisionService } from '../../../providers';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ProceedingDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ProceedingDetailPage),
    TranslateModule.forChild(),
    PipesModule
  ],
  providers: [
    ProceedingService,
    DecisionService
  ]
})
export class ProceedingDetailPageModule {}
