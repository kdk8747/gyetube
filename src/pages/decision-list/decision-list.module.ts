import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DecisionListPage } from './decision-list';
import { DecisionService } from '../../providers';

@NgModule({
  declarations: [
    DecisionListPage,
  ],
  imports: [
    IonicPageModule.forChild(DecisionListPage),
    TranslateModule.forChild()
  ],
  providers: [
    DecisionService
  ]
})
export class DecisionListPageModule {}
