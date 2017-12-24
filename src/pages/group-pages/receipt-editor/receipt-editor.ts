import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, ReceiptService, ActivityService, DecisionService, AmazonService, SharedDataService } from '../../../providers';
import { ReceiptEditorElement, ActivityListElement, DecisionListElement, AmazonSignature } from '../../../models';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'receipt-editor'
})
@Component({
  selector: 'page-receipt-editor',
  templateUrl: 'receipt-editor.html',
})
export class ReceiptEditorPage {

  groupId: number;
  isNative: boolean = false;
  newReceiptImageFile: File = null;
  activities: Observable<ActivityListElement[]>;
  decisions: Observable<DecisionListElement[]>;
  activitySelected: boolean = true;

  form: FormGroup;
  submitAttempt: boolean = false;
  parentActivity: string = '';
  parentDecision: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public event: Events,
    public util: UtilService,
    public receiptService: ReceiptService,
    public activityService: ActivityService,
    public decisionService: DecisionService,
    public amazonService: AmazonService,
    public sharedDataService: SharedDataService,
    public translate: TranslateService
  ) {

    this.form = formBuilder.group({
      title: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      settlementDate: [this.util.toIsoStringWithTimezoneOffset(new Date()), Validators.required],
      difference: ['', Validators.compose([Validators.pattern('[0-9-]*'), Validators.required])]
    });

    this.isNative = this.util.isNativeApp();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.translate.get(['I18N_EDITOR', 'I18N_RECEIPT']).subscribe(values => {
      this.sharedDataService.headerDetailTitle = values.I18N_EDITOR + ' - ' + values.I18N_RECEIPT;
    });
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.activities = this.activityService.getActivities(this.groupId);
      this.decisions = this.decisionService.getDecisions(this.groupId);
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ReceiptListPage');
    else
      this.navCtrl.pop();
  }

  onChangeReceiptPhoto(event: any) {
    this.newReceiptImageFile = event.target.files[0] as File;

    let preview = event.srcElement.nextElementSibling.nextElementSibling;
    let file: File = this.newReceiptImageFile;
    let reader = new FileReader();

    reader.onloadend = function () {
      preview.src = reader.result;
    }

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }
  }

  onSave(): void {
    this.submitAttempt = true;

    if (!((this.activitySelected && this.parentActivity) || (!this.activitySelected && this.parentDecision))
      || !this.form.valid) return;
    this.form.value.title = this.form.value.title.trim();

    let newReceipt = new ReceiptEditorElement(0, this.form.value.settlementDate,
      this.form.value.title, +this.form.value.difference, '',
      this.activitySelected ? +this.parentActivity : 0,
      this.activitySelected ? 0 : +this.parentDecision);

    if (!this.newReceiptImageFile) {
      this.receiptService.create(this.groupId, newReceipt).toPromise()
        .then(() => this.navCtrl.setRoot('ReceiptListPage'))
        .catch(() => { console.log('new receipt failed') });
    }
    else {
      let dateForSign = this.amazonService.getISO8601Date(new Date(Date.now()));
      this.amazonService.getAmazonSignatureForReceiptPOST(this.groupId, dateForSign).toPromise()
        .then((amzSign: AmazonSignature) => this.amazonService.postFile(this.newReceiptImageFile, dateForSign, amzSign).toPromise())
        .then((xml: string) => {
          let regexp = /<Location>(.+)<\/Location>/;
          let result = regexp.exec(xml);
          if (result.length < 2) return Promise.reject('Unknown XML format');
          newReceipt.image_url = result[1];
          return this.receiptService.create(this.groupId, newReceipt).toPromise();
        })
        .then(() => this.navCtrl.setRoot('ReceiptListPage'))
        .catch(() => { console.log('new receipt failed') });
    }
  }
}
