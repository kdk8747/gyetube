import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityListPage } from './activity-list';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ActivityListPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityListPage),
    TranslateModule.forChild(),
    PipesModule,
    ComponentsModule
  ],
})
export class ActivityListPageModule {}
