import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DecisionEditorPage } from './decision-editor';
import { DecisionChangesetService } from '../../../providers';

@NgModule({
  declarations: [
    DecisionEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(DecisionEditorPage),
    TranslateModule.forChild()
  ],
  providers: [
    DecisionChangesetService
  ]
})
export class DecisionEditorPageModule {}
