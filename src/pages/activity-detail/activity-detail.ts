import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilService, ActivityService, UserService, DecisionService, ReceiptService } from '../../providers';
import { Activity, User, Decision, Receipt } from '../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'activity/:id'
  //defaultHistory: ['ActivityListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-activity-detail',
  templateUrl: 'activity-detail.html',
})
export class ActivityDetailPage {

  groupId: string;
  id: number;
  activity: Observable<Activity>;
  creator: Observable<User>;
  decision: Observable<Decision>;
  receipts: Observable<Receipt>[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilService,
    public activityService: ActivityService,
    public userService: UserService,
    public decisionService: DecisionService,
    public receiptService: ReceiptService) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.groupId = this.util.getCurrentGroupId();
    this.activity = this.activityService.getActivity(this.groupId, this.id).share();
    this.activity.subscribe((activity: Activity) => {
      this.creator = this.userService.getUser(activity.creator);
      this.decision = this.decisionService.getDecision(this.groupId, activity.parentDecision);
      this.receipts = activity.childReceipts.map((id:number) => this.receiptService.getReceipt(this.groupId, id));
    });
  }

  popMenu() {
    this.navCtrl.setRoot('ActivityListPage'); // work-around
  }

  navigateToUserDetail() {
    ;
  }

  navigateToDecisionDetail() {
    ;
  }

  navigateToReceiptDetail() {
    ;
  }

}
