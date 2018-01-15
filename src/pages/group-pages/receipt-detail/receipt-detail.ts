import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, ReceiptService, SharedDataService } from '../../../providers';
import { ReceiptDetailElement } from '../../../models';


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
  receipt: ReceiptDetailElement;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
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
      this.receiptService.getReceipt(this.groupId, this.id).subscribe((receipt: ReceiptDetailElement) => {
        this.receipt = receipt;
        this.sharedDataService.headerDetailTitle = receipt.title;
      });
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ReceiptListPage');
    else
      this.navCtrl.pop();
  }

  navigateToEditorForUpdate(receipt_id: number) {
    this.navCtrl.push('ReceiptEditorPage', { id: receipt_id });
  }

  navigateToActivityDetail(activity_id: number) {
    this.event.publish('TabsGroup_ActivityDetail', { id: activity_id });
  }

  navigateToDecisionDetail(decision_id: number) {
    this.event.publish('TabsGroup_DecisionDetail', { id: decision_id });
  }
}
