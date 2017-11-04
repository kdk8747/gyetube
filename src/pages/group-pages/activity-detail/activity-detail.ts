import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, UserService, ActivityService, DecisionService, ReceiptService } from '../../../providers';
import { Activity, User, Decision, Receipt } from '../../../models';
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

  groupId: string;
  id: number;
  responseTimeMs: number = 500;
  activity: Observable<Activity>;
  creator: Observable<User>;
  participants: Observable<User>[] = [];
  decision: Observable<Decision>;
  receipts: Observable<Receipt>[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public userService: UserService,
    public activityService: ActivityService,
    public decisionService: DecisionService,
    public receiptService: ReceiptService) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.groupId = this.util.getCurrentGroupId();

    this.activity = this.activityService.getActivity(this.groupId, this.id);
    this.activity.subscribe((activity: Activity) => {
      this.creator = this.userService.getUser(activity.creator);
      this.creator.subscribe(() => this.responseTimeMs = this.userService.getResponseTimeMs());
      this.participants = activity.participants.map((id: string) => this.userService.getUser(id));
      this.decision = this.decisionService.getDecision(this.groupId, activity.parentDecision);
      this.receipts = activity.childReceipts.map((id: number) => this.receiptService.getReceipt(this.groupId, id));
    });
  }

  popNavigation() {
    this.navCtrl.setRoot('ActivityListPage');
  }

  navigateToUserDetail() {
    ;
  }

  navigateToDecisionDetail(obs: Observable<Decision>) {
    obs.subscribe(decision => {
      this.navCtrl.parent.select(2);
      setTimeout(() => this.event.publish('EventDecisionDetailPage', { id: decision.id }), this.responseTimeMs); // delay : work-around
    });
  }

  navigateToReceiptDetail(obs: Observable<Receipt>) {
    obs.subscribe(receipt => {
      this.navCtrl.parent.select(4);
      setTimeout(() => this.event.publish('EventReceiptDetailPage', { id: receipt.id }), this.responseTimeMs); // delay : work-around
    });
  }

}
