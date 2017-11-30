import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, MemberService, DecisionService, ProceedingService, ActivityService, ReceiptService, SharedDataService } from '../../../providers';
import { Decision, Member, Proceeding, Activity, Receipt } from '../../../models';
import { Observable } from 'rxjs/Observable';


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
  decision: Decision;
  abstainers: Observable<Member>[] = [];
  accepters: Observable<Member>[] = [];
  rejecters: Observable<Member>[] = [];
  proceeding: Observable<Proceeding> = null;
  activities: Observable<Activity>[];
  receipts: Observable<Receipt>[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public decisionService: DecisionService,
    public proceedingService: ProceedingService,
    public activityService: ActivityService,
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
      this.decisionService.getDecision(this.groupId, this.id).subscribe((decision: Decision) => {
        this.decision = decision;
        this.sharedDataService.headerDetailTitle = decision.title;
        this.abstainers = decision.abstainers.map((id: number) => this.memberService.getMember(this.groupId, id));
        this.accepters = decision.accepters.map((id: number) => this.memberService.getMember(this.groupId, id));
        this.rejecters = decision.rejecters.map((id: number) => this.memberService.getMember(this.groupId, id));
        if (decision.parentProceeding)
          this.proceeding = this.proceedingService.getProceeding(this.groupId, decision.parentProceeding);
        if (decision.childActivities)
          this.activities = decision.childActivities.map((id: number) => this.activityService.getActivity(this.groupId, id));
        if (decision.childReceipts)
          this.receipts = decision.childReceipts.map((id: number) => this.receiptService.getReceipt(this.groupId, id));
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
    this.navCtrl.setRoot('DecisionDetailPage', { id: this.decision.prevId });
  }

  navigateToNext() {
    this.navCtrl.setRoot('DecisionDetailPage', { id: this.decision.nextId });
  }

  navigateToProceedingDetail(obs: Observable<Proceeding>) {
    obs.subscribe(proceeding => {
      this.event.publish('TabsGroup_ProceedingDetail', { id: proceeding.id });
    });
  }

  navigateToActivityDetail(obs: Observable<Activity>) {
    obs.subscribe(activity => {
      this.event.publish('TabsGroup_ActivityDetail', { id: activity.id });
    });
  }

  navigateToReceiptDetail(obs: Observable<Receipt>) {
    obs.subscribe(receipt => {
      this.event.publish('TabsGroup_ReceiptDetail', { id: receipt.id });
    });
  }
}
