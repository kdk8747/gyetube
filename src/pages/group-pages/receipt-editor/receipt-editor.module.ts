import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ReceiptEditorPage } from './receipt-editor';
import { AmazonService } from '../../../providers';

@NgModule({
  declarations: [
    ReceiptEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiptEditorPage),
    TranslateModule.forChild()
  ],
  providers: [
    AmazonService
  ]
})
export class ReceiptEditorPageModule {}
