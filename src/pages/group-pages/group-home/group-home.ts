import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, GroupService, SharedDataService } from '../../../providers';
import { Group } from '../../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'main'
})
@Component({
  selector: 'page-group-home',
  templateUrl: 'group-home.html',
})
export class GroupHomePage {

  groupId: number;
  group: Observable<Group>;
  readMemberPermitted: boolean;
  readRolePermitted: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilService,
    public event: Events,
    public groupService: GroupService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.util.pageGetReady().then(group_id => {
      this.groupId = group_id;
      this.group = this.groupService.getGroup(group_id);
      this.group.subscribe(group => {
        this.sharedDataService.headerGroupTitle = group.title;
      });

      this.util.isPermitted('READ', 'member', group_id)
        .then(bool => this.readMemberPermitted = bool)
        .catch((error: any) => {
          console.log(error);
        });

      this.util.isPermitted('READ', 'role', group_id)
        .then(bool => this.readRolePermitted = bool)
        .catch((error: any) => {
          console.log(error);
        });
    });
  }

  ionViewWillEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToMemberList() {
    this.navCtrl.push('MemberListPage');
  }

  navigateToRoleList() {
    this.navCtrl.push('RoleListPage');
  }

}
