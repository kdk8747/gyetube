import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { UtilService, MemberService, SharedDataService } from '../../../providers';
import { Group } from '../../../models';


@IonicPage({
  segment: 'main'
})
@Component({
  selector: 'page-group-home',
  templateUrl: 'group-home.html',
})
export class GroupHomePage {

  group: Group;
  memberState: string;
  readMemberPermitted: boolean;
  readRolePermitted: boolean;

  constructor(
    public navCtrl: NavController,
    public util: UtilService,
    public event: Events,
    public memberService: MemberService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    try {
      this.util.getCurrentGroup().then(group => {
        this.group = group;
        this.sharedDataService.headerGroupTitle = group.title;

        this.memberService.getMemberMyself(group.group_id).subscribe(member => {
          this.memberState = member.member_state;
          this.readMemberPermitted = member.role.member.some(val => val == 'READ');
          this.readRolePermitted = member.role.role.some(val => val == 'READ');
        });
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  navigateToMemberList() {
    this.navCtrl.push('MemberListPage');
  }

  navigateToRoleList() {
    this.navCtrl.push('RoleListPage');
  }

}
