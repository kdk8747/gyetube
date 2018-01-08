import { Component, Input } from '@angular/core';
import { MenuController, Nav, Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataService } from '../../providers';


@Component({
  selector: 'grasscube-menu',
  templateUrl: 'menu.html'
})
export class MenuComponent {
  @Input() nav: Nav;

  pages: Array<{ title: string, icon: string, component: string }>;

  constructor(
    public event: Events,
    public menu: MenuController,
    public storage: Storage,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    public sharedDataService: SharedDataService
  ) {

    // set our app's pages
    this.pages = [
      { title: 'I18N_GROUPS', icon: 'cube', component: 'GroupListPage' }/*,
      { title: 'I18N_UNCHECKED', icon: 'checkmark-circle', component: 'UncheckedListPage' },
      { title: 'I18N_NOTIFICATIONS', icon: 'notifications', component: 'NotificationListPage' }*/
    ];
  }

  onMenuItem() {
    this.menu.close();
    this.event.publish('App_ShowHeader');
    this.sharedDataService.headerGroupTitle = null;
    this.sharedDataService.headerDetailTitle = null;
  }

  onMenuItemPush(page: string) {
    this.menu.close();
    this.event.publish('App_ShowHeader');
    if (this.nav.last().id !== page)
      this.nav.push(page);
  }

  signOut() {
    this.menu.close();
    this.event.publish('App_ShowHeader');
    this.storage.clear()
      .then(() => {
        this.translate.get('I18N_SIGN_OUT_TOAST').subscribe(
          (value) => {
            let toast = this.toastCtrl.create({
              duration: 3000,
              message: value
            });
            toast.present();
            this.sharedDataService.loggedInUser = null;
            this.sharedDataService.loggedIn = false;
          });
      });
  }

}
