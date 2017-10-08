import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { TabsMyPage } from './tabs-my';

@NgModule({
  declarations: [
    TabsMyPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsMyPage),
    TranslateModule.forChild()
  ],
})
export class TabsMyPageModule {}
