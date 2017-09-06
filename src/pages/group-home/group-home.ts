import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  segment: 'fixme'
})
@Component({
  selector: 'page-group-home',
  templateUrl: 'group-home.html',
})
export class GroupHomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupHomePage');
  }

}
