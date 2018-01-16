import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, FabContainer } from 'ionic-angular';
import { UtilService, RoleService, SharedDataService } from '../../../providers';
import { RoleListElement } from '../../../models';
import { TranslateService } from '@ngx-translate/core';


@IonicPage({
  segment: 'role-list'
})
@Component({
  selector: 'page-role-list',
  templateUrl: 'role-list.html',
})
export class RoleListPage {

  roles: RoleListElement[] = [];

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
    this.refreshRoles();

    this.event.subscribe('RoleList_Refresh', () => {
      this.refreshRoles();
    });
  }

  ionViewWillUnload() {
    this.event.unsubscribe('RoleList_Refresh');
  }

  ionViewWillEnter() {
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

  refreshRoles() {
    this.translate.get('I18N_ROLES').subscribe(value => {
      this.sharedDataService.headerDetailTitle = this.sharedDataService.headerGroupTitle + ' - ' + value;
    });
    if (this.sharedDataService.deletedRoleListMode)
      this.roles = this.sharedDataService.roles.filter(role => (role.document_state == 'DELETED'));
    else
      this.roles = this.sharedDataService.roles.filter(role => (role.document_state == 'ADDED' || role.document_state == 'UPDATED' || role.document_state == 'PREDEFINED'));
  }

  onFAB(fab: FabContainer) {
    fab.close();
    this.refreshRoles();
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }
}
