import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, ActivityService, AmazonService, SharedDataService } from '../../../providers';
import { MemberListElement, ActivityEditorElement, ActivityListElement, ActivityDetailElement, DecisionListElement, AmazonSignature } from '../../../models';
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
  id: number;
  //newActivityImageFile: File = null;
  newActivityImageFiles: File[] = [];

  decisions: DecisionListElement[] = [];
  members: MemberListElement[] = [];

  form: FormGroup;
  submitAttempt: boolean = false;

  prevActivity: ActivityDetailElement = new ActivityDetailElement(0,'','',null,0,'','',[],[],[],null,[],0);

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
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');

    this.event.subscribe('MemberList_Refresh', () => {
      this.members = this.sharedDataService.members.filter(member =>
        (member.member_state == 'ADDED' || member.member_state == 'UPDATED' || member.member_state == 'JOIN_APPROVED'));
    });
    this.event.subscribe('DecisionList_Refresh', () => {
      this.decisions = this.sharedDataService.decisions.filter(decision =>
        (decision.document_state == 'ADDED' || decision.document_state == 'UPDATED' || decision.document_state == 'PREDEFINED') && decision.next_id == 0);
    });

    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.members = this.sharedDataService.members.filter(member =>
        (member.member_state == 'ADDED' || member.member_state == 'UPDATED' || member.member_state == 'JOIN_APPROVED'));
      this.decisions = this.sharedDataService.decisions.filter(decision =>
        (decision.document_state == 'ADDED' || decision.document_state == 'UPDATED' || decision.document_state == 'PREDEFINED') && decision.next_id == 0);

      if (this.id) {
        this.activityService.getActivity(this.groupId, this.id)
          .subscribe((activity: ActivityDetailElement) => {
            this.form.controls['title'].setValue(activity.title);
            this.form.controls['activityDate'].setValue(activity.activity_datetime);
            this.form.controls['elapsedTime'].setValue(activity.elapsed_time);
            this.form.controls['description'].setValue(activity.description);
            this.form.controls['participants'].setValue(activity.participants.map(member => member.member_id));
            this.form.controls['parentDecision'].setValue(activity.parent_decision.decision_id);
            this.prevActivity = activity;
            console.log(this.prevActivity.image_urls);
          });
      }
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

    let newActivity = new ActivityEditorElement(this.id ? this.id : 0, this.form.value.activityDate,
      this.form.value.elapsedTime, this.form.value.title, this.form.value.description, this.prevActivity.image_urls, [],
      this.form.value.participants, +this.form.value.parentDecision);

    let dateForSign = this.amazonService.getISO8601Date(new Date(Date.now()));

    if (this.newActivityImageFiles.length == 0) {
      if (this.id) {
        this.activityService.update(this.groupId, newActivity).toPromise()
          .then((activity) => this.finalizeUpdate(activity))
          .catch(() => { console.log('new activity failed') });
      }
      else {
        this.activityService.create(this.groupId, newActivity).toPromise()
          .then((activity) => this.finalizeCreate(activity))
          .catch(() => { console.log('new activity failed') });
      }
    }
    else {
      if (this.prevActivity.image_urls.length > 0) {
        newActivity.image_urls = [];
        this.amazonService.getAmazonSignatureForActivityDELETE(this.groupId, dateForSign, this.prevActivity.image_urls).toPromise()
          .then((amzSign: AmazonSignature) => this.amazonService.deleteMultipleFile(dateForSign, amzSign).toPromise())
          .then((xml) => {
            let regexp = /<Deleted>/;
            if (!regexp.test(xml))
              return Promise.reject(xml);
            else
              return Promise.resolve();
          })
          .catch((err) => { console.log('delete image failed:\n' + err) });
      }

      this.amazonService.getAmazonSignatureForActivityPOST(this.groupId, dateForSign).toPromise()
        .then((amzSign: AmazonSignature) => Promise.all(this.newActivityImageFiles.map((file, index) =>
          this.amazonService.postImageFile(file, dateForSign, amzSign, index).toPromise()
            .then((xml: string) => {
              let regexp = /<Location>(.+)<\/Location>/;
              let result = regexp.exec(xml);
              if (result.length < 2) return Promise.reject('Unknown XML format');
              newActivity.image_urls.push(result[1]);
              return Promise.resolve();
            })
        )))
        .then(() => {
          if (this.id)
            return this.activityService.update(this.groupId, newActivity).toPromise()
              .then((activity) => this.finalizeUpdate(activity))
          else
            return this.activityService.create(this.groupId, newActivity).toPromise()
              .then((activity) => this.finalizeCreate(activity))
        })
        .catch(() => { console.log('new activity failed') });
    }
  }

  finalizeCreate(activity: ActivityListElement) {
    this.sharedDataService.activities.push(activity);
    this.event.publish('ActivityList_Refresh')
    this.navCtrl.setRoot('ActivityListPage');
  }

  finalizeUpdate(activity: ActivityEditorElement) {
    let i = this.sharedDataService.activities.findIndex(activity => activity.activity_id == this.id);
    this.sharedDataService.activities[i] = new ActivityListElement(activity.activity_id, new Date().toISOString(), activity.activity_datetime,
      activity.elapsed_time, activity.title, activity.description, activity.image_urls, activity.document_urls, activity.participant_ids.length,
      activity.parent_decision_id, this.prevActivity.child_receipts.length, this.prevActivity.total_difference);
    this.event.publish('ActivityList_Refresh');

    if (this.prevActivity.parent_decision && this.prevActivity.parent_decision.decision_id) {
      let i = this.sharedDataService.decisions.findIndex(decision => decision.decision_id == this.prevActivity.parent_decision.decision_id);
      this.sharedDataService.decisions[i].total_elapsed_time -= this.prevActivity.participants.length * this.prevActivity.elapsed_time;
      this.sharedDataService.decisions[i].total_difference -= this.prevActivity.total_difference;
    }
    if (activity.parent_decision_id){
      let i = this.sharedDataService.decisions.findIndex(decision => decision.decision_id == activity.parent_decision_id);
      this.sharedDataService.decisions[i].total_elapsed_time += activity.participant_ids.length *  activity.elapsed_time;
      this.sharedDataService.decisions[i].total_difference += this.prevActivity.total_difference;
    }
    this.event.publish('DecisionList_Refresh');

    this.navCtrl.setRoot('ActivityListPage');
  }
}
