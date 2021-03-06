import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { UtilService, GroupService, SharedDataService } from '../../providers';
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
    public groupService: GroupService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.groupService.getGroups().subscribe((groups: Group[]) => {
      this.groups = groups;
    });
  }

  ionViewWillEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToGroup(group: Group) {
    this.util.setCurrentGroup(group);
    this.navCtrl.push('TabsGroupPage', { group_url_segment: group.url_segment });
  }

  navigateToEditor() {
    this.navCtrl.push('GroupEditorPage');
  }
}
