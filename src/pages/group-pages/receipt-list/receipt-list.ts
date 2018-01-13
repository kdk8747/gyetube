import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, ReceiptService, SharedDataService } from '../../../providers';
import { ReceiptListElement } from '../../../models';

@IonicPage({
  segment: 'receipt-list'
})
@Component({
  selector: 'page-receipt-list',
  templateUrl: 'receipt-list.html',
})
export class ReceiptListPage {

  receipts: ReceiptListElement[] = [];

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
    this.refreshReceipts();

    this.event.subscribe('ReceiptList_Refresh', () => {
      this.refreshReceipts();
    });
  }

  ionViewWillUnload() {
    this.event.unsubscribe('ReceiptList_Refresh');
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

  refreshReceipts() {
    this.receipts = this.setBalance(this.sortByDateR(this.sharedDataService.receipts));
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
