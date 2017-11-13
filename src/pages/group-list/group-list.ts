import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { UtilService, GroupService } from '../../providers';
import { Group } from '../../models';

@IonicPage({
  segment: 'group-list'
})
@Component({
  selector: 'page-group-list',
  templateUrl: 'group-list.html'
})
export class GroupListPage {

  groups: Group[];

  constructor(
    public navCtrl: NavController,
    public event: Events,
    public util: UtilService,
    public groupService: GroupService
  ) {
  }

  ionViewDidLoad() {
    this.groupService.getGroups().subscribe((groups: Group[]) => {
      this.groups = groups;
    });
  }

  ionViewDidEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToGroup(group_id: string) {
    this.util.setCurrentGroupId(group_id);
    this.navCtrl.push('TabsGroupPage', { group_id: group_id });
  }
}
