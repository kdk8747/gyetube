import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityListPage } from './activity-list';
import { ActivityService } from '../../../providers';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ActivityListPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityListPage),
    TranslateModule.forChild(),
    PipesModule
  ],
  providers: [
    ActivityService
  ]
})
export class ActivityListPageModule {}
