import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilService, ProceedingService } from '../../providers';
import { Proceeding } from '../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'proceeding/:id'
  //defaultHistory: ['ProceedingListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-proceeding-detail',
  templateUrl: 'proceeding-detail.html',
})
export class ProceedingDetailPage {

  groupId: string;
  id: number;
  proceeding: Observable<Proceeding>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilService,
    public proceedingService: ProceedingService) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.groupId = this.util.getCurrentGroupId();
    this.proceeding = this.proceedingService.getProceeding(this.groupId, this.id).share();
  }

  popMenu() {
    this.navCtrl.setRoot('ProceedingListPage'); // work-around
  }
}
