import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilService, ReceiptService } from '../../providers';
import { Receipt } from '../../models';
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

    constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public util: UtilService,
      public receiptService: ReceiptService) {
    }

    ionViewDidLoad() {
      this.id = this.navParams.get('id');
      this.groupId = this.util.getCurrentGroupId();
      this.receipt = this.receiptService.getReceipt(this.groupId, this.id).share();
    }

    popMenu() {
      this.navCtrl.setRoot('ReceiptListPage'); // work-around
    }
}
