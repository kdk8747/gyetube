import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { MemberListPage } from './member-list';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    MemberListPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberListPage),
    TranslateModule.forChild(),
    PipesModule,
    ComponentsModule
  ],
})
export class MemberListPageModule {}
