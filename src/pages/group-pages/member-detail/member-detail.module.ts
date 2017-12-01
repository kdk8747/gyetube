import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { MemberDetailPage } from './member-detail';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    MemberDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberDetailPage),
    TranslateModule.forChild(),
    PipesModule,
    ComponentsModule
  ],
})
export class MemberDetailPageModule {}
