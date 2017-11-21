import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ReceiptListPage } from './receipt-list';
import { PipesModule } from '../../../pipes/pipes.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    ReceiptListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiptListPage),
    TranslateModule.forChild(),
    PipesModule,
    DirectivesModule
  ],
})
export class ReceiptListPageModule {}
