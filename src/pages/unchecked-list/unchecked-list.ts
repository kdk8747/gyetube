import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
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
    public event: Events,
    public util: UtilService
  ) {
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }
}
