import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, UserService, ReceiptService, ActivityService, DecisionService } from '../../../providers';
import { Receipt, User, Activity, Decision } from '../../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'detail/:id'
  //defaultHistory: ['ReceiptListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-receipt-detail',
  templateUrl: 'receipt-detail.html',
})
export class ReceiptDetailPage {

  groupId: string;
  id: number;
  responseTimeMs: number = 500;
  imageUrl: string = '';
  receipt: Observable<Receipt>;
  creator: Observable<User>;
  activity: Observable<Activity> = null;
  decision: Observable<Decision> = null

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public userService: UserService,
    public receiptService: ReceiptService,
    public activityService: ActivityService,
    public decisionService: DecisionService) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.groupId = this.util.getCurrentGroupId();

    this.receipt = this.receiptService.getReceipt(this.groupId, this.id);
    this.receipt.subscribe((receipt: Receipt) => {
      this.imageUrl = receipt.imageUrl;
      this.creator = this.userService.getUser(receipt.creator);
      this.creator.subscribe(() => this.responseTimeMs = this.userService.getResponseTimeMs());
      if (receipt.parentActivity)
        this.activity = this.activityService.getActivity(this.groupId, receipt.parentActivity);
      if (receipt.parentDecision)
        this.decision = this.decisionService.getDecision(this.groupId, receipt.parentDecision);
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ReceiptListPage');
    else
      this.navCtrl.pop();
  }

  navigateToUserDetail() {
    ;
  }

  navigateToActivityDetail(obs: Observable<Activity>) {
    obs.subscribe(activity => {
      this.navCtrl.parent.select(3);
      setTimeout(() => this.event.publish('EventActivityDetailPage', { id: activity.id }), this.responseTimeMs); // delay : work-around
    });
  }

  navigateToDecisionDetail(obs: Observable<Decision>) {
    obs.subscribe(decision => {
      this.navCtrl.parent.select(2);
      setTimeout(() => this.event.publish('EventDecisionDetailPage', { id: decision.id }), this.responseTimeMs); // delay : work-around
    });
  }
}
