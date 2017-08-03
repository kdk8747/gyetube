import { Component, OnInit } from '@angular/core';
import { State } from '../constants';

import { Activity, Decision, Proceeding, Receipt } from '../_models';
import { ProceedingService, DecisionService, ActivityService, ReceiptService } from '../_services';

@Component({
    selector: 'group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css']
})

export class GroupComponent implements OnInit {
    proceedings: Proceeding[];
    decisions: Decision[];
    activities: Activity[];
    receipts: Receipt[];

    constructor(
        private proceedingService: ProceedingService,
        private decisionService: DecisionService,
        private activityService: ActivityService,
        private receiptService: ReceiptService
    ) { }

    ngOnInit(): void {
        this.proceedingService.getProceedings().then(proceedings => { this.proceedings = proceedings; this.sortByDate(); });
        this.decisionService.getDecisions().then(decisions => { this.decisions = decisions; this.filterPastDecisions(); });
        this.activityService.getActivities().then(activities => {this.activities = activities; this.sortByDateA(); });
        this.receiptService.getReceipts().then(receipts => {this.receipts = receipts; this.sortByDateR(); });
    }

    sortByDate(): void {
        this.proceedings = this.proceedings.sort((h1, h2) => {
            return h1.meetingDate < h2.meetingDate ? 1 :
                (h1.meetingDate > h2.meetingDate ? -1 : 0);
        });
    }

    sortByDateR(): void {
        this.receipts = this.receipts.sort((h1, h2) => {
            return h1.paymentDate < h2.paymentDate ? 1 :
                (h1.paymentDate > h2.paymentDate ? -1 : 0);
        });
    }

    sortByDateA(): void {
        this.activities = this.activities.sort((h1, h2) => {
            return h1.activityDate < h2.activityDate ? 1 :
                (h1.activityDate > h2.activityDate ? -1 : 0);
        });
    }

    filterPastDecisions(): void {
        let decisionIdToIndex = {};
        for (let i = 0; i < this.decisions.length; i ++)
            decisionIdToIndex[this.decisions[i].id] = i;

        let visitedIndex = new Array<boolean>(this.decisions.length).fill(false);
        for (let i = 0; i < this.decisions.length; i ++) {
            if (this.decisions[i].prevId)
                visitedIndex[decisionIdToIndex[this.decisions[i].prevId]] = true;
            if (this.decisions[i].state == State.STATE_DELETED)
                visitedIndex[decisionIdToIndex[this.decisions[i].id]] = true;
        }

        this.decisions = this.decisions.filter(decision => !visitedIndex[decisionIdToIndex[decision.id]]);
    }

    onDecisionsRefreshRequested(): void {
        this.decisions = this.decisions
            .map(p => new Decision(p.id, p.prevId, p.state, p.createdDate, p.expiryDate, p.content, p.parentProceeding, p.childActivities));
        this.filterPastDecisions();
    }
}