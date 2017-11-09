import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProceedingEditorPage } from './proceeding-editor';
import { DecisionChangesetService } from '../../../providers';

@NgModule({
  declarations: [
    ProceedingEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(ProceedingEditorPage),
    TranslateModule.forChild()
  ],
  providers: [
    DecisionChangesetService
  ]
})
export class ProceedingEditorPageModule {}
