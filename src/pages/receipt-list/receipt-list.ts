import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilService, ReceiptService } from '../../providers';
import { Receipt } from '../../models';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'receipt'
})
@Component({
  selector: 'page-receipt-list',
  templateUrl: 'receipt-list.html',
})
export class ReceiptListPage {

  groupId: string;
  receipts: Observable<Receipt[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilService,
    public receiptService: ReceiptService) {
  }

  ionViewDidLoad() {
    this.groupId = this.util.getCurrentGroupId();
    this.receipts = this.receiptService.getReceipts(this.groupId)
      .map((receipts: Receipt[]) => this.sortByDateR(receipts));
  }

  navigateToDetail(receiptId: number) {
    this.navCtrl.push('ReceiptDetailPage', { id: receiptId });
  }

  sortByDateR(receipts: Receipt[]): Receipt[] {
    return receipts.sort((h1, h2) => {
      return h1.paymentDate < h2.paymentDate ? 1 :
        (h1.paymentDate > h2.paymentDate ? -1 : 0);
    });
  }
}
