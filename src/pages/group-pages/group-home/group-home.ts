import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { SharedDataService } from '../../../providers';


@IonicPage({
  segment: 'main'
})
@Component({
  selector: 'page-group-home',
  templateUrl: 'group-home.html',
})
export class GroupHomePage {

  constructor(
    public navCtrl: NavController,
    public event: Events,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
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
