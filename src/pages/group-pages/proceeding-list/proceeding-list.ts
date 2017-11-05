import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { UtilService, ProceedingService } from '../../../providers';
import { Proceeding } from '../../../models';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'proceeding-list'
})
@Component({
  selector: 'page-proceeding-list',
  templateUrl: 'proceeding-list.html',
})
export class ProceedingListPage {

  groupId: string;
  proceedings: Observable<Proceeding[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public proceedingService: ProceedingService) {
  }

  ionViewDidLoad() {
    this.groupId = this.util.getCurrentGroupId();
    this.proceedings = this.proceedingService.getProceedings(this.groupId)
      .map((proceedings:Proceeding[]) => this.sortByDate(proceedings));
    this.event.subscribe('EventProceedingDetailPage', (obj) => {
      let top:ViewController = this.navCtrl.last();
      if (top.id !== 'ProceedingDetailPage' || top.data.id !== obj.id)
        this.navCtrl.push('ProceedingDetailPage', { id: obj.id });
    });
    this.event.publish('ShowHeader');
  }

  ionViewWillUnload() {
    this.event.unsubscribe('EventProceedingDetailPage');
  }

  navigateToDetail(proceedingId: number) {
    this.navCtrl.push('ProceedingDetailPage', { id: proceedingId });
  }

  sortByDate(proceedings:Proceeding[]): Proceeding[] {
    return proceedings.sort((h1, h2) => {
      return h1.meetingDate < h2.meetingDate ? 1 :
        (h1.meetingDate > h2.meetingDate ? -1 : 0);
    });
  }

}
