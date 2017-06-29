import { Component, OnInit } from '@angular/core';

import { Activity, Decision, Proceeding, Receipt } from '../_models';
import { ActivityService, DecisionService, ProceedingService, ReceiptService } from '../_services';

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
        this.proceedingService.getProceedings().then(proceedings => this.proceedings = proceedings);
        this.decisionService.getDecisions().then(decisions => this.decisions = decisions);
        this.activityService.getActivities().then(activities => this.activities = activities);
        this.receiptService.getReceipts().then(receipts => this.receipts = receipts);
    }
};