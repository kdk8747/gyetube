import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { UtilService, MemberService, RoleService, SharedDataService } from '../../providers';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'gyetube-member-register-button',
  templateUrl: 'member-register-button.html'
})
export class MemberRegisterButtonComponent {

  groupId: number;
  youAreNotMember: boolean;

  constructor(
    public navCtrl: NavController,
    public util: UtilService,
    public memberService: MemberService,
    public roleService: RoleService,
    public sharedDataService: SharedDataService,
    public toastCtrl: ToastController,
    public translate: TranslateService
  ) {
    this.util.pageGetReady().then(group_id => {
      this.groupId = group_id;
      this.roleService.getRoleMyself(group_id).subscribe((role) => {
        this.youAreNotMember = role.role_id == null;
      });
    });
  }

  navigateToMemberRegister() {
    if (this.sharedDataService.loggedIn) {
      this.memberService.registerMember(this.groupId).subscribe(() => {
        this.youAreNotMember = false;
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
}
