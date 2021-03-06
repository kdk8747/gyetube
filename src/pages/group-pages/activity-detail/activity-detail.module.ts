import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityDetailPage } from './activity-detail';
import { AmazonService } from '../../../providers';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ActivityDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityDetailPage),
    TranslateModule.forChild(),
    PipesModule,
    ComponentsModule
  ],
  providers: [
    AmazonService
  ]
})
export class ActivityDetailPageModule {}
