import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, ProceedingService, SharedDataService } from '../../../providers';
import { ProceedingListElement, User } from '../../../models';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'proceeding-list'
})
@Component({
  selector: 'page-proceeding-list',
  templateUrl: 'proceeding-list.html',
})
export class ProceedingListPage {

  user: User;
  proceedings: Observable<ProceedingListElement[]>;
  creationPermitted: boolean = false;
  readPermitted: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public proceedingService: ProceedingService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.util.pageGetReady().then(group_id => {
      this.util.getCurrentUser()
        .then((user) => this.user = user)
        .catch((err) => console.log(err));

      this.util.isPermitted('CREATE', 'proceeding', group_id)
        .then(bool => this.creationPermitted = bool)
        .catch((error: any) => {
          console.log(error);
        });
      this.proceedings = this.proceedingService.getProceedings(group_id);
      this.proceedings.subscribe(() => this.readPermitted = true);
    });
  }

  ionViewWillEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToDetail(proceedingId: number) {
    this.navCtrl.push('ProceedingDetailPage', { id: proceedingId });
  }

  navigateToEditor() {
    this.navCtrl.push('ProceedingEditorPage');
  }
}
