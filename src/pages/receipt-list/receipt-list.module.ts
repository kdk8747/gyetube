import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ReceiptListPage } from './receipt-list';

@NgModule({
  declarations: [
    ReceiptListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiptListPage),
    TranslateModule.forChild()
  ],
})
export class ReceiptListPageModule {}
