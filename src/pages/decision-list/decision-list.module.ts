import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DecisionListPage } from './decision-list';
import { DecisionService } from '../../providers';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    DecisionListPage,
  ],
  imports: [
    IonicPageModule.forChild(DecisionListPage),
    TranslateModule.forChild(),
    PipesModule
  ],
  providers: [
    DecisionService
  ]
})
export class DecisionListPageModule {}
