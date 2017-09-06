import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DecisionListPage } from './decision-list';

@NgModule({
  declarations: [
    DecisionListPage,
  ],
  imports: [
    IonicPageModule.forChild(DecisionListPage),
    TranslateModule.forChild()
  ],
})
export class DecisionListPageModule {}
