import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProceedingDetailPage } from './proceeding-detail';
import { ProceedingService } from '../../providers';

@NgModule({
  declarations: [
    ProceedingDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ProceedingDetailPage),
    TranslateModule.forChild()
  ],
  providers: [
    ProceedingService
  ]
})
export class ProceedingDetailPageModule {}
