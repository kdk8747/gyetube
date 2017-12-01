import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, MemberService, GroupService, ActivityService, DecisionService, AmazonService, SharedDataService } from '../../../providers';
import { Member, Activity, Decision, AmazonSignature } from '../../../models';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'activity-editor'
})
@Component({
  selector: 'page-activity-editor',
  templateUrl: 'activity-editor.html',
})
export class ActivityEditorPage {

  groupId: number;
  isNative: boolean = false;
  newActivityImageFile: File = null;
  decisions: Observable<Decision[]>;
  members: Observable<Member[]>;

  form: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public groupService: GroupService,
    public activityService: ActivityService,
    public decisionService: DecisionService,
    public amazonService: AmazonService,
    public sharedDataService: SharedDataService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      title: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      activityDate: [this.util.toIsoStringWithTimezoneOffset(new Date()), Validators.required],
      elapsedTime: ['', Validators.compose([Validators.pattern('[0-9]*'), Validators.required])],
      description: ['', Validators.compose([Validators.maxLength(1024), Validators.required])],
      participants: [[], Validators.compose([Validators.minLength(1), Validators.required])],
      parentDecision: ['', Validators.required],
    });
    this.isNative = this.util.isNativeApp();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.translate.get(['I18N_EDITOR', 'I18N_ACTIVITY']).subscribe(values => {
      this.sharedDataService.headerDetailTitle = values.I18N_EDITOR + ' - ' + values.I18N_ACTIVITY;
    });
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.members = this.memberService.getMembers(this.groupId);
      this.decisions = this.decisionService.getDecisions(this.groupId);
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ActivityListPage');
    else
      this.navCtrl.pop();
  }

  onChangeActivityPhoto(event: any) {
    /*let fileList = event.target.files;
    this.newActivityFiles = [];
    for (let i = 0; i < fileList.length; i++) {
      this.newActivityFiles.push(event.target.files[i] as File);
    }*/

    this.newActivityImageFile = event.target.files[0] as File;

    let preview = event.srcElement.nextElementSibling;
    let file: File = this.newActivityImageFile;
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

    if (!this.form.valid) return;
    this.form.value.title = this.form.value.title.trim();
    this.form.value.description = this.form.value.description.trim();

    let newActivity = new Activity(0, new Date(Date.now()).toISOString(), this.form.value.activityDate, 0,
      this.form.value.participants, this.form.value.elapsedTime, this.form.value.title, this.form.value.description, [], [],
      +this.form.value.parentDecision, [], 0);


    if (!this.newActivityImageFile) {
      this.activityService.create(this.groupId, newActivity).toPromise()
        .then(() => this.navCtrl.setRoot('ActivityListPage'))
        .catch(() => { console.log('new receipt failed') });
    }
    else {
      let dateForSign = this.amazonService.getISO8601Date(new Date(Date.now()));
      this.amazonService.getAmazonSignatureForPhotoPOST(this.groupId, dateForSign).toPromise()
        .then((amzSign: AmazonSignature) => this.amazonService.postFile(this.newActivityImageFile, dateForSign, amzSign).toPromise())
        .then((xml: string) => {
          let regexp = /<Location>(.+)<\/Location>/;
          let result = regexp.exec(xml);
          if (result.length < 2) return Promise.reject('Unknown XML format');
          newActivity.imageUrls.push(result[1]);
          return this.activityService.create(this.groupId, newActivity).toPromise();
        })
        .then(() => this.navCtrl.setRoot('ActivityListPage'))
        .catch(() => { console.log('new receipt failed') });
    }
    /*
  let dateForSign = this.amazonService.getISO8601Date(new Date(Date.now()));
  let amzSignForPhoto: AmazonSignature = null;
  this.amazonService.getAmazonSignatureForPhotoPOST(this.groupId, dateForSign).toPromise()
    .then((amzSign: AmazonSignature) => {
      amzSignForPhoto = amzSign;
      return this.amazonService.getAmazonSignatureForDocumentPOST(this.groupId, dateForSign).toPromise();
    })
    .then((amzSignForDocument: AmazonSignature) => Promise.all(this.newActivityFiles.map(file => {
      let amzSign = file.type.substr(0, 5) == 'image' ? amzSignForPhoto : amzSignForDocument;
      return this.amazonService.postFile(file, dateForSign, amzSign).toPromise()
        .then((xml: string) => {
          let regexp = /<Location>(.+)<\/Location>/;
          let result = regexp.exec(xml);
          if (result.length < 2) return Promise.reject('Unknown XML format');

          if (file.type.substr(0, 5) == 'image')
            newActivity.imageUrls.push(result[1]);
          else
            newActivity.documentUrls.push(result[1]);
          return Promise.resolve();
        })
    })))
    .then(() => this.activityService.create(this.groupId, newActivity).toPromise())
    .then(() => this.popNavigation())
    .catch(() => { console.log('new receipt failed') });*/

  }
}
