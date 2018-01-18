import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { UtilService, ActivityService, AmazonService, SharedDataService } from '../../../providers';
import { ActivityDetailElement, AmazonSignature } from '../../../models';

import 'rxjs/add/operator/toPromise';


@IonicPage({
  segment: 'activity-detail/:id'
  //defaultHistory: ['ActivityListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-activity-detail',
  templateUrl: 'activity-detail.html',
})
export class ActivityDetailPage {

  groupId: number;
  id: number;
  activity: ActivityDetailElement;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public event: Events,
    public util: UtilService,
    public activityService: ActivityService,
    public amazonService: AmazonService,
    public sharedDataService: SharedDataService,
    public translate: TranslateService
  ) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
  }

  ionViewWillEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.activityService.getActivity(group_id, this.id).subscribe((activity: ActivityDetailElement) => {
        this.activity = activity;
        this.sharedDataService.headerDetailTitle = activity.title;
      });
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ActivityListPage');
    else
      this.navCtrl.pop();
  }

  navigateToEditorForUpdate() {
    this.navCtrl.push('ActivityEditorPage', { id: this.activity.activity_id });
  }

  deleteButtonHandler() {
    this.translate.get(['I18N_RELATED_RECEIPT_EXIST', 'I18N_DELETE_UPLOAD', 'I18N_OK', 'I18N_CANCEL']).subscribe(values => {
      if (this.activity.child_receipts.length > 0) {
        let confirm = this.alertCtrl.create({
          title: values.I18N_RELATED_RECEIPT_EXIST,
          buttons: [
            {
              text: values.I18N_OK,
              handler: () => {}
            }
          ]
        });
        confirm.present();
      }
      else {
        let confirm = this.alertCtrl.create({
          title: values.I18N_DELETE_UPLOAD,
          buttons: [
            {
              text: values.I18N_OK,
              handler: () => this.requestDelete()
            },
            {
              text: values.I18N_CANCEL,
              handler: () => { }
            }
          ]
        });
        confirm.present();
      }
    });
  }

  requestDelete() {
    if (this.activity.image_urls.length > 0) {
      let dateForSign = this.amazonService.getISO8601Date(new Date(Date.now()));

      this.amazonService.getAmazonSignatureForActivityDELETE(this.groupId, dateForSign, this.activity.image_urls).toPromise()
        .then((amzSign: AmazonSignature) => this.amazonService.deleteMultipleFile(dateForSign, amzSign).toPromise())
        .then((xml) => {
          let regexp = /<Deleted>/;
          if (!regexp.test(xml))
            return Promise.reject(xml);
          else
            return this.activityService.delete(this.groupId, this.activity.activity_id).toPromise()
        })
        .then(() => this.finalizeDelete())
        .catch((err) => { console.log('delete activity failed:\n' + err) });
    }
    else {
      this.activityService.delete(this.groupId, this.activity.activity_id).toPromise()
        .then(() => this.finalizeDelete())
        .catch(() => { console.log('delete activity failed') });
    }
  }

  finalizeDelete() {
    this.sharedDataService.activities = this.sharedDataService.activities.filter(activity => activity.activity_id != this.activity.activity_id);
    this.event.publish('ActivityList_Refresh');

    if (this.activity.parent_decision && this.activity.parent_decision.decision_id) {
      let i = this.sharedDataService.decisions.findIndex(decision => decision.decision_id == this.activity.parent_decision.decision_id);
      this.sharedDataService.decisions[i].total_elapsed_time -= this.activity.elapsed_time * this.activity.participants.length;
    }
    this.event.publish('DecisionList_Refresh');
    this.popNavigation();
  }

  navigateToDecisionDetail(decision_id: number) {
    this.event.publish('TabsGroup_DecisionDetail', { id: decision_id });
  }

  navigateToReceiptDetail(receipt_id: number) {
    this.event.publish('TabsGroup_ReceiptDetail', { id: receipt_id });
  }
}
