import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, FabContainer } from 'ionic-angular';
import { UtilService, MemberService, RoleService, SharedDataService } from '../../../providers';
import { RoleListElement } from '../../../models';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'role-list'
})
@Component({
  selector: 'page-role-list',
  templateUrl: 'role-list.html',
})
export class RoleListPage {

  groupId: number;
  memberState: string;
  roles: Observable<RoleListElement[]>;
  readPermitted: boolean = false;
  createPermitted: boolean = false;

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
  }

  ionViewWillEnter() {
    this.translate.get('I18N_ROLES').subscribe(value => {
      this.sharedDataService.headerDetailTitle = this.sharedDataService.headerGroupTitle + ' - ' + value;
    });
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    try {
      this.util.getCurrentGroupId().then(group_id => {
        this.groupId = group_id;
        this.refreshMembers();

        this.memberService.getMemberMyself(group_id).subscribe(member => {
          this.memberState = member.member_state;
          this.createPermitted = member.role.role.some(val => val == 'CREATE');
          this.readPermitted = member.role.role.some(val => val == 'READ');
        }, (err) => {
          this.createPermitted = false;
          this.readPermitted = false;
        });
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('GroupHomePage');
    else
      this.navCtrl.pop();
  }

  navigateToDetail(roleId: number) {
    this.navCtrl.push('RoleDetailPage', { id: roleId });
  }

  navigateToEditor() {
    this.navCtrl.push('RoleEditorPage');
  }

  refreshMembers() {
    this.roles = this.roleService.getRoles(this.groupId);
  }

  onFAB(fab: FabContainer) {
    fab.close();
    this.refreshMembers();
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }
}
