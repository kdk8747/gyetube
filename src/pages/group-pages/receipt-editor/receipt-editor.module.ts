import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ReceiptEditorPage } from './receipt-editor';
import { PhotoLibrary } from '@ionic-native/photo-library';
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
    PhotoLibrary,
    AmazonService
  ]
})
export class ReceiptEditorPageModule {}
