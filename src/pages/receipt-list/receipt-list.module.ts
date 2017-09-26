import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ReceiptListPage } from './receipt-list';
import { ReceiptService } from '../../providers';

@NgModule({
  declarations: [
    ReceiptListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiptListPage),
    TranslateModule.forChild()
  ],
  providers: [
    ReceiptService
  ]
})
export class ReceiptListPageModule {}
