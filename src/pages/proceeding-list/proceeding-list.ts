import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilService, ProceedingService } from '../../providers';
import { Proceeding } from '../../models';

@IonicPage({
  segment: 'proceeding'
})
@Component({
  selector: 'page-proceeding-list',
  templateUrl: 'proceeding-list.html',
})
export class ProceedingListPage {

  groupId: string;
  proceedings: Proceeding[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilService,
    public proceedingService: ProceedingService) {
  }

  ionViewDidLoad() {
    if (!this.util.isNativeApp()) {
      let splits = window.location.href.split('/');
      if (splits.length > 5) {
        console.log(splits[4]);
        this.groupId = splits[4];

        this.proceedingService.getProceedings(this.groupId)
          .then(proceedings => { this.proceedings = proceedings; this.sortByDate(); });
      }
      else {
        console.log('there is no group');
      }
    }
    else {
      this.groupId = this.util.getCurrentGroupId();
      this.proceedingService.getProceedings(this.groupId)
        .then(proceedings => { this.proceedings = proceedings; this.sortByDate(); });
    }
  }

  sortByDate(): void {
    this.proceedings = this.proceedings.sort((h1, h2) => {
      return h1.meetingDate < h2.meetingDate ? 1 :
        (h1.meetingDate > h2.meetingDate ? -1 : 0);
    });
  }

}
