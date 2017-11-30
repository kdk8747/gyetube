import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, ReceiptService, SharedDataService } from '../../../providers';
import { Receipt } from '../../../models';
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
  receipts: Observable<Receipt[]>;
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
      this.util.isPermitted('create', 'receipts', this.groupId)
        .then(bool => this.creationPermitted = bool)
        .catch((error: any) => {
          console.log(error);
        });;
      this.receipts = this.receiptService.getReceipts(this.groupId)
        .map((receipts: Receipt[]) => this.sortByDateR(receipts))
        .map((receipts: Receipt[]) => this.setBalance(receipts));
    });
  }

  ionViewWillEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToDetail(receiptId: number) {
    this.navCtrl.push('ReceiptDetailPage', { id: receiptId });
  }

  navigateToEditor() {
    this.navCtrl.push('ReceiptEditorPage');
  }

  sortByDateR(receipts: Receipt[]): Receipt[] {
    return receipts.sort((h1, h2) => {
      return h1.settlementDate < h2.settlementDate ? 1 :
        (h1.settlementDate > h2.settlementDate ? -1 : 0);
    });
  }

  setBalance(receipts: Receipt[]): Receipt[] {
    if (receipts.length > 0) {
      receipts[receipts.length - 1].balance = receipts[receipts.length - 1].difference;
      for (let i = receipts.length - 1; i > 0; i--) {
        receipts[i - 1].balance = receipts[i].balance + receipts[i - 1].difference;
      }
    }
    return receipts;
  }
}
