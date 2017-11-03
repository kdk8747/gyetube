import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationListPage } from './notification-list';

@NgModule({
  declarations: [
    NotificationListPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationListPage),
    TranslateModule.forChild()
  ],
})
export class NotificationListPageModule {}
