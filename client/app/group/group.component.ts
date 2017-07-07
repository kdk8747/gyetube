import { Component, OnInit } from '@angular/core';
import { State } from '../constants';

import { Activity, Policy, Proceeding, Receipt } from '../_models';
import { ActivityService, ReceiptService } from '../_services';
import { /*ActivityListService,*/ PolicyListService, PolicyChangesetService, ProceedingListService/*, ReceiptListService*/ } from '../_services';

@Component({
    selector: 'group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css']
})

export class GroupComponent implements OnInit {
    proceedings: Proceeding[];
    selectedNewProceeding: boolean = false;
    newProceedingMeetingDate: string;
    newProceedingMeetingTime: string;
    newProceedingTitle: string;
    newProceedingContent: string;
    policyChangeMode: boolean = false;
    policyChangeset: Policy[] = [];

    policies: Policy[];
    selectedNewPolicy: boolean = false;

    activities: Activity[];

    receipts: Receipt[];

    

    constructor(
        private proceedingListService: ProceedingListService,
        private policyChangesetService: PolicyChangesetService,
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
        //if ( /*validate*/ ) return false;
        this.proceedingListService.addProceeding(this.newProceedingTitle, this.newProceedingContent)
            .then(() => {
                this.proceedings = this.proceedingListService.get();
                this.selectedNewProceeding = false;
            });
        this.newProceedingMeetingDate = this.newProceedingMeetingTime = this.newProceedingTitle = this.newProceedingContent = '';
            
        /*
        this.policyListService.addPolicy(content, proceedingID)
            .then(() => {
                this.policies = this.policyListService.get();
                this.selectedNewPolicy = false;
            });*/
    }

    onCancelNewProceeding(): void {
        this.selectedNewProceeding = false;
        this.onCancelPolicyChangeset();
    }

    onAddPolicyChangeset(): void {
        this.policyChangeMode = true;
    }

    onCancelPolicyChangeset(): void {
        this.policyChangeMode = false;
        this.policyChangesetService.policies = this.policyChangeset = [];
        this.policies = this.policies
            .map(p => new Policy(p.id, p.prevId, p.state, p.createdDate, p.expiryDate, p.content, p.parentProceeding, p.childActivities));
    }

    onNewPolicy(content: string, policyExpiryDate: string): boolean {
        if (!content || !policyExpiryDate) return false;
        this.policyChangeset.push(new Policy(0, 0, State.STATE_NEW_ONE, new Date(Date.now()), new Date(policyExpiryDate), content, 0, []));
        this.selectedNewPolicy = false;
        return true;
    }

    onPolicyChangesetRequested(): void {
        this.policyChangeset = this.policyChangesetService.policies;
    }
}