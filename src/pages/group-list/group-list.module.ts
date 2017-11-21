import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { GroupListPage } from './group-list';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    GroupListPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupListPage),
    TranslateModule.forChild(),
    DirectivesModule
  ],
})
export class GroupListPageModule {}
