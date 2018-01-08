import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { GroupHomePage } from './group-home';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    GroupHomePage,
  ],
  imports: [
    IonicPageModule.forChild(GroupHomePage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class GroupHomePageModule {}
