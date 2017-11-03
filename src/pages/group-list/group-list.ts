import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
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
    public util: UtilService,
    public groupService: GroupService
  ) {
  }

  ionViewDidLoad() {
    this.groupService.getGroups().subscribe((groups: Group[]) => {
      this.groups = groups;
    });
  }

  navigateToGroup(group_id: string) {
    this.util.setCurrentGroupId(group_id);
    this.navCtrl.push('TabsGroupPage', { group_id: group_id });
  }
}
