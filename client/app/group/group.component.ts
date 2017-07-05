import { Component, OnInit } from '@angular/core';

import { Activity, Policy, Proceeding, Receipt } from '../_models';
import { ActivityService, ReceiptService } from '../_services';
import { /*ActivityListService,*/ PolicyListService, ProceedingListService/*, ReceiptListService*/ } from '../_services';

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

    selectedNewProceeding: boolean;
    selectedNewPolicy: boolean;

    constructor(
        private proceedingListService: ProceedingListService,
        private policyListService: PolicyListService,
        private activityService: ActivityService,
        private receiptService: ReceiptService
    ) { }

    ngOnInit(): void {
        this.proceedingListService.init().then(() => { this.proceedings = this.proceedingListService.get() });
        this.policyListService.init().then(() => { this.policies = this.policyListService.get() });
        /*this.proceedingService.getProceedings().then(proceedings => { this.proceedings = proceedings; this.afterGetProceedings(); });
        this.policyService.getPolicys().then(policies => this.policies = policies);
        this.activityService.getActivities().then(activities => this.activities = activities);
        this.receiptService.getReceipts().then(receipts => this.receipts = receipts);*/
    }

    onNewProceeding(): void {
        this.selectedNewProceeding = true;
    }

    addProceeding(title: string, content: string): void {
        this.proceedingListService.addProceeding(title, content)
            .then(() => {
                this.proceedings = this.proceedingListService.get();
                this.selectedNewProceeding = false;
            });
    }


    onNewPolicy(): void {
        this.selectedNewPolicy = true;
    }

    addPolicy(content: string, proceedingID: number): void {
        /*
        this.policyListService.addPolicy(content, proceedingID)
            .then(() => {
                this.policies = this.policyListService.get();
                this.selectedNewPolicy = false;
            });*/
    }

    deletePolicy(): void {
    }
}