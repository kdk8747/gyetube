import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ReceiptListPage } from './receipt-list';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ReceiptListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiptListPage),
    TranslateModule.forChild(),
    PipesModule,
    ComponentsModule
  ],
})
export class ReceiptListPageModule {}
