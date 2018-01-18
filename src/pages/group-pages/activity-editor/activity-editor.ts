import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, ActivityService, AmazonService, SharedDataService } from '../../../providers';
import { MemberListElement, ActivityEditorElement, DecisionListElement, AmazonSignature } from '../../../models';
import { TranslateService } from '@ngx-translate/core';


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
  //newActivityImageFile: File = null;
  newActivityImageFiles: File[] = [];

  decisions: DecisionListElement[] = [];
  members: MemberListElement[] = [];

  form: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public event: Events,
    public util: UtilService,
    public activityService: ActivityService,
    public amazonService: AmazonService,
    public sharedDataService: SharedDataService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      title: ['', Validators.compose([Validators.maxLength(32), Validators.required])],
      activityDate: [this.util.toIsoStringWithTimezoneOffset(new Date()), Validators.required],
      elapsedTime: ['', Validators.compose([Validators.pattern('[0-9]*'), Validators.required])],
      description: ['', Validators.compose([Validators.maxLength(1024), Validators.required])],
      participants: [[], Validators.compose([Validators.minLength(1), Validators.required])],
      parentDecision: ['', Validators.required],
    });
    this.isNative = this.util.isNativeApp();
  }

  ionViewDidLoad() {
    this.event.subscribe('MemberList_Refresh', () => {
      this.members = this.sharedDataService.members.filter(member =>
        (member.member_state == 'ADDED' || member.member_state == 'UPDATED' || member.member_state == 'JOIN_APPROVED'));
    });
    this.event.subscribe('DecisionList_Refresh', () => {
      this.decisions = this.sharedDataService.decisions.filter(decision =>
        (decision.document_state == 'ADDED' || decision.document_state == 'UPDATED' || decision.document_state == 'PREDEFINED' ) && decision.next_id == 0);
    });
  }

  ionViewWillUnload() {
    this.event.unsubscribe('MemberList_Refresh');
    this.event.unsubscribe('DecisionList_Refresh');
  }

  ionViewWillEnter() {
    this.translate.get(['I18N_EDITOR', 'I18N_ACTIVITY']).subscribe(values => {
      this.sharedDataService.headerDetailTitle = values.I18N_ACTIVITY + ' - ' + values.I18N_EDITOR;
    });
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.members = this.sharedDataService.members.filter(member =>
        (member.member_state == 'ADDED' || member.member_state == 'UPDATED' || member.member_state == 'JOIN_APPROVED'));
      this.decisions = this.sharedDataService.decisions.filter(decision =>
        (decision.document_state == 'ADDED' || decision.document_state == 'UPDATED' || decision.document_state == 'PREDEFINED') && decision.next_id == 0);
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ActivityListPage');
    else
      this.navCtrl.pop();
  }

  onChangeActivityPhoto(event: any) {
    let fileList = event.target.files;
    this.newActivityImageFiles = [];
    for (let i = 0; i < fileList.length; i++) {
      this.newActivityImageFiles.push(event.target.files[i] as File);
    }

    /*this.newActivityImageFile = event.target.files[0] as File;

    let preview = event.srcElement.nextElementSibling.nextElementSibling;
    let file: File = this.newActivityImageFile;
    let reader = new FileReader();

    reader.onloadend = function () {
      preview.src = reader.result;
    }

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }*/
  }

  onSave(): void {
    this.submitAttempt = true;

    if (!this.form.valid) return;
    this.form.value.title = this.form.value.title.trim();
    this.form.value.description = this.form.value.description.trim();

    let newActivity = new ActivityEditorElement(0, this.form.value.activityDate,
       this.form.value.elapsedTime, this.form.value.title, this.form.value.description, [], [],
       this.form.value.participants, +this.form.value.parentDecision);


    if (this.newActivityImageFiles.length == 0) {
      this.activityService.create(this.groupId, newActivity).toPromise()
        .then(() => this.navCtrl.setRoot('ActivityListPage'))
        .catch(() => { console.log('new activity failed') });
    }
    else {
      let dateForSign = this.amazonService.getISO8601Date(new Date(Date.now()));
      this.amazonService.getAmazonSignatureForActivityPOST(this.groupId, dateForSign).toPromise()
        .then((amzSign: AmazonSignature) => Promise.all(this.newActivityImageFiles.map(file =>
          this.amazonService.postImageFile(file, dateForSign, amzSign).toPromise()
            .then((xml: string) => {
              let regexp = /<Location>(.+)<\/Location>/;
              let result = regexp.exec(xml);
              if (result.length < 2) return Promise.reject('Unknown XML format');
              newActivity.image_urls.push(result[1]);
              return Promise.resolve();
            })
        )))
        .then(() => this.activityService.create(this.groupId, newActivity).toPromise())
        .then((activity) => {
          this.sharedDataService.activities.push(activity);
          this.event.publish('ActivityList_Refresh')
          this.navCtrl.setRoot('ActivityListPage');
        })
        .catch(() => { console.log('new activity failed') });
    }
  }
}
