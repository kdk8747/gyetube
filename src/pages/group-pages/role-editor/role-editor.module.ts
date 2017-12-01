import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEditorPage } from './role-editor';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    RoleEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(RoleEditorPage),
    TranslateModule.forChild(),
    PipesModule
  ],
})
export class RoleEditorPageModule {}
