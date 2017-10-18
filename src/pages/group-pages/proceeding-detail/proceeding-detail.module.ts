import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProceedingDetailPage } from './proceeding-detail';
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
})
export class ProceedingDetailPageModule {}
