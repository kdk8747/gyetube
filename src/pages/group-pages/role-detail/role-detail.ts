import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, MemberService, RoleService, SharedDataService } from '../../../providers';
import { RoleDetailElement } from '../../../models';
import { TranslateService } from '@ngx-translate/core';


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
  role: RoleDetailElement;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public roleService: RoleService,
    public sharedDataService: SharedDataService,
    public translate: TranslateService
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
      this.roleService.getRole(this.groupId, this.id).subscribe((role: RoleDetailElement) => {
        this.role = role;

        if (role.document_state == 'PREDEFINED')
          this.translate.get('I18N_' + role.name).subscribe(value => {
            this.sharedDataService.headerDetailTitle = value;
          });
        else
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
