import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, MemberService, RoleService, SharedDataService } from '../../../providers';
import { MemberListElement } from '../../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment:'member-list'
})
@Component({
  selector: 'page-member-list',
  templateUrl: 'member-list.html',
})
export class MemberListPage {

  members: Observable<MemberListElement[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public roleService: RoleService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.util.getCurrentGroupId().then(group_id => {
      this.members = this.memberService.getMembers(group_id);
    });
  }

  ionViewWillEnter() {
    this.sharedDataService.headerDetailTitle = 'member-list';
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToDetail(member_id: number) {
    this.navCtrl.push('MemberDetailPage', { id: member_id });
  }
}
