import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { RoleListPage } from './role-list';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    RoleListPage,
  ],
  imports: [
    IonicPageModule.forChild(RoleListPage),
    TranslateModule.forChild(),
    PipesModule,
    ComponentsModule
  ],
})
export class RoleListPageModule {}
