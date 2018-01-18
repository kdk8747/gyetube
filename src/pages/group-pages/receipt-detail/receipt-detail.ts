import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { UtilService, ReceiptService, AmazonService, SharedDataService } from '../../../providers';
import { ReceiptDetailElement, AmazonSignature } from '../../../models';
import { TranslateService } from '@ngx-translate/core';


@IonicPage({
  segment: 'receipt-detail/:id'
  //defaultHistory: ['ReceiptListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-receipt-detail',
  templateUrl: 'receipt-detail.html',
})
export class ReceiptDetailPage {

  groupId: number;
  id: number;
  receipt: ReceiptDetailElement;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public event: Events,
    public util: UtilService,
    public receiptService: ReceiptService,
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
      this.receiptService.getReceipt(this.groupId, this.id).subscribe((receipt: ReceiptDetailElement) => {
        this.receipt = receipt;
        this.sharedDataService.headerDetailTitle = receipt.title;
      });
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ReceiptListPage');
    else
      this.navCtrl.pop();
  }

  navigateToEditorForUpdate(receipt_id: number) {
    this.navCtrl.push('ReceiptEditorPage', { id: receipt_id });
  }

  deleteButtonHandler(receipt_id: number) {
    this.translate.get(['I18N_DELETE_UPLOAD', 'I18N_OK', 'I18N_CANCEL']).subscribe(values => {
      let confirm = this.alertCtrl.create({
        title: values.I18N_DELETE_UPLOAD,
        buttons: [
          {
            text: values.I18N_OK,
            handler: () => this.requestDelete(receipt_id)
          },
          {
            text: values.I18N_CANCEL,
            handler: () => {}
          }
        ]
      });
      confirm.present();
    });

  }

  requestDelete(receipt_id: number) {
    if (this.receipt.image_url) {
      let dateForSign = this.amazonService.getISO8601Date(new Date(Date.now()));
      let keyPath = (this.receipt.image_url.split('amazonaws.com/')[1]);

      this.amazonService.getAmazonSignatureForReceiptDELETE(this.groupId, dateForSign, keyPath).toPromise()
        .then((amzSign: AmazonSignature) => this.amazonService.deleteFile(dateForSign, amzSign, keyPath).toPromise())
        .then(() => this.receiptService.delete(this.groupId, receipt_id).toPromise())
        .then(() => this.finalizeDelete())
        .catch(() => { console.log('delete receipt failed') });
    }
    else {
      this.receiptService.delete(this.groupId, receipt_id).toPromise()
        .then(() => this.finalizeDelete())
        .catch(() => { console.log('delete receipt failed') });
    }
  }

  finalizeDelete() {
    this.sharedDataService.receipts = this.sharedDataService.receipts.filter(receipt => receipt.receipt_id != this.receipt.receipt_id);
    this.event.publish('ReceiptList_Refresh');

    if (this.receipt.parent_activity && this.receipt.parent_activity.activity_id){
      let i = this.sharedDataService.activities.findIndex(activity => activity.activity_id == this.receipt.parent_activity.activity_id);
      this.sharedDataService.activities[i].total_difference -= this.receipt.difference;

      let j = this.sharedDataService.decisions.findIndex(decision => decision.decision_id == this.sharedDataService.activities[i].parent_decision_id);
      this.sharedDataService.decisions[j].total_difference -= this.receipt.difference;
      this.event.publish('ActivityList_Refresh');
    }

    if (this.receipt.parent_decision && this.receipt.parent_decision.decision_id) {
      let i = this.sharedDataService.decisions.findIndex(decision => decision.decision_id == this.receipt.parent_decision.decision_id);
      this.sharedDataService.decisions[i].total_difference -= this.receipt.difference;
    }
    this.event.publish('DecisionList_Refresh');
    this.popNavigation();
  }

  navigateToActivityDetail(activity_id: number) {
    this.event.publish('TabsGroup_ActivityDetail', { id: activity_id });
  }

  navigateToDecisionDetail(decision_id: number) {
    this.event.publish('TabsGroup_DecisionDetail', { id: decision_id });
  }
}
