import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GroupService, UserService, UtilService } from '../../../providers';
import { Group, User } from '../../../models';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'list'
})
@Component({
  selector: 'page-notification-list',
  templateUrl: 'notification-list.html'
})
export class NotificationListPage {

  groups: Observable<Group>[] = [];
  loggedIn: boolean = false;
  user: User;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public event: Events,
    public groupService: GroupService,
    public userService: UserService,
    public util: UtilService
  ) {

  }

  ionViewDidLoad() {
    this.storage.get('currentUserToken').then((token: string) => {
      if (token) {
        let tokens = token.split('.');
        if (tokens.length === 3) {
          let payload = JSON.parse(window.atob(tokens[1]));
          for (let groupId in payload.permissions.groups)
            this.groups.push(this.groupService.getGroup(groupId).share());

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
  }

  pushMenu() {
    this.event.publish('EventMenuPage');
  }
}
