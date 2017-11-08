import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { UtilService, ReceiptService, ActivityService, DecisionService, AmazonService } from '../../../providers';
import { Receipt, Activity, Decision, AmazonSignature } from '../../../models';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'receipt-editor'
})
@Component({
  selector: 'page-receipt-editor',
  templateUrl: 'receipt-editor.html',
})
export class ReceiptEditorPage {

  groupId: string;
  isNative: boolean = false;
  newReceiptImageFile: File = null;
  previewSrc: string = '';
  activities: Observable<Activity[]>;
  decisions: Observable<Decision[]>;
  activitySelected: boolean = true;

  form: FormGroup;
  submitAttempt: boolean = false;
  parentActivity: string = '';
  parentDecision: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public photoLibrary: PhotoLibrary,
    public event: Events,
    public util: UtilService,
    public receiptService: ReceiptService,
    public activityService: ActivityService,
    public decisionService: DecisionService,
    public amazonService: AmazonService
  ) {

    this.form = formBuilder.group({
      title: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      paymentDate: [this.util.toIsoStringWithTimezoneOffset(new Date()), Validators.required],
      difference: ['', Validators.compose([Validators.pattern('[0-9-]*'), Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.groupId = this.util.getCurrentGroupId();
    this.isNative = this.util.isNativeApp();

    this.activities = this.activityService.getActivities(this.groupId);
    this.decisions = this.decisionService.getDecisions(this.groupId);

    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary().subscribe({
        next: library => {
          library.forEach(function (libraryItem) {
            console.log(libraryItem.id);          // ID of the photo
            console.log(libraryItem.photoURL);    // Cross-platform access to photo
            console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
            console.log(libraryItem.fileName);
            console.log(libraryItem.width);
            console.log(libraryItem.height);
            console.log(libraryItem.creationDate);
            console.log(libraryItem.latitude);
            console.log(libraryItem.longitude);
            console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
          });
        },
        error: err => { console.log('could not get photos'); },
        complete: () => { console.log('done getting photos'); }
      });
    }).catch(err => console.log('permissions weren\'t granted'));
    this.event.publish('ShowHeader');
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ReceiptListPage');
    else
      this.navCtrl.pop();
  }

  onChangeReceiptPhoto(event: any) {
    this.newReceiptImageFile = event.target.files[0] as File;

    let preview = document.querySelector('img');
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

    let newReceipt = new Receipt(0, new Date(Date.now()).toISOString(), this.form.value.paymentDate, '',
      this.form.value.title, +this.form.value.difference, 0, '',
      this.activitySelected ? +this.parentActivity : 0,
      this.activitySelected ? 0 : +this.parentDecision);

    if (!this.newReceiptImageFile) {
      this.receiptService.create(this.groupId, newReceipt).toPromise()
        .then(() => this.popNavigation())
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
          newReceipt.imageUrl = result[1];
          return this.receiptService.create(this.groupId, newReceipt).toPromise();
        })
        .then(() => this.popNavigation())
        .catch(() => { console.log('new receipt failed') });
    }
  }
}
