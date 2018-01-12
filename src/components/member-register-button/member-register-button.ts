import { Component, Input } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { MemberService, SharedDataService } from '../../providers';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'gyetube-member-register-button',
  templateUrl: 'member-register-button.html'
})
export class MemberRegisterButtonComponent {

  @Input() groupId: number;
  @Input() memberState: string;

  constructor(
    public navCtrl: NavController,
    public memberService: MemberService,
    public sharedDataService: SharedDataService,
    public toastCtrl: ToastController,
    public translate: TranslateService
  ) {
  }

  memberRegister() {
    if (this.sharedDataService.loggedIn) {
      this.memberService.registerMember(this.groupId).subscribe(() => {
        this.memberState = 'JOIN_REQUESTED';
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
