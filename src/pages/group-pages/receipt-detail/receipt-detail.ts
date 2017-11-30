import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, MemberService, ReceiptService, ActivityService, DecisionService, SharedDataService } from '../../../providers';
import { Receipt, Member, Activity, Decision } from '../../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'receipt-detail/:id'
  //defaultHistory: ['ReceiptListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-receipt-detail',
  templateUrl: 'receipt-detail.html',
})
export class ReceiptDetailPage {

  groupId: number;
  id: number;
  imageUrl: string = '';
  receipt: Observable<Receipt>;
  creator: Observable<Member>;
  activity: Observable<Activity> = null;
  decision: Observable<Decision> = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public receiptService: ReceiptService,
    public activityService: ActivityService,
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
      this.receipt = this.receiptService.getReceipt(this.groupId, this.id);
      this.receipt.subscribe((receipt: Receipt) => {
        this.sharedDataService.headerDetailTitle = receipt.title;
        this.imageUrl = receipt.imageUrl;
        this.creator = this.memberService.getMember(this.groupId, receipt.creator);
        if (receipt.parentActivity)
          this.activity = this.activityService.getActivity(this.groupId, receipt.parentActivity);
        if (receipt.parentDecision)
          this.decision = this.decisionService.getDecision(this.groupId, receipt.parentDecision);
      });
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ReceiptListPage');
    else
      this.navCtrl.pop();
  }

  navigateToActivityDetail(obs: Observable<Activity>) {
    obs.subscribe(activity => {
      this.event.publish('TabsGroup_ActivityDetail', { id: activity.id });
    });
  }

  navigateToDecisionDetail(obs: Observable<Decision>) {
    obs.subscribe(decision => {
      this.event.publish('TabsGroup_DecisionDetail', { id: decision.id });
    });
  }
}
