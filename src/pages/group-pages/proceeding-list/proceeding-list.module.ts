import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProceedingListPage } from './proceeding-list';
import { PipesModule } from '../../../pipes/pipes.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    ProceedingListPage,
  ],
  imports: [
    IonicPageModule.forChild(ProceedingListPage),
    TranslateModule.forChild(),
    PipesModule,
    DirectivesModule
  ],
})
export class ProceedingListPageModule {}
