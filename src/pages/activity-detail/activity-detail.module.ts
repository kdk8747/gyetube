import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityDetailPage } from './activity-detail';
import { ActivityService } from '../../providers';

@NgModule({
  declarations: [
    ActivityDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityDetailPage),
    TranslateModule.forChild()
  ],
  providers: [
    ActivityService
  ]
})
export class ActivityDetailPageModule {}
