import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProceedingEditorPage } from './proceeding-editor';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ProceedingEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(ProceedingEditorPage),
    TranslateModule.forChild(),
    PipesModule
  ]
})
export class ProceedingEditorPageModule {}
