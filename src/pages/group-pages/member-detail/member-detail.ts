import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, MemberService, SharedDataService } from '../../../providers';
import { MemberDetailElement, MemberListElement } from '../../../models';
import { Observable } from 'rxjs/Observable';


enum ApproveState {
  STATE_NEW_MEMBER,
  STATE_OVERWRITE,
  STATE_REJECT,
}

@IonicPage({
  segment: 'member-detail/:id'
})
@Component({
  selector: 'page-member-detail',
  templateUrl: 'member-detail.html',
})
export class MemberDetailPage {
  enum = ApproveState;

  approveState: ApproveState = ApproveState.STATE_NEW_MEMBER;
  groupId: number;
  id: number;
  member: MemberDetailElement;

  overwrite_id: number;
  members: Observable<MemberListElement[]>;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
  }

  ionViewWillEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    this.util.pageGetReady().then(group_id => {
      this.groupId = group_id;
      this.memberService.getMember(this.groupId, this.id)
        .subscribe((member: MemberDetailElement) => {
          this.member = member;
          this.sharedDataService.headerDetailTitle = member.name;
        });
      this.members = this.memberService.getMembers(this.groupId).map(members => members.filter(member => member.document_state != 'PENDING_ADDS' && member.next_id == 0));
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('MemberListPage');
    else
      this.navCtrl.pop();
  }

  navigateToPrev() {
    this.navCtrl.setRoot('MemberDetailPage', { id: this.member.prev_id });
  }

  navigateToNext() {
    this.navCtrl.setRoot('MemberDetailPage', { id: this.member.next_id });
  }

  navigateToDecisionDetail(decision_id: string) {
    this.event.publish('TabsGroup_DecisionDetail', { id: decision_id });
  }

  navigateToRoleDetail(role_id: string) {
    this.navCtrl.push('RoleDetailPage', { id: role_id });
  }

  onSubmit() {
    switch (this.approveState) {
      case this.enum.STATE_NEW_MEMBER:
        this.memberService.approveNewMember(this.groupId, this.id)
          .subscribe(() => {
            this.event.publish('App_ShowHeader');
            this.event.publish('TabsGroup_ShowTab');
            this.popNavigation();
          });
        break;
      case this.enum.STATE_OVERWRITE:
        this.submitAttempt = true;
        if (this.overwrite_id)
          this.memberService.approveOverwrite(this.groupId, this.id, this.overwrite_id)
            .subscribe(() => {
              this.event.publish('App_ShowHeader');
              this.event.publish('TabsGroup_ShowTab');
              this.popNavigation();
            });
        break;
      case this.enum.STATE_REJECT:
        this.memberService.reject(this.groupId, this.id)
          .subscribe(() => {
            this.event.publish('App_ShowHeader');
            this.event.publish('TabsGroup_ShowTab');
            this.popNavigation();
          });
        break;
    }
  }
}
