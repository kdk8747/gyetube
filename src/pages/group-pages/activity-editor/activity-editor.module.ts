import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityEditorPage } from './activity-editor';
import { AmazonService } from '../../../providers';

@NgModule({
  declarations: [
    ActivityEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityEditorPage),
    TranslateModule.forChild()
  ],
  providers: [
    AmazonService
  ]
})
export class ActivityEditorPageModule {}
