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
    selectedNewProceeding: boolean;
    selectedNewDecision: boolean;

    constructor(
        private proceedingService: ProceedingService,
        private decisionService: DecisionService,
        private activityService: ActivityService,
        private receiptService: ReceiptService
    ) { }

    ngOnInit(): void {
        this.proceedingService.getProceedings().then(proceedings => { this.proceedings = proceedings; this.afterGetProceedings(); });
        this.decisionService.getDecisions().then(decisions => this.decisions = decisions);
        this.activityService.getActivities().then(activities => this.activities = activities);
        this.receiptService.getReceipts().then(receipts => this.receipts = receipts);
    }

    onNewProceeding(): void {
        this.selectedNewProceeding = true;
    }

    addProceeding(title: string, content: string): void {
        title = title.trim();
        content = content.trim();
        if (!title || !content) { return; }
        this.proceedingService.create({ id: 0, date: new Date(Date.now()), title: title, content: content, decisions: [] })
            .then(proceeding => {
                this.proceedings.push(proceeding);
                this.afterGetProceedings();
                this.selectedNewProceeding = false;
            });
    }

    afterGetProceedings(): void {
        this.proceedings = this.proceedings.sort((h1, h2) => {
            return h1.date < h2.date ? 1 :
                (h1.date > h2.date ? -1 : 0);
        });
    }

    onNewDecision(): void {
        this.selectedNewDecision = true;
    }

    addDecision(content: string, proceedingID: number): void {
        content = content.trim();
        let proceeding = this.proceedings.find(item => item.id === +proceedingID);
        if (!content || !proceeding) { return; }
        this.decisionService.create({ id: 0, content: content, activities: [] })
            .then(decision => {
                this.decisions.push(decision);
                this.selectedNewDecision = false;

                proceeding.decisions.push(decision.id);
                this.proceedingService.update(proceeding);
            });
    }
};