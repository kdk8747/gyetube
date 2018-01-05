import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, GroupService, AmazonService, SharedDataService, RoleService } from '../../providers';
import { GroupEditorElement } from '../../models';
import { TranslateService } from '@ngx-translate/core';


@IonicPage({
  segment: 'group-editor'
})
@Component({
  selector: 'page-group-editor',
  templateUrl: 'group-editor.html',
})
export class GroupEditorPage {

  form: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public event: Events,
    public util: UtilService,
    public groupService: GroupService,
    public roleService: RoleService,
    public amazonService: AmazonService,
    public sharedDataService: SharedDataService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      title: ['', Validators.compose([Validators.required, Validators.maxLength(32)])],
      url: ['', Validators.compose([Validators.required, Validators.maxLength(32)])],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(1024)])]
    });
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.translate.get(['I18N_EDITOR', 'I18N_GROUP']).subscribe(values => {
      this.sharedDataService.headerDetailTitle = values.I18N_GROUP + ' - ' + values.I18N_EDITOR;
    });
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('GroupListPage');
    else
      this.navCtrl.pop();
  }

  onSave(): void {
    this.submitAttempt = true;

    if (!this.form.valid) return;
    this.form.value.title = this.form.value.title.trim();
    this.form.value.description = this.form.value.description.trim();

    let newGroup = new GroupEditorElement(this.form.value.url, this.form.value.title, this.form.value.description);

    this.groupService.create(newGroup).toPromise()
      .then((group) => {
        this.popNavigation();
        this.util.setCurrentGroupId(group.group_id);
        this.navCtrl.push('TabsGroupPage', { group_url_segment: group.url_segment });
        return this.roleService.getRoleMyselfToken(group.group_id).toPromise();
      })
      .then(token => {
        this.util.setToken(token);
      })
      .catch(() => { console.log('new group failed') });
  }
}
