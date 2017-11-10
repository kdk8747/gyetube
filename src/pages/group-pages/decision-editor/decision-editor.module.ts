import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DecisionEditorPage } from './decision-editor';

@NgModule({
  declarations: [
    DecisionEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(DecisionEditorPage),
    TranslateModule.forChild()
  ]
})
export class DecisionEditorPageModule {}
