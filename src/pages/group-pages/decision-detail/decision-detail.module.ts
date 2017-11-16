import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DecisionDetailPage } from './decision-detail';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    DecisionDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DecisionDetailPage),
    TranslateModule.forChild(),
    PipesModule,
    ComponentsModule
  ],
})
export class DecisionDetailPageModule {}
