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

  pushGroup(group_id: string) {
    this.util.setCurrentGroupId(group_id);
    this.navCtrl.push('TabsGroupPage', {group_id: group_id });
  }

  ionViewDidLoad() {
    this.storage.get('currentUserToken').then((token: string) => {
      if (token) {
        let tokens = token.split('.');
        if (tokens.length === 3) {
          let payload = JSON.parse(window.atob(tokens[1]));
          let userId = payload.id;
          this.userService.getUser(userId).subscribe(
            (user: User) => {
              this.loggedIn = true;
              this.user = user;
            },
            (error: any) => {
              this.storage.clear();
              console.log(error);
            });
        }
      }
    });

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

  navigateToGroup(obs:Observable<Group>) {
    obs.subscribe(group => {
      this.navCtrl.push('TabsGroupPage', {group_id: group.id });
    });
  }
}
