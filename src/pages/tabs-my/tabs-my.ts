import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService, GroupService, UtilService } from '../../providers';
import { User, Group } from '../../models';

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
  myProfileImg: string = '';

  groups: Group[];

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public userService: UserService,
    public groupService: GroupService,
    public util: UtilService
  ) {
    this.groupService.getGroups().then(groups => this.groups = groups);
  }

  pushGroup(group_id: string) {
    this.util.setCurrentGroupId(group_id);
    this.navCtrl.setRoot('TabsGroupPage', {group_id: group_id });
  }

  ionViewDidLoad() {
    this.storage.get('currentUserToken').then((token: string) => {
      if (token) {
        let tokens = token.split('.');
        if (tokens.length === 3) {
          let payload = JSON.parse(window.atob(tokens[1]));
          let userId = payload.id;
          this.userService.getUser(userId)
            .then((user: User) => {
              this.myProfileImg = user.imageUrl;
              this.loggedIn = true;
            }).catch((err) => {
              this.storage.clear();
              console.log(err);
            });
        }
      }
    });
  }

  pushMenu() {
    this.navCtrl.push('MenuPage');
  }

}
