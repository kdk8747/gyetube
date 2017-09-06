import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { TabsGroupPage } from './tabs-group';

@NgModule({
  declarations: [
    TabsGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsGroupPage),
    TranslateModule.forChild()
  ],
})
export class TabsGroupPageModule {}
