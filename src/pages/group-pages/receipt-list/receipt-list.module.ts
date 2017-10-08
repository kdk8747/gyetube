import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ReceiptListPage } from './receipt-list';
import { ReceiptService } from '../../../providers';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ReceiptListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiptListPage),
    TranslateModule.forChild(),
    PipesModule
  ],
  providers: [
    ReceiptService
  ]
})
export class ReceiptListPageModule {}
