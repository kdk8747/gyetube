import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { RoleDetailPage } from './role-detail';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    RoleDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RoleDetailPage),
    TranslateModule.forChild(),
    PipesModule,
    ComponentsModule
  ],
})
export class RoleDetailPageModule {}
