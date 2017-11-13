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
  creationPermitted: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public proceedingService: ProceedingService) {
  }

  ionViewDidLoad() {
    this.groupId = this.util.getCurrentGroupId();
    this.util.isPermitted('create', 'proceedings', this.groupId)
      .then(bool => this.creationPermitted = bool)
      .catch((error: any) => {
        console.log(error);
      });;
    this.proceedings = this.proceedingService.getProceedings(this.groupId)
      .map((proceedings:Proceeding[]) => this.sortByDate(proceedings));
  }

  ionViewDidEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToDetail(proceedingId: number) {
    this.navCtrl.push('ProceedingDetailPage', { id: proceedingId });
  }

  navigateToEditor() {
    this.navCtrl.push('ProceedingEditorPage');
  }

  sortByDate(proceedings:Proceeding[]): Proceeding[] {
    return proceedings.sort((h1, h2) => {
      return h1.meetingDate < h2.meetingDate ? 1 :
        (h1.meetingDate > h2.meetingDate ? -1 : 0);
    });
  }

}
