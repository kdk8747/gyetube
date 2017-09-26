import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProceedingListPage } from './proceeding-list';
import { ProceedingService } from '../../providers';

@NgModule({
  declarations: [
    ProceedingListPage,
  ],
  imports: [
    IonicPageModule.forChild(ProceedingListPage),
    TranslateModule.forChild()
  ],
  providers: [
    ProceedingService
  ]
})
export class ProceedingListPageModule {}
