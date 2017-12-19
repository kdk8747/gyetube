import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, ReceiptService, SharedDataService } from '../../../providers';
import { ReceiptListElement } from '../../../models';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'receipt-list'
})
@Component({
  selector: 'page-receipt-list',
  templateUrl: 'receipt-list.html',
})
export class ReceiptListPage {

  groupId: number;
  receipts: Observable<ReceiptListElement[]>;
  creationPermitted: boolean = false;

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
    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      /*this.util.isPermitted('create', 'receipts', this.groupId)
        .then(bool => this.creationPermitted = bool)
        .catch((error: any) => {
          console.log(error);
        });;*/
      this.receipts = this.receiptService.getReceipts(this.groupId)
        .map((receipts: ReceiptListElement[]) => this.sortByDateR(receipts))
        .map((receipts: ReceiptListElement[]) => this.setBalance(receipts));
    });
  }

  ionViewWillEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToDetail(receipt_id: number) {
    this.navCtrl.push('ReceiptDetailPage', { id: receipt_id });
  }

  navigateToEditor() {
    this.navCtrl.push('ReceiptEditorPage');
  }

  sortByDateR(receipts: ReceiptListElement[]): ReceiptListElement[] {
    return receipts.sort((h1, h2) => {
      return h1.settlement_datetime < h2.settlement_datetime ? 1 :
        (h1.settlement_datetime > h2.settlement_datetime ? -1 : 0);
    });
  }

  setBalance(receipts: ReceiptListElement[]): ReceiptListElement[] {
    if (receipts.length > 0) {
      receipts[receipts.length - 1].balance = receipts[receipts.length - 1].difference;
      for (let i = receipts.length - 1; i > 0; i--) {
        receipts[i - 1].balance = receipts[i].balance + receipts[i - 1].difference;
      }
    }
    return receipts;
  }
}
