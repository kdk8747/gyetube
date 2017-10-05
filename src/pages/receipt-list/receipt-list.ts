import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
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
    public event: Events,
    public util: UtilService,
    public receiptService: ReceiptService) {
  }

  ionViewDidLoad() {
    this.groupId = this.util.getCurrentGroupId();
    this.receipts = this.receiptService.getReceipts(this.groupId)
      .map((receipts: Receipt[]) => this.sortByDateR(receipts))
      .map((receipts: Receipt[]) => this.setBalance(receipts));

    this.event.subscribe('EventReceiptDetailPage', (obj) => {
      let top:ViewController = this.navCtrl.last();
      if (top.id === 'ReceiptDetailPage' && top.data.id !== obj.id)
        this.navCtrl.pop();
      if (top.id !== 'ReceiptDetailPage' || top.data.id !== obj.id)
        this.navCtrl.push('ReceiptDetailPage', { id: obj.id });
    });
  }

  ionViewWillUnload() {
    this.event.unsubscribe('EventReceiptDetailPage');
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

  setBalance(receipts: Receipt[]): Receipt[] {
    if (receipts.length > 0) {
      receipts[receipts.length - 1].balance = receipts[receipts.length - 1].difference;
      for(let i = receipts.length - 1; i > 0; i --){
        receipts[i-1].balance = receipts[i].balance + receipts[i-1].difference;
      }
    }
    return receipts;
  }
}
