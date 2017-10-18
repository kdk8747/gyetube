import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityDetailPage } from './activity-detail';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ActivityDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityDetailPage),
    TranslateModule.forChild(),
    PipesModule
  ],
})
export class ActivityDetailPageModule {}
