import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage({
  segment: 'unchecked-list'
})
@Component({
  selector: 'page-unchecked-list',
  templateUrl: 'unchecked-list.html'
})
export class UncheckedListPage {

  constructor(
    public navCtrl: NavController
  ) {

  }

  ionViewDidLoad() {
  }
}
