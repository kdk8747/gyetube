import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, FabContainer } from 'ionic-angular';
import { UtilService, RoleService, SharedDataService } from '../../../providers';
import { RoleListElement } from '../../../models';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'role-list'
})
@Component({
  selector: 'page-role-list',
  templateUrl: 'role-list.html',
})
export class RoleListPage {

  groupId: number;
  roles: Observable<RoleListElement[]>;
  readPermitted: boolean = false;
  creationPermitted: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public roleService: RoleService,
    public sharedDataService: SharedDataService,
    public translate: TranslateService
  ) {
  }

  ionViewDidLoad() {
    this.util.pageGetReady().then(group_id => {
      this.groupId = group_id;
      this.refreshMembers();

      this.util.isPermitted('create', 'role', this.groupId)
        .then(bool => this.creationPermitted = bool)
        .catch((error: any) => {
          console.log(error);
        });
    });
  }

  ionViewWillEnter() {
    this.translate.get('I18N_ROLES').subscribe(value => {
      this.sharedDataService.headerDetailTitle = value;
    });
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('GroupHomePage');
    else
      this.navCtrl.pop();
  }

  navigateToDetail(roleId: number) {
    this.navCtrl.push('RoleDetailPage', { id: roleId });
  }

  navigateToEditor() {
    this.navCtrl.push('RoleEditorPage');
  }

  refreshMembers() {
    this.roles = this.roleService.getRoles(this.groupId);
    this.roles.subscribe(() => this.readPermitted = true);
  }

  onFAB(fab: FabContainer) {
    fab.close();
    this.refreshMembers();
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }
}
