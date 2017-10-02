import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ReceiptDetailPage } from './receipt-detail';
import { ReceiptService, ActivityService } from '../../providers';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ReceiptDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiptDetailPage),
    TranslateModule.forChild(),
    PipesModule
  ],
  providers: [
    ReceiptService,
    ActivityService
  ]
})
export class ReceiptDetailPageModule {}
