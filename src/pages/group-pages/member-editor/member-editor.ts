import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, MemberService, SharedDataService } from '../../../providers';
import { MemberDetailElement } from '../../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'member-editor'
})
@Component({
  selector: 'page-member-editor',
  templateUrl: 'member-editor.html',
})
export class MemberEditorPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemberEditorPage');
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('MemberListPage');
    else
      this.navCtrl.pop();
  }
}
