import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  receipt: Observable<Receipt>;
  creator: Observable<User>;
  activity: Observable<Activity>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilService,
    public userService: UserService,
    public receiptService: ReceiptService,
    public activityService: ActivityService) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.groupId = this.util.getCurrentGroupId();
    this.receipt = this.receiptService.getReceipt(this.groupId, this.id).share();
    this.receipt.subscribe((receipt: Receipt) => {
      this.creator = this.userService.getUser(receipt.creator);
      this.activity = this.activityService.getActivity(this.groupId, receipt.parentActivity);
    });
  }

  popMenu() {
    this.navCtrl.setRoot('ReceiptListPage'); // work-around
  }

  navigateToUserDetail() {
    ;
  }

  navigateToActivityDetail() {
    ;
  }
}
