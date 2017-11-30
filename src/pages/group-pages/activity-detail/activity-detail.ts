import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, MemberService, ActivityService, DecisionService, ReceiptService, SharedDataService } from '../../../providers';
import { Activity, Member, Decision, Receipt } from '../../../models';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';


@IonicPage({
  segment: 'activity-detail/:id'
  //defaultHistory: ['ActivityListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-activity-detail',
  templateUrl: 'activity-detail.html',
})
export class ActivityDetailPage {

  groupId: number;
  id: number;
  activity: Observable<Activity>;
  creator: Observable<Member>;
  participants: Observable<Member>[] = [];
  decision: Observable<Decision>;
  receipts: Observable<Receipt>[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public activityService: ActivityService,
    public decisionService: DecisionService,
    public receiptService: ReceiptService,
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
      this.activity = this.activityService.getActivity(this.groupId, this.id);
      this.activity.subscribe((activity: Activity) => {
        this.sharedDataService.headerDetailTitle = activity.title;
        this.creator = this.memberService.getMember(this.groupId, activity.creator);
        this.participants = activity.participants.map((id: number) => this.memberService.getMember(this.groupId, id));
        this.decision = this.decisionService.getDecision(this.groupId, activity.parentDecision);
        this.receipts = activity.childReceipts.map((id: number) => this.receiptService.getReceipt(this.groupId, id));
      });
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ActivityListPage');
    else
      this.navCtrl.pop();
  }

  navigateToDecisionDetail(obs: Observable<Decision>) {
    obs.subscribe(decision => {
      this.event.publish('TabsGroup_DecisionDetail', { id: decision.id });
    });
  }

  navigateToReceiptDetail(obs: Observable<Receipt>) {
    obs.subscribe(receipt => {
      this.event.publish('TabsGroup_ReceiptDetail', { id: receipt.id });
    });
  }

}
