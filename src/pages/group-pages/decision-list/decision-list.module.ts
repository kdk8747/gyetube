import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DecisionListPage } from './decision-list';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    DecisionListPage,
  ],
  imports: [
    IonicPageModule.forChild(DecisionListPage),
    TranslateModule.forChild(),
    PipesModule,
    ComponentsModule,
    DirectivesModule
  ],
})
export class DecisionListPageModule {}
