import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ReceiptDetailPage } from './receipt-detail';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ReceiptDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiptDetailPage),
    TranslateModule.forChild(),
    PipesModule,
    ComponentsModule
  ],
})
export class ReceiptDetailPageModule {}
