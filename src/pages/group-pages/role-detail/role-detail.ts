import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, MemberService, RoleService, SharedDataService } from '../../../providers';
import { MemberDetailElement, Role } from '../../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'role-detail/:id'
})
@Component({
  selector: 'page-role-detail',
  templateUrl: 'role-detail.html',
})
export class RoleDetailPage {

  groupId: number;
  id: number;
  role: Role;

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
    this.id = this.navParams.get('id');
  }

  ionViewWillEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.roleService.getRole(this.groupId, this.id)
      .subscribe((role: Role) => {
        this.role = role;
        this.sharedDataService.headerDetailTitle = role.name;
      });
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('RoleListPage');
    else
      this.navCtrl.pop();
  }

  navigateToDecisionDetail(decision_id: string) {
    this.event.publish('TabsGroup_DecisionDetail', { id: decision_id });
  }
}
