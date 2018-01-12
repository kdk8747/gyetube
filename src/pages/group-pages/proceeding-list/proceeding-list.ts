import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { UtilService, MemberService, ProceedingService, SharedDataService } from '../../../providers';
import { ProceedingListElement, User } from '../../../models';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'proceeding-list'
})
@Component({
  selector: 'page-proceeding-list',
  templateUrl: 'proceeding-list.html',
})
export class ProceedingListPage {

  groupId: number;
  memberState: string;
  user: User;
  proceedings: Observable<ProceedingListElement[]>;
  createPermitted: boolean = false;
  readPermitted: boolean = true;

  constructor(
    public navCtrl: NavController,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public proceedingService: ProceedingService,
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
        this.groupId = group.group_id;
        this.sharedDataService.headerGroupTitle = group.title;

        this.memberService.getMemberMyself(group.group_id).subscribe(member => {
          this.memberState = member.member_state;
          this.createPermitted = member.role.proceeding.some(val => val == 'CREATE');
          this.readPermitted = member.role.proceeding.some(val => val == 'READ');
        }, (err) => {
          this.createPermitted = false;
          this.readPermitted = false;
        });
        this.proceedings = this.proceedingService.getProceedings(group.group_id);
      });

      this.util.getCurrentUser()
        .then((user) => this.user = user)
        .catch((err) => console.log(err));
    }
    catch (err) {
      console.log(err);
    }
  }

  navigateToDetail(proceedingId: number) {
    this.navCtrl.push('ProceedingDetailPage', { id: proceedingId });
  }

  navigateToEditor() {
    this.navCtrl.push('ProceedingEditorPage');
  }
}
