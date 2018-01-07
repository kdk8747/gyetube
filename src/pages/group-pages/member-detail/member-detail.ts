import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, MemberService, SharedDataService } from '../../../providers';
import { MemberDetailElement, MemberEditorElement } from '../../../models';


@IonicPage({
  segment: 'member-detail/:id'
})
@Component({
  selector: 'page-member-detail',
  templateUrl: 'member-detail.html',
})
export class MemberDetailPage {

  groupId: number;
  id: number;
  member: MemberDetailElement;

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
    this.memberService.update(this.groupId, this.id)
      .subscribe(() => {
        this.memberService.getMember(this.groupId, this.id)
        .subscribe((member: MemberDetailElement) => {
          this.member = member;
          this.sharedDataService.headerDetailTitle = member.name;
        });
        this.event.publish('App_ShowHeader');
        this.event.publish('TabsGroup_ShowTab');
        this.popNavigation();
      });
  }
}
