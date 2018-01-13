import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { MemberService, SharedDataService } from '../../providers';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'gyetube-member-register-button',
  templateUrl: 'member-register-button.html'
})
export class MemberRegisterButtonComponent {

  constructor(
    public navCtrl: NavController,
    public memberService: MemberService,
    public sharedDataService: SharedDataService,
    public toastCtrl: ToastController,
    public translate: TranslateService
  ) {
  }

  memberRegister() {
    if (this.sharedDataService.loggedIn && this.sharedDataService.group) {
      this.memberService.registerMember(this.sharedDataService.group.group_id).subscribe(() => {
        this.sharedDataService.myselfState = 'JOIN_REQUESTED';
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

  memberRegisterInfo() {
    ;
  }
}
