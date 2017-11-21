import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, UserService, ReceiptService, ActivityService, DecisionService, SharedDataService } from '../../../providers';
import { Receipt, User, Activity, Decision } from '../../../models';
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

  groupId: string;
  id: number;
  imageUrl: string = '';
  receipt: Observable<Receipt>;
  creator: Observable<User>;
  activity: Observable<Activity> = null;
  decision: Observable<Decision> = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public userService: UserService,
    public receiptService: ReceiptService,
    public activityService: ActivityService,
    public decisionService: DecisionService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.groupId = this.util.getCurrentGroupId();
  }

  ionViewDidEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    this.receipt = this.receiptService.getReceipt(this.groupId, this.id);
    this.receipt.subscribe((receipt: Receipt) => {
      this.sharedDataService.headerDetailTitle = receipt.title;
      this.imageUrl = receipt.imageUrl;
      this.creator = this.userService.getUser(receipt.creator);
      if (receipt.parentActivity)
        this.activity = this.activityService.getActivity(this.groupId, receipt.parentActivity);
      if (receipt.parentDecision)
        this.decision = this.decisionService.getDecision(this.groupId, receipt.parentDecision);
    });
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
