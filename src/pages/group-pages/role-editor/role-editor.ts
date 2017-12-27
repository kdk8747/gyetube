import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, RoleService, SharedDataService } from '../../../providers';
import { RoleListElement } from '../../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'role-editor'
})
@Component({
  selector: 'page-role-editor',
  templateUrl: 'role-editor.html',
})
export class RoleEditorPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public roleService: RoleService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoleEditorPage');
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('RoleListPage');
    else
      this.navCtrl.pop();
  }
}
