import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, ReceiptService, UserService, ActivityService } from '../../providers';
import { Receipt, User, Activity } from '../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'receipt/:id'
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
  receipt: Observable<Receipt>;
  creator: Observable<User>;
  activity: Observable<Activity> = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public userService: UserService,
    public receiptService: ReceiptService,
    public activityService: ActivityService) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.groupId = this.util.getCurrentGroupId();

    let sendDate = (new Date()).getTime();
    this.receipt = this.receiptService.getReceipt(this.groupId, this.id).share();
    this.receipt.subscribe((receipt: Receipt) => {
      let receiveDate = (new Date()).getTime();
      this.responseTimeMs = receiveDate - sendDate;
      this.creator = this.userService.getUser(receipt.creator).share();
      if (receipt.parentActivity)
        this.activity = this.activityService.getActivity(this.groupId, receipt.parentActivity).share();
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
      setTimeout(() => this.event.publish('EventActivityDetailPage', {id: activity.id }), this.responseTimeMs); // delay : work-around
    });
  }
}
