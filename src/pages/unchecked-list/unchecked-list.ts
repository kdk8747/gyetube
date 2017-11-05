import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { UtilService } from '../../providers';

@IonicPage({
  segment: 'unchecked-list'
})
@Component({
  selector: 'page-unchecked-list',
  templateUrl: 'unchecked-list.html'
})
export class UncheckedListPage {

  constructor(
    public navCtrl: NavController,
    public util: UtilService
  ) {

  }

  ionViewDidLoad() {
  }
}
