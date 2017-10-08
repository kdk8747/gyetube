import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage({
  segment: 'group'
})
@Component({
  selector: 'page-group-list',
  templateUrl: 'group-list.html'
})
export class GroupListPage {

  constructor(public navCtrl: NavController) {

  }

}
