import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { MemberEditorPage } from './member-editor';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    MemberEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberEditorPage),
    TranslateModule.forChild(),
    PipesModule
  ],
})
export class MemberEditorPageModule {}
