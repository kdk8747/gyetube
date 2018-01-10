import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { MemberListPage } from './member-list';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    MemberListPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberListPage),
    TranslateModule.forChild(),
    PipesModule
  ],
})
export class MemberListPageModule {}
