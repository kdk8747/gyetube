import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { GroupService, UtilService } from '../../../providers';
import { Group, User } from '../../../models';

@IonicPage({
  segment: 'list'
})
@Component({
  selector: 'page-group-list',
  templateUrl: 'group-list.html'
})
export class GroupListPage {

  groups: Group[] = [];
  loggedIn: boolean = false;
  user: User;

  constructor(
    public navCtrl: NavController,
    public event: Events,
    public groupService: GroupService,
    public util: UtilService
  ) {

  }

  ionViewDidLoad() {
    this.util.getCurrentKnownGroups().then((groups:Group[]) => {
      this.groups = groups;
    });

    this.util.getCurrentUser()
      .then((user: User) => {
        this.loggedIn = true;
        this.user = user;
      }).catch((error: any) => {
        console.log(error);
      });
  }

  pushMenu() {
    this.event.publish('EventMenuPage');
  }

  navigateToGroup(group_id: string) {
    this.navCtrl.push('TabsGroupPage', {group_id: group_id });
  }
}
