import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { UtilService, SharedDataService } from '../../../providers';
import { ProceedingListElement, User } from '../../../models';

@IonicPage({
  segment: 'proceeding-list'
})
@Component({
  selector: 'page-proceeding-list',
  templateUrl: 'proceeding-list.html',
})
export class ProceedingListPage {

  proceedings: ProceedingListElement[] = [];
  user: User;

  constructor(
    public navCtrl: NavController,
    public event: Events,
    public util: UtilService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.refreshProceedings();

    this.event.subscribe('ProceedingList_Refresh', () => {
      this.refreshProceedings();
    });
  }

  ionViewWillUnload() {
    this.event.unsubscribe('ProceedingList_Refresh');
  }

  ionViewWillEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    this.util.getCurrentUser()
      .then((user) => this.user = user)
      .catch((err) => console.log(err));
  }

  navigateToDetail(proceedingId: number) {
    this.navCtrl.push('ProceedingDetailPage', { id: proceedingId });
  }

  navigateToEditor() {
    this.navCtrl.push('ProceedingEditorPage');
  }

  refreshProceedings() {
    this.proceedings = this.sortByDate(this.sharedDataService.proceedings);
  }

  sortByDate(proceedings: ProceedingListElement[]): ProceedingListElement[] {
    return proceedings.sort((h1, h2) => {
      return h1.meeting_datetime < h2.meeting_datetime ? 1 :
        (h1.meeting_datetime > h2.meeting_datetime ? -1 : 0);
    });
  }
}
