import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { UncheckedListPage } from './unchecked-list';

@NgModule({
  declarations: [
    UncheckedListPage,
  ],
  imports: [
    IonicPageModule.forChild(UncheckedListPage),
    TranslateModule.forChild()
  ],
})
export class UncheckedListPageModule {}
