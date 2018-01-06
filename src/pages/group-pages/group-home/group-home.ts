import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { UtilService, GroupService, MemberService, RoleService, SharedDataService } from '../../../providers';
import { Group } from '../../../models';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'main'
})
@Component({
  selector: 'page-group-home',
  templateUrl: 'group-home.html',
})
export class GroupHomePage {

  groupId: number;
  group: Observable<Group>;
  needJoinButton: boolean;
  readMemberPermitted: boolean;
  readRolePermitted: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilService,
    public event: Events,
    public groupService: GroupService,
    public memberService: MemberService,
    public roleService: RoleService,
    public sharedDataService: SharedDataService,
    public toastCtrl: ToastController,
    public translate: TranslateService
  ) {
  }

  ionViewDidLoad() {
    this.util.pageGetReady().then(group_id => {
      this.groupId = group_id;
      this.group = this.groupService.getGroup(group_id);
      this.group.subscribe(group => {
        this.sharedDataService.headerGroupTitle = group.title;
      });

      this.roleService.getRoleMyself(this.groupId).subscribe(() => {}, () => {
        this.needJoinButton = true;
      });

      this.util.isPermitted('READ', 'member', group_id)
        .then(bool => this.readMemberPermitted = bool)
        .catch((error: any) => {
          console.log(error);
        });

      this.util.isPermitted('READ', 'role', group_id)
        .then(bool => this.readRolePermitted = bool)
        .catch((error: any) => {
          console.log(error);
        });
    });
  }

  ionViewWillEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToMemberRegister() {
    if (this.sharedDataService.loggedIn) {
      this.memberService.registerMember(this.groupId).subscribe(() => {
        this.needJoinButton = false;
        this.translate.get('I18N_JOIN_TOAST').subscribe(
          (value) => {
            let toast = this.toastCtrl.create({
              duration: 3000,
              message: value
            });
            toast.present();
          });
      });
    } else
      this.navCtrl.push('LoginPage');
  }

  navigateToMemberList() {
    this.navCtrl.push('MemberListPage');
  }

  navigateToRoleList() {
    this.navCtrl.push('RoleListPage');
  }

}
