import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, RoleService, SharedDataService } from '../../../providers';
import { Role } from '../../../models';
import { State } from '../../../app/constants';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'role-list'
})
@Component({
  selector: 'page-role-list',
  templateUrl: 'role-list.html',
})
export class RoleListPage {
  stateEnum = State;

  roles: Observable<Role[]>;

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
    this.util.getCurrentGroupId().then(group_id => {
      this.roles = this.roleService.getRoles(group_id);
    });
  }

  ionViewWillEnter() {
    this.sharedDataService.headerDetailTitle = 'role-list';
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToDetail(roleId: number) {
    this.navCtrl.push('RoleDetailPage', { id: roleId });
  }

}
