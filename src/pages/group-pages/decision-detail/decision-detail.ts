import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, DecisionService, SharedDataService } from '../../../providers';
import { DecisionDetailElement } from '../../../models';


@IonicPage({
  segment: 'decision-detail/:id'
  //defaultHistory: ['DecisionListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-decision-detail',
  templateUrl: 'decision-detail.html',
})
export class DecisionDetailPage {

  groupId: number;
  id: number;
  decision: DecisionDetailElement;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public decisionService: DecisionService,
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
      this.decisionService.getDecision(this.groupId, this.id).subscribe((decision: DecisionDetailElement) => {
        this.decision = decision;
        this.sharedDataService.headerDetailTitle = decision.title;
      });
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('DecisionListPage');
    else
      this.navCtrl.pop();
  }

  navigateToPrev() {
    this.navCtrl.setRoot('DecisionDetailPage', { id: this.decision.prev_id });
  }

  navigateToNext() {
    this.navCtrl.setRoot('DecisionDetailPage', { id: this.decision.next_id });
  }

  navigateToProceedingDetail(proceeding_id: string) {
    this.event.publish('TabsGroup_ProceedingDetail', { id: proceeding_id });
  }

  navigateToMemberDetail(member_id: string) {
    this.event.publish('TabsGroup_MemberDetail', { id: member_id });
  }

  navigateToRoleDetail(role_id: string) {
    this.event.publish('TabsGroup_RoleDetail', { id: role_id });
  }

  navigateToActivityDetail(activity_id: string) {
    this.event.publish('TabsGroup_ActivityDetail', { id: activity_id });
  }

  navigateToReceiptDetail(receipt_id: string) {
    this.event.publish('TabsGroup_ReceiptDetail', { id: receipt_id });
  }
}
