import { Component, OnInit } from '@angular/core';

import { Activity, Policy, Proceeding, Receipt } from '../_models';
import { ProceedingService, PolicyService, ActivityService, ReceiptService } from '../_services';

@Component({
    selector: 'group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css']
})

export class GroupComponent implements OnInit {
    proceedings: Proceeding[];
    policies: Policy[];
    activities: Activity[];
    receipts: Receipt[];

    constructor(
        private proceedingService: ProceedingService,
        private policyService: PolicyService,
        private activityService: ActivityService,
        private receiptService: ReceiptService
    ) { }

    ngOnInit(): void {
        this.proceedingService.getProceedings().then(proceedings => { this.proceedings = proceedings; this.sortByDate(); });
        this.policyService.getPolicies().then(policies => this.policies = policies);
        this.activityService.getActivities().then(activities => this.activities = activities);
        this.receiptService.getReceipts().then(receipts => this.receipts = receipts);
    }

    sortByDate(): void {
        this.proceedings = this.proceedings.sort((h1, h2) => {
            return h1.meetingDate < h2.meetingDate ? 1 :
                (h1.meetingDate > h2.meetingDate ? -1 : 0);
        });
    }

    onPoliciesRefreshRequested(): void {
        this.policies = this.policies
            .map(p => new Policy(p.id, p.prevId, p.state, p.createdDate, p.expiryDate, p.content, p.parentProceeding, p.childActivities));
    }
}