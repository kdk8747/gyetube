import { Component } from '@angular/core';
import { IonicPage, NavController, Events, FabContainer } from 'ionic-angular';
import { UtilService, DecisionService, SharedDataService } from '../../../providers';
import { DecisionListElement } from '../../../models';


@IonicPage({
  segment: 'decision-list'
})
@Component({
  selector: 'page-decision-list',
  templateUrl: 'decision-list.html',
})
export class DecisionListPage {

  decisions: DecisionListElement[] = [];

  constructor(
    public navCtrl: NavController,
    public event: Events,
    public util: UtilService,
    public decisionService: DecisionService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.refreshDecisions();

    this.event.subscribe('DecisionList_Refresh', () => {
      this.refreshDecisions();
    });
  }

  ionViewWillUnload() {
    this.event.unsubscribe('DecisionList_Refresh');
  }

  ionViewWillEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToDetail(decisionId: number) {
    if (!this.sharedDataService.decisionEditMode)
      this.navCtrl.push('DecisionDetailPage', { id: decisionId });
  }

  navigateToEditor() {
    this.navCtrl.push('DecisionEditorPage');
  }

  navigateToEditorForUpdate(id: number) {
    this.navCtrl.push('DecisionEditorPage', { id: id });
  }

  sortByDate(decisions: DecisionListElement[]): DecisionListElement[] {
    return decisions.sort((h1, h2) => {
      return h1.meeting_datetime < h2.meeting_datetime ? 1 :
        (h1.meeting_datetime > h2.meeting_datetime ? -1 : 0);
    });
  }

  filterPastDecisions(decisions: DecisionListElement[]): DecisionListElement[] {
    return decisions.filter(decision =>
      (decision.document_state == 'ADDED' || decision.document_state == 'UPDATED' || decision.document_state == 'PREDEFINED')
      && new Date(decision.expiry_datetime).getTime() > new Date(Date.now()).getTime()
      && decision.next_id == 0
    );
  }

  refreshDecisions() {
    this.decisions =
        this.sharedDataService.decisionListTimelineMode ?
          this.sortByDate(this.sharedDataService.decisions) :
          this.sortByDate(this.filterPastDecisions(this.sharedDataService.decisions));
  }

  onFAB(fab: FabContainer) {
    fab.close();
    this.refreshDecisions();
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }
}
