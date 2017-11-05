import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityEditorPage } from './activity-editor';
import { PhotoLibrary } from '@ionic-native/photo-library';
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
    PhotoLibrary,
    AmazonService
  ]
})
export class ActivityEditorPageModule {}
