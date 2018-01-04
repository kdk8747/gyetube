import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { GroupEditorPage } from './group-editor';
import { AmazonService } from '../../providers';

@NgModule({
  declarations: [
    GroupEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupEditorPage),
    TranslateModule.forChild()
  ],
  providers: [
    AmazonService
  ]
})
export class GroupEditorPageModule {}
