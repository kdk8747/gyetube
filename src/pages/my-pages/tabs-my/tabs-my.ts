import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GroupService, UserService, UtilService } from '../../../providers';
import { Group, User } from '../../../models';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'my-page'
})
@Component({
  selector: 'page-tabs-my',
  templateUrl: 'tabs-my.html'
})
export class TabsMyPage {
  tab1Root: string = 'GroupListPage';
  tab2Root: string = 'UncheckedListPage';
  tab3Root: string = 'NotificationListPage';

  loggedIn: boolean = false;
  user: User;
  groups: Observable<Group[]>;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public event: Events,
    public groupService: GroupService,
    public userService: UserService,
    public util: UtilService
  ) {
    this.groups = this.groupService.getGroups();
  }

  navigateToTabsGroupPage(group_id: string) {
    this.util.setCurrentGroupId(group_id);
    this.navCtrl.push('TabsGroupPage', {group_id: group_id });
  }

  ionViewDidEnter() {
    this.util.getCurrentUser()
      .then((user: User) => {
        this.loggedIn = true;
        this.user = user;
        return this.util.convertToDataURLviaCanvas('http://reverse-proxy.grassroots.kr/' + user.imageUrl);
      }).then( base64Img => {
        if (base64Img !== this.user.imageBase64){
          this.user.imageBase64 = base64Img;
          return this.userService.update(this.user).toPromise();
        }
        return Promise.reject('user.imageBase64 has been updated already');
      }).catch((error: any) => {
        console.log(error);
      });
  }

  ionViewDidLoad() {
    this.event.subscribe('EventMenuPage', (obj) => {
      this.navCtrl.push('MenuPage');
    });
  }

  ionViewWillUnload() {
    this.event.unsubscribe('EventMenuPage');
  }

  pushMenu() {
    this.navCtrl.push('MenuPage');
  }
}
