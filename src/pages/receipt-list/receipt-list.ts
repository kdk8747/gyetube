import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilService, ReceiptService } from '../../providers';
import { Receipt } from '../../models';

@IonicPage({
  segment: 'receipt'
})
@Component({
  selector: 'page-receipt-list',
  templateUrl: 'receipt-list.html',
})
export class ReceiptListPage {

  groupId: string;
  receipts: Receipt[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilService,
    public receiptService: ReceiptService) {
  }

  ionViewDidLoad() {
    if (!this.util.isNativeApp()) {
      let splits = window.location.href.split('/');
      if (splits.length > 5) {
        console.log(splits[4]);
        this.groupId = splits[4];

        this.receiptService.getReceipts(this.groupId)
          .then(receipts => { this.receipts = receipts; this.sortByDateR(); });
      }
      else {
        console.log('there is no group');
      }
    }
    else {
      this.groupId = this.util.getCurrentGroupId();
      this.receiptService.getReceipts(this.groupId)
        .then(receipts => { this.receipts = receipts; this.sortByDateR(); });
    }
  }

  sortByDateR(): void {
    this.receipts = this.receipts.sort((h1, h2) => {
      return h1.paymentDate < h2.paymentDate ? 1 :
        (h1.paymentDate > h2.paymentDate ? -1 : 0);
    });
  }
}
