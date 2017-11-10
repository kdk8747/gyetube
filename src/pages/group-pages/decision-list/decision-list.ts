import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { UtilService, DecisionService } from '../../../providers';
import { Decision } from '../../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'decision-list'
})
@Component({
  selector: 'page-decision-list',
  templateUrl: 'decision-list.html',
})
export class DecisionListPage {

  groupId: string;
  editMode: boolean = false;
  decisions: Observable<Decision[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public decisionService: DecisionService) {
  }

  ionViewDidLoad() {
    this.editMode = this.navParams.get('editMode');
    this.groupId = this.util.getCurrentGroupId();
    this.decisions = this.decisionService.getDecisions(this.groupId);

    this.event.subscribe('EventDecisionDetailPage', (obj) => {
      let top:ViewController = this.navCtrl.last();
      if (top.id !== 'DecisionDetailPage' || top.data.id !== obj.id)
        this.navCtrl.push('DecisionDetailPage', { id: obj.id });
    });

    this.event.subscribe('DecisionEditModeOn', (obj) => {
      this.editMode = true;
    });

    this.event.subscribe('DecisionEditModeOff', (obj) => {
      this.editMode = false;
    });

    this.event.publish('ShowHeader');
  }

  ionViewWillUnload() {
    this.event.unsubscribe('EventDecisionDetailPage');
    this.event.unsubscribe('DecisionEditModeOn');
    this.event.unsubscribe('DecisionEditModeOff');
  }

  navigateToDetail(decisionId: number) {
    this.navCtrl.push('DecisionDetailPage', { id: decisionId });
  }

  navigateToEditor() {
    this.navCtrl.push('DecisionEditorPage');
  }

}
