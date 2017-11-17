import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, GroupService, SharedDataService } from '../../../providers';
import { Group } from '../../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'fixme'
})
@Component({
  selector: 'page-group-home',
  templateUrl: 'group-home.html',
})
export class GroupHomePage {

  groupId: string = '';
  id: number;
  group: Observable<Group>;

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
    this.groupId = this.util.getCurrentGroupId();
    this.group = this.groupService.getGroup(this.groupId);
  }

  ionViewDidEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

}
