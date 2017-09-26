import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityListPage } from './activity-list';
import { ActivityService } from '../../providers';

@NgModule({
  declarations: [
    ActivityListPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityListPage),
    TranslateModule.forChild()
  ],
  providers: [
    ActivityService
  ]
})
export class ActivityListPageModule {}
