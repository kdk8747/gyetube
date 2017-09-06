import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  segment: 'receipt'
})
@Component({
  selector: 'page-receipt-list',
  templateUrl: 'receipt-list.html',
})
export class ReceiptListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceiptListPage');
  }

}
